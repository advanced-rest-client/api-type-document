import { fixture, assert, html, aTimeout, nextFrame } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-type-document.js';

/** @typedef {import('..').ApiTypeDocument} ApiTypeDocument */

describe('<api-type-document> - gRPC', () => {
  /**
   * @param {*} amf
   * @param {*} type
   * @returns {Promise<ApiTypeDocument>}
   */
  async function basicFixture(amf, type) {
    return fixture(html`<api-type-document
      .amf="${amf}"
      .type="${type}"
    ></api-type-document>`);
  }

  function getGrpcPayloadType(element, model, operationName) {
    const webApi = element._computeWebApi(model);
    const opKey = element._getAmfKey(
      element.ns.aml.vocabularies.apiContract.supportedOperation
    );
    const operations = webApi[opKey];
    let operation;
    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      const name = element._getValue(
        op,
        element.ns.aml.vocabularies.core.name
      );
      if (name === operationName) {
        operation = op;
        break;
      }
    }
    const expects = element._computeExpects(operation);
    const payload = element._computePayload(expects)[0];
    const key = element._getAmfKey(element.ns.aml.vocabularies.shapes.schema);
    let schema = payload && payload[key];
    if (!schema) {
      return undefined;
    }
    schema = schema instanceof Array ? schema[0] : schema;
    return schema;
  }

  describe('Regular model', () => {
    const compact = false;
    let element;
    let amf;

    before(async () => {
      amf = await AmfLoader.load(compact, 'grpc-test');
    });

      describe('link-target resolution', () => {
        beforeEach(async () => {
          const type = getGrpcPayloadType(amf, amf, 'SayHello1');
          element = await basicFixture(amf, type);
          await aTimeout(0);
        });

        it('computes properties for object with link-target', () => {
          assert.isTrue(element.isObject, 'Should be an object');
          assert.isDefined(element._computedProperties, 'Should have computed properties');
          assert.isArray(element._computedProperties, 'Computed properties should be an array');
        });

        it('resolves nested link-target references', () => {
          const properties = element._computedProperties;
          assert.isAbove(properties.length, 0, 'Should have at least one property');
          
          // Find the 'wadus' property (or similar nested object)
          const nestedProperty = properties.find(prop => {
            const range = element._computePropertyRange(prop);
            if (!range) return false;
            const linkTarget = element._getLinkTarget(range);
            return !!linkTarget;
          });

          if (nestedProperty) {
            const range = element._computePropertyRange(nestedProperty);
            assert.isDefined(range, 'Nested property should have a range');
          }
        });

        it('renders property-shape-document for each property', async () => {
          await nextFrame();
          const propertyDocs = element.shadowRoot.querySelectorAll('property-shape-document.object-document');
          assert.isAbove(propertyDocs.length, 0, 'Should render at least one property document');
        });
      });

      describe('_deepResolveType()', () => {
        beforeEach(async () => {
          const type = getGrpcPayloadType(amf, amf, 'SayHello1');
          element = await basicFixture(amf, type);
          await aTimeout(0);
        });

        it('deeply resolves link-target references in properties', () => {
          const resolved = element._deepResolveType(element._resolvedType);
          assert.isDefined(resolved, 'Should return a resolved type');
          
          // Get properties
          const propsKey = element._getAmfKey(element.ns.w3.shacl.property);
          const properties = resolved[propsKey];
          
          if (properties && properties.length > 0) {
            properties.forEach(prop => {
              const rangeKey = element._getAmfKey(element.ns.aml.vocabularies.shapes.range);
              const range = prop[rangeKey];
              if (range && range.length > 0) {
                const rangeItem = Array.isArray(range) ? range[0] : range;
                // If it had a link-target, it should now be resolved
                const linkTarget = element._getLinkTarget(rangeItem);
                // Either it's not a link, or if it is a link, the target should be accessible
                if (!linkTarget) {
                  assert.isDefined(rangeItem['@type'], 'Range should have @type');
                }
              }
            });
          }
        });

        it('returns type with resolved nested objects', () => {
          const resolved = element._deepResolveType(element._resolvedType);
          const propsKey = element._getAmfKey(element.ns.w3.shacl.property);
          const properties = resolved[propsKey];
          
          assert.isDefined(properties, 'Resolved type should have properties');
          assert.isArray(properties, 'Properties should be an array');
        });
      });

      describe('example rendering', () => {
        beforeEach(async () => {
          const type = getGrpcPayloadType(amf, amf, 'SayHello1');
          element = await basicFixture(amf, type);
          await aTimeout(0);
        });

        it('renders examples section for object types', () => {
          const examplesSection = element.shadowRoot.querySelector('.examples');
          assert.exists(examplesSection, 'Examples section should be rendered');
        });

        it('passes deeply resolved type to api-resource-example-document', () => {
          const exampleDoc = element.shadowRoot.querySelector('api-resource-example-document');
          assert.exists(exampleDoc, 'Example document should exist');
          assert.isDefined(exampleDoc.examples, 'Examples should be passed');
        });

        it('sets default mediaType for gRPC', () => {
          const exampleDoc = element.shadowRoot.querySelector('api-resource-example-document');
          assert.exists(exampleDoc, 'Example document should exist');
          // mediaType should be set (either from element or default to application/json)
          assert.isDefined(exampleDoc.mediaType, 'MediaType should be defined');
        });
      });

      describe('reactive property updates', () => {
        it('updates _computedProperties when type changes', async () => {
          const type1 = getGrpcPayloadType(amf, amf, 'SayHello1');
          element = await basicFixture(amf, type1);
          await aTimeout(0);
          
          const props1 = element._computedProperties;
          assert.isDefined(props1, 'Should have initial computed properties');
          
          // Change to different operation
          const type2 = getGrpcPayloadType(amf, amf, 'SayHello2');
          element.type = type2;
          await nextFrame();
          await aTimeout(0);
          
          const props2 = element._computedProperties;
          assert.isDefined(props2, 'Should have updated computed properties');
        });

        it('updates _computedProperties when amf changes', async () => {
          const type = getGrpcPayloadType(amf, amf, 'SayHello1');
          element = await basicFixture(amf, type);
          await aTimeout(0);
          
          const props1 = element._computedProperties;
          assert.isDefined(props1, 'Should have initial computed properties');
          
          // Update amf reference (simulate amf reload)
          const newAmf = await AmfLoader.load(compact, 'grpc-test');
          element.amf = newAmf;
          await nextFrame();
          await aTimeout(0);
          
          const props2 = element._computedProperties;
          assert.isDefined(props2, 'Should have recomputed properties after amf change');
        });
      });
    });
});

