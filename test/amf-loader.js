import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

/**
 * @mixes AmfHelperMixin
 */
class HelperElement extends AmfHelperMixin(Object) {}

const helper = new HelperElement();

/**
 * Sets the model on the helper and returns the expanded model to navigate.
 *
 * amf 5.11.x emits models in flattened `@graph` form. The `amf` setter expands
 * them internally (see AmfHelperMixin `_expand`), but the raw `@graph` model is
 * not navigable by the `_compute*` helpers or by direct key indexing — its
 * `declares`/`encodes` live under `@graph[0]` behind full IRIs. Callers must
 * operate on the expanded model returned here.
 *
 * @param {Object|Array} model Raw (possibly flattened/`@graph`) API model.
 * @return {Object} Expanded model ready for navigation.
 */
const expand = (model) => {
  helper.amf = model;
  const { amf } = helper;
  return Array.isArray(amf) ? amf[0] : amf;
};

export const AmfLoader = {};

/**
 * Downloads the raw model file. amf 5.11.x writes it in flattened `@graph`
 * form; use `AmfLoader.load` (which expands) for anything that navigates the
 * model directly.
 */
AmfLoader.loadRaw = async function (compact, modelFile) {
  modelFile = modelFile || 'demo-api';
  const file = '/' + modelFile + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      const data = JSON.parse(e.target.response);
      resolve(data);
    });
    xhr.open('GET', url);
    xhr.send();
  });
};

/**
 * Downloads and expands the model. amf 5.11.x emits flattened `@graph` models
 * that the `_compute*` helpers and direct key indexing cannot navigate; the
 * expanded model restores the array-of-one-document shape callers expect (and
 * that the `amf` setter also produces internally). Returned as a single-element
 * array for backwards compatibility with callers that read `model[0]`.
 */
AmfLoader.load = async function (compact, modelFile) {
  const raw = await AmfLoader.loadRaw(compact, modelFile);
  const expanded = expand(raw);
  return Array.isArray(expanded) ? expanded : [expanded];
};

AmfLoader.loadType = async function (name, compact, modelFile) {
  const raw = await AmfLoader.loadRaw(compact, modelFile);
  const amf = expand(raw);
  const ns = helper.ns;
  const decKey = helper._getAmfKey(ns.aml.vocabularies.document.declares);
  const nameKey = helper._getAmfKey(ns.w3.shacl.name);

  const defs = helper._ensureArray(amf[decKey]);
  if (!defs) {
    return undefined;
  }
  for (let i = 0; i < defs.length; i++) {
    let type = defs[i];
    if (type instanceof Array) {
      type = type[0];
    }
    let nameData = type[nameKey];
    if (!nameData) {
      continue;
    }
    if (nameData instanceof Array) {
      nameData = nameData[0];
    }
    const typeName = nameData['@value'];
    if (typeName === name) {
      return [amf, type];
    }
  }
  return undefined;
};

AmfLoader.lookupEndpoint = function (model, endpoint) {
  const expanded = expand(model);
  const webApi = helper._computeWebApi(expanded);
  return helper._computeEndpointByPath(webApi, endpoint);
};

AmfLoader.lookupOperation = function (model, endpoint, operation) {
  const endPoint = AmfLoader.lookupEndpoint(model, endpoint, operation);
  const opKey = helper._getAmfKey(
    helper.ns.aml.vocabularies.apiContract.supportedOperation
  );
  const ops = helper._ensureArray(endPoint[opKey]);
  return ops.find(
    (item) =>
      helper._getValue(item, helper.ns.aml.vocabularies.apiContract.method) ===
      operation
  );
};

AmfLoader.lookupParameters = function (model, endpoint, operation) {
  const op = AmfLoader.lookupOperation(model, endpoint, operation);
  const expects = helper._computeExpects(op);
  return helper._ensureArray(helper._computeQueryParameters(expects));
};

AmfLoader.lookupPayload = function (model, endpoint, operation) {
  const op = AmfLoader.lookupOperation(model, endpoint, operation);
  const expects = helper._computeExpects(op);
  return helper._ensureArray(helper._computePayload(expects));
};

AmfLoader.lookupPayloadProperty = function (model, payload, property) {
  expand(model);
  const shape =
    payload[helper._getAmfKey(helper.ns.aml.vocabularies.shapes.schema)][0];
  const properties = shape[helper._getAmfKey(helper.ns.w3.shacl.property)];
  for (let i = 0; i < properties.length; i++) {
    const item = properties[i];
    const itemName = helper._getValue(item, helper.ns.w3.shacl.name);
    if (itemName === property) {
      return item;
    }
  }
};

AmfLoader.lookupArrayItemRange = function (model, array) {
  expand(model);
  const range =
    array[helper._getAmfKey(helper.ns.aml.vocabularies.shapes.range)][0];
  helper._resolve(range);
  return range;
};

AmfLoader.lookupPropertyShape = function (model, type, property) {
  expand(model);
  const propKey = helper._getAmfKey(helper.ns.w3.shacl.property);
  const props = type[propKey];
  for (let i = 0, len = props.length; i < len; i++) {
    const item = props[i];
    const itemName = helper._getValue(item, helper.ns.w3.shacl.name);
    if (itemName === property) {
      return item;
    }
  }
};

AmfLoader.getResponseSchema = function (
  element,
  model,
  endpoint,
  method,
  statusCode
) {
  const rKey = element._getAmfKey(
    element.ns.aml.vocabularies.apiContract.returns
  );
  const operation = AmfLoader.lookupOperation(model, endpoint, method);
  const responses = operation[rKey];

  let status;
  for (let j = 0, jLen = responses.length; j < jLen; j++) {
    const s = responses[j];
    const value = element._getValue(
      s,
      element.ns.aml.vocabularies.apiContract.statusCode
    );
    if (value === statusCode) {
      status = s;
      break;
    }
  }

  const sKey = element._getAmfKey(
    element.ns.aml.vocabularies.apiContract.payload
  );
  const schemaKey = element._getAmfKey(
    element.ns.aml.vocabularies.shapes.schema
  );
  return status ? status[sKey][0][schemaKey] : status;
};
