/* eslint-disable prefer-destructuring */
import { fixture, assert, nextFrame, aTimeout, waitUntil } from '@open-wc/testing'
import { AmfLoader } from './amf-loader.js';
import '../api-type-document.js';

/** @typedef {import('..').ApiTypeDocument} ApiTypeDocument */
/** @typedef {import('..').PropertyShapeDocument} PropertyShapeDocument */

describe('<api-type-document>', () => {
  const newOas3Types = 'new-oas3-types';

  /**
   * @returns {Promise<ApiTypeDocument>}
   */
  async function basicFixture() {
    return fixture(`<api-type-document></api-type-document>`);
  }

  function getPayloadType(element, model, path, methodName) {
    const webApi = element._computeWebApi(model);
    const endpoint = element._computeEndpointByPath(webApi, path);
    const opKey = element._getAmfKey(
      element.ns.aml.vocabularies.apiContract.supportedOperation
    );
    const methods = endpoint[opKey];
    let method;
    for (let j = 0, jLen = methods.length; j < jLen; j++) {
      const m = methods[j];
      const value = element._getValue(
        m,
        element.ns.aml.vocabularies.apiContract.method
      );
      if (value === methodName) {
        method = m;
        break;
      }
    }
    const expects = element._computeExpects(method);
    const payload = element._computePayload(expects)[0];
    const mt = element._getValue(
      payload,
      element.ns.aml.vocabularies.core.mediaType
    );
    const key = element._getAmfKey(element.ns.aml.vocabularies.shapes.schema);
    let schema = payload && payload[key];
    if (!schema) {
      return undefined;
    }
    schema = schema instanceof Array ? schema[0] : schema;
    return [schema, mt];
  }

  describe('Model independent', () => {
    describe('Basic', () => {
      it('Renders no params table without data', async () => {
        const element = await basicFixture();
        const doc = element.shadowRoot.querySelector('property-shape-document');
        assert.notOk(doc);
        const type = element.shadowRoot.querySelector('api-type-document');
        assert.notOk(type);
      });
    });

    describe('_computeArrayParentName()', () => {
      let element = /** @type ApiTypeDocument */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns argument', () => {
        const value = 'abcd';
        const result = element._computeArrayParentName(value);
        assert.equal(result, value);
      });

      it('Returns empty string when no argument', () => {
        const result = element._computeArrayParentName();
        assert.equal(result, '');
      });
    });

    describe('_unionTypesChanged()', () => {
      let element = /** @type ApiTypeDocument */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Does nothing whe no argument', () => {
        element.selectedUnion = 1;
        element._multiTypesChanged('selectedUnion', undefined);
        assert.equal(element.selectedUnion, 1);
      });

      it('Re-sets selected union index', () => {
        element.selectedUnion = 1;
        element._multiTypesChanged('selectedUnion', []);
        assert.equal(element.selectedUnion, 0);
      });
    });

    describe('_computeRenderMainExample()', () => {
      let element = /** @type ApiTypeDocument */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns true when has examples and not stopped', () => {
        const result = element._computeRenderMainExample(false, true);
        assert.isTrue(result);
      });

      it('Returns false when no examples and not stopped', () => {
        const result = element._computeRenderMainExample(false, false);
        assert.isFalse(result);
      });

      it('Returns false when has examples and stopped', () => {
        const result = element._computeRenderMainExample(true, true);
        assert.isFalse(result);
      });

      it('Returns false when type is scalar', () => {
        const result = element._computeRenderMainExample(true, true, true);
        assert.isFalse(result);
      });
    });
  });

  [
    ['Regular model', false],
    ['Compact model', true],
  ].forEach((item) => {
    describe(String(item[0]), () => {
      describe('a11y', () => {
        let element = /** @type ApiTypeDocument */ (null);
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('is accessible for scalar type', async () => {
          const data = await AmfLoader.loadType('ScalarType', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          await assert.isAccessible(element);
        });

        it('is accessible for NilShape type', async () => {
          const data = await AmfLoader.loadType('NilType', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          await assert.isAccessible(element);
        });

        it('is accessible for AnyShape type', async () => {
          const data = await AmfLoader.loadType('AnyType', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          await assert.isAccessible(element);
        });

        it('is accessible for UnionShape type', async () => {
          const data = await AmfLoader.loadType('Unionable', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          await assert.isAccessible(element);
        });

        it('is accessible for ArrayShape type', async () => {
          const data = await AmfLoader.loadType('ArrayType', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          await assert.isAccessible(element);
        });
      });

      describe('_typeChanged()', () => {
        let element = /** @type ApiTypeDocument */ (null);
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Computes isScalar for ScalarShape', async () => {
          const data = await AmfLoader.loadType('ScalarType', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.isTrue(element.isScalar);
        });

        it('Computes isScalar for NilShape', async () => {
          const data = await AmfLoader.loadType('NilType', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.isTrue(element.isScalar);
        });

        it('Computes isScalar for AnyShape', async () => {
          const data = await AmfLoader.loadType('AnyType', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.isTrue(element.isScalar);
        });

        it('Computes isUnion for UnionShape', async () => {
          const data = await AmfLoader.loadType('Unionable', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.isTrue(element.isUnion);
        });

        it('Sets unionTypes', async () => {
          const data = await AmfLoader.loadType('Unionable', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.typeOf(element.unionTypes, 'array');
          assert.lengthOf(element.unionTypes, 2);
        });

        it('Computes isArray for ArrayShape', async () => {
          const data = await AmfLoader.loadType('ArrayType', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.isTrue(element.isArray);
        });

        it('Computes isArray for ArrayShape with [] notation', async () => {
          const data = await AmfLoader.loadType('Arrable2', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.isTrue(element.isArray);
        });

        it('Computes isObject for NodeShape', async () => {
          const data = await AmfLoader.loadType('Notification', item[1]);
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.isTrue(element.isObject);
        });

        it('Computes isAnd for AnyShape with "and" property', async () => {
          const data = await AmfLoader.loadType('Pet', item[1], 'Petstore');
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.isTrue(element.isAnd);
        });

        it('Sets andTypes for AnyShape with "and" property', async () => {
          const data = await AmfLoader.loadType('Pet', item[1], 'Petstore');
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          assert.typeOf(element.andTypes, 'array');
          assert.lengthOf(element.andTypes, 3);
        });

        it('Sets andTypes for ArrayShape with "and" property', async () => {
          const data = await AmfLoader.load(item[1], 'APIC-429');
          element.amf = data[0];
          const payload = AmfLoader.getResponseSchema(
            element,
            data[0],
            '/pets',
            'get',
            '200'
          );
          element._typeChanged(element._resolve(payload[0]));
          assert.isFalse(element.isArray);
          assert.isTrue(element.isAnd);
          assert.typeOf(element.andTypes, 'array');
          assert.lengthOf(element.andTypes, 2);
        });
      });

      describe('_selectUnion()', () => {
        let element = /** @type ApiTypeDocument */ (null);
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('Unionable', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          element.type = type;
          await aTimeout(0);
        });

        it('selectedUnion is 0', () => {
          assert.equal(element.selectedUnion, 0);
        });

        it('unionTypes is computed', () => {
          assert.typeOf(element.unionTypes, 'array');
        });

        it('Sets event target as active when selecting current selection', async () => {
          await nextFrame();
          const nodes = element.shadowRoot.querySelectorAll(
            '.union-type-selector .union-toggle'
          );
          /** @type HTMLElement */ (nodes[1]).click();
          await nextFrame();
          assert.isTrue(nodes[1].hasAttribute('activated'));
        });

        it('Changes the selection', async () => {
          await nextFrame();
          const nodes = element.shadowRoot.querySelectorAll(
            '.union-type-selector .union-toggle'
          );
          /** @type HTMLElement */ (nodes[1]).click();
          assert.equal(element.selectedUnion, 1);
        });
      });

      describe('_computeUnionProperty()', () => {
        let element = /** @type ApiTypeDocument */ (null);
        let key;

        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Computes union type', async () => {
          const [amf, type] = await AmfLoader.loadType('Unionable', item[1]);
          element.amf = amf;
          key = element._getAmfKey(element.ns.aml.vocabularies.shapes.anyOf);
          const result = element._computeProperty(type, key, 0);
          assert.typeOf(result, 'object');
        });

        it('Returns undefined when no type', () => {
          key = element._getAmfKey(element.ns.aml.vocabularies.shapes.anyOf);
          const result = element._computeProperty(undefined, key, undefined);
          assert.isUndefined(result);
        });

        it('Returns undefined when no anyOf property', () => {
          key = element._getAmfKey(element.ns.aml.vocabularies.shapes.anyOf);
          const result = element._computeProperty({}, key, undefined);
          assert.isUndefined(result);
        });

        it('Computes union type for an array item', async () => {
          const [amf, type] = await AmfLoader.loadType('UnionArray', item[1]);
          element.amf = amf;
          key = element._getAmfKey(element.ns.aml.vocabularies.shapes.anyOf);
          const result = element._computeProperty(type, key, 0);
          assert.isTrue(
            element._hasType(
              result,
              element.ns.aml.vocabularies.shapes.ScalarShape
            )
          );
        });
      });

      describe('_computeProperties()', () => {
        let element = /** @type ApiTypeDocument */ (null);
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Returns passed item is array', () => {
          // Used when recursively rendering properties
          const result = element._computeProperties(['test']);
          assert.deepEqual(result, ['test']);
        });

        it('Returns undefined for no argument', () => {
          const result = element._computeProperties();
          assert.isUndefined(result);
        });

        it('Computes object properties', async () => {
          const data = await AmfLoader.loadType('Image', item[1]);
          element.amf = data[0];
          const result = element._computeProperties(data[1]);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 2);
        });
      });

      describe('_computeAndTypes()', () => {
        let element = /** @type ApiTypeDocument */ (null);
        let amf;
        let type;
        let list;
        before(async () => {
          const data = await AmfLoader.loadType('Pet', item[1], 'Petstore');
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          const key = element._getAmfKey(element.ns.w3.shacl.and);
          list = type[key];
        });

        it('Returns an array', () => {
          const result = element._computeAndTypes(list);
          assert.typeOf(result, 'array');
        });

        it('Label is computed', () => {
          const result = element._computeAndTypes(list);
          assert.equal(result[0].label, 'NewPet');
        });

        it('Type is computed', () => {
          const result = element._computeAndTypes(list);
          assert.typeOf(result[0].type, 'object');
        });

        it('Inline label is undefined', () => {
          const result = element._computeAndTypes(list);
          assert.isUndefined(result[2].label);
        });
      });

      describe('Object type', () => {
        let element = /** @type ApiTypeDocument */ (null);
        beforeEach(async () => {
          const data = await AmfLoader.loadType('Notification', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout(0);
        });

        it('isObject is true', () => {
          assert.isTrue(element.isObject);
        });

        it('Renders object document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.object-document'
          );
          assert.ok(doc);
        });

        it('Does not render array document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.array-document'
          );
          assert.notOk(doc);
        });

        it('Does not render scalar document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.shape-document'
          );
          assert.notOk(doc);
        });

        it('Does not render union selector', () => {
          const selector = element.shadowRoot.querySelector(
            '.union-type-selector'
          );
          assert.notOk(selector);
        });

        it('Does not render union document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.union-document'
          );
          assert.notOk(doc);
        });
      });

      describe('Array type', () => {
        let element = /** @type ApiTypeDocument */ (null);
        beforeEach(async () => {
          const data = await AmfLoader.loadType('ArrayType', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout(0);
        });

        it('isArray is true', () => {
          assert.isTrue(element.isArray);
        });

        it('Does not render object document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.object-document'
          );
          assert.notOk(doc);
        });

        it('Renders array document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.array-document'
          );
          assert.ok(doc);
        });

        it('Does not render scalar document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.shape-document'
          );
          assert.notOk(doc);
        });

        it('Does not render union selector', () => {
          const selector = element.shadowRoot.querySelector(
            '.union-type-selector'
          );
          assert.notOk(selector);
        });

        it('Does not render union document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.union-document'
          );
          assert.notOk(doc);
        });
      });

      describe('Scalar type', () => {
        let element = /** @type ApiTypeDocument */ (null);

        beforeEach(async () => {
          const data = await AmfLoader.loadType('BooleanType', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout(0);
        });

        it('isScalar is true', () => {
          assert.isTrue(element.isScalar);
        });

        it('Does not render object document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.object-document'
          );
          assert.notOk(doc);
        });

        it('Does not render array document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.array-document'
          );
          assert.notOk(doc);
        });

        it('Renders scalar document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.shape-document'
          );
          assert.ok(doc);
        });

        it('Does not render union selector', () => {
          const selector = element.shadowRoot.querySelector(
            '.union-type-selector'
          );
          assert.notOk(selector);
        });

        it('Does not render union document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.union-document'
          );
          assert.notOk(doc);
        });

        it('Does not render main example', () => {
          const examples = element.shadowRoot.querySelector(
            'examples'
          );
          assert.notOk(examples);
        });
      });

      describe('Nil type', () => {
        let element = /** @type ApiTypeDocument */ (null);

        beforeEach(async () => {
          const data = await AmfLoader.loadType('NilType', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout(0);
        });

        it('isScalar is true', () => {
          assert.isTrue(element.isScalar);
        });
      });

      describe('Union type', () => {
        let element = /** @type ApiTypeDocument */ (null);

        beforeEach(async () => {
          const data = await AmfLoader.loadType('Unionable', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout(0);
        });

        it('isUnion is true', () => {
          assert.isTrue(element.isUnion);
        });

        it('Does not render object document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.object-document'
          );
          assert.notOk(doc);
        });

        it('Does not render array document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.array-document'
          );
          assert.notOk(doc);
        });

        it('Does not render scalar document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.shape-document'
          );
          assert.notOk(doc);
        });

        it('Renders union selector', () => {
          const selector = element.shadowRoot.querySelector(
            '.union-type-selector'
          );
          assert.ok(selector);
        });

        it('Selects first union => selectedUnion = 0', () => {
          assert.equal(element.selectedUnion, 0);
        });

        it('Renders union document', () => {
          const doc = element.shadowRoot.querySelector(
            'api-type-document.union-document'
          );
          assert.ok(doc);
        });

        it('Renders 2 union type change buttons', () => {
          const buttons = element.shadowRoot.querySelectorAll('.union-toggle');
          assert.equal(buttons.length, 2);
        });

        it('Button change selection', () => {
          const buttons = element.shadowRoot.querySelectorAll('.union-toggle');
          /** @type HTMLElement */ (buttons[1]).click();
          assert.equal(element.selectedUnion, 1);
        });

        it('Selection change computes properties for the table', () => {
          element.selectedUnion = 1;
          const doc = element.shadowRoot.querySelector(
            'api-type-document.union-document'
          );
          const key = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.anyOf
          );
          const type = element.type[key][0];
          // @ts-ignore
          assert.deepEqual(doc.type, type);
        });
      });

      describe('And type', () => {
        let element = /** @type ApiTypeDocument */ (null);

        beforeEach(async () => {
          const data = await AmfLoader.loadType('Pet', item[1], 'Petstore');
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout(0);
        });

        it('isAnd is true', () => {
          assert.isTrue(element.isAnd);
        });

        it('Does not render object document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.object-document'
          );
          assert.notOk(doc);
        });

        it('Does not render array document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.array-document'
          );
          assert.notOk(doc);
        });

        it('Does not render scalar document', () => {
          const doc = element.shadowRoot.querySelector(
            'property-shape-document.shape-document'
          );
          assert.notOk(doc);
        });

        it('"And" documents are in the DOM', () => {
          const docs = element.shadowRoot.querySelectorAll(
            'api-type-document.and-document'
          );
          assert.lengthOf(docs, 3);
        });

        it('Inheritance labels are rendered', () => {
          const docs = element.shadowRoot.querySelectorAll(
            '.inheritance-label'
          );
          assert.lengthOf(docs, 3);
        });
      });

      describe('readOnly properties', () => {
        let element = /** @type ApiTypeDocument */ (null);

        beforeEach(async () => {
          const data = await AmfLoader.loadType(
            'Article',
            item[1],
            'read-only-properties'
          );
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout(0);
        });

        it('does not render the readOnly properties', async () => {
          element.renderReadOnly = false;
          await nextFrame();
          assert.lengthOf(
            element.shadowRoot.querySelectorAll('property-shape-document'),
            1
          );
        });

        it('renders the readOnly properties', async () => {
          element.renderReadOnly = true;
          await nextFrame();
          assert.lengthOf(
            element.shadowRoot.querySelectorAll('property-shape-document'),
            2
          );
        });
      });

      describe('APIC-743', () => {
        let element = /** @type ApiTypeDocument */ (null);

        beforeEach(async () => {
          const data = await AmfLoader.loadType('getRateRequest', item[1], 'APIC-743');
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
        });

        it('should render "Show" button for type\'s "allOf" property', async () => {
          let producerNode = /** @type {PropertyShapeDocument} */ (null);
          await waitUntil(() => {
            const propertyShapeDocumentNodes = Array.from(element.shadowRoot.querySelectorAll('property-shape-document'));
            producerNode = propertyShapeDocumentNodes.find(node => node.propertyName === 'producer');
            return Boolean(producerNode);
          }, 'Could not find "producer" property-shape-document node');
          const showButton = producerNode.shadowRoot.querySelector('anypoint-button.complex-toggle');
          assert.exists(showButton, '"producer" node did not have the "Show" button');
        });
      });
    });
  });

  [
    ['Regular model - Union types', false],
    ['Compact model - Union types', true],
  ].forEach((item) => {
    describe(String(item[0]), () => {
      const compact = item[1]
      describe('_typeChanged()', () => {
        let element = /** @type ApiTypeDocument */ (null);
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Computes names in union shape #1', async () => {
          const data = await AmfLoader.load(item[1], 'SE-11155');
          element.amf = data[0];
          const [schema, mt] = getPayloadType(
            element,
            data[0],
            '/users',
            'post'
          );
          element.type = schema;
          element.mediaType = mt;

          await aTimeout(0);

          const u1 = /** @type any */ (element.unionTypes[0]);
          const u2 = /** @type any */ (element.unionTypes[1]);
          assert.isTrue(u1.isArray, 'Union1 is array');
          assert.isFalse(u1.isScalar, 'Union1 is not scalar');
          assert.isFalse(u1.isType, 'Union1 is not type');
          assert.equal(u1.label, 'users', 'Union1 has name');

          assert.isFalse(u2.isArray, 'Union2 is not array');
          assert.isFalse(u2.isScalar, 'Union2 is not scalar');
          assert.isTrue(u2.isType, 'Union2 is type');
          assert.equal(u2.label, 'user', 'Union2 has name');
        });

        it('Computes names in union shape #2', async () => {
          const data = await AmfLoader.load(item[1], 'examples-api');
          element.amf = data[0];
          const [schema, mt] = getPayloadType(
            element,
            data[0],
            '/union',
            'post'
          );
          element.type = schema;
          element.mediaType = mt;

          await aTimeout(0);

          const u1 = /** @type any */ (element.unionTypes[0]);
          const u2 = /** @type any */ (element.unionTypes[1]);
          assert.isFalse(u1.isArray, 'Union1 is not array');
          assert.isFalse(u1.isScalar, 'Union1 is not scalar');
          assert.isTrue(u1.isType, 'Union1 is type');
          assert.equal(u1.label, 'Person', 'Union1 has name');

          assert.isFalse(u2.isArray, 'Union2 is not array');
          assert.isFalse(u2.isScalar, 'Union2 is not scalar');
          assert.isTrue(u2.isType, 'Union2 is type');
          assert.equal(u2.label, 'PropertyExamples', 'Union2 has name');
        });
      });

      describe('APIC-631', () => {
        let element = /** @type ApiTypeDocument */ (null);

        beforeEach(async () => {
          element = await basicFixture();
        });

        it('should render union toggle as "Array of String"', async () => {
          const data = await AmfLoader.loadType('test2', compact, 'APIC-631');
          element.amf = data[0];
          element._typeChanged(element._resolve(data[1]));
          await nextFrame();
          const firstToggle = element.shadowRoot.querySelectorAll('.union-toggle')[0]
          assert.equal(firstToggle.textContent.toLowerCase(), 'array of string');
        });

        it('should not render type name as "undefined" for inline type', async () => {
          const data = await AmfLoader.loadType('test3', compact, 'APIC-631');
          element.amf = data[0];
          element.type = data[1]
          await aTimeout(100);
          const propertyName = element.shadowRoot.querySelector('property-shape-document').shadowRoot.querySelector('span.property-name');
          assert.notExists(propertyName);
        });

        it('should render "Array of:" in title for scalar array', async () => {
          const data = await AmfLoader.loadType('test3', compact, 'APIC-631');
          element.amf = data[0];
          element.type = data[1]
          await aTimeout(100);
          const firstSpan = element.shadowRoot.querySelector('span');
          assert.exists(firstSpan);
          assert.equal(firstSpan.textContent, 'Array of:');
        });

        it('should render "Array of number" data type', async () => {
          const data = await AmfLoader.loadType('test8', compact, 'APIC-631');
          element.amf = data[0];
          element.type = data[1]
          await aTimeout(100);
          const dataType = element.shadowRoot.querySelector('property-shape-document').shadowRoot.querySelector('span.data-type');
          assert.equal(dataType.textContent, 'Array of Number');
        });
      });
    });
  });

  [
    ['Regular model - OAS 3 types additions', false],
    ['Compact model - OAS 3 types additions', true],
  ].forEach(([name, compact]) => {
    describe(String(name), () => {
      let element = /** @type ApiTypeDocument */ (null);

      beforeEach(async () => {
        element = await basicFixture();
      });

      it('should represent type as oneOf', async () => {
        const [amf, type] = await AmfLoader.loadType(
          'Pet',
          compact,
          newOas3Types
        );
        element.amf = amf;
        element.type = type;
        await aTimeout(0);
        assert.lengthOf(element.oneOfTypes, 3);
        assert.equal(element.isOneOf, true);
      });

      it('changes selectedOneOf when button clicked', async () => {
        const [amf, type] = await AmfLoader.loadType(
          'Pet',
          compact,
          newOas3Types
        );
        element.amf = amf;
        element.type = type;
        await aTimeout(0);
        assert.equal(element.selectedOneOf, 0);
        /** @type HTMLElement */ (element.shadowRoot.querySelectorAll('.one-of-toggle')[1]).click();
        assert.equal(element.selectedOneOf, 1);
      });

      it('should represent type as anyOf', async () => {
        const [amf, type] = await AmfLoader.loadType(
          'Monster',
          compact,
          newOas3Types
        );
        element.amf = amf;
        element.type = type;
        await aTimeout(0);
        assert.lengthOf(element.anyOfTypes, 3);
        assert.equal(element.isAnyOf, true);
      });

      it('changes selectedAnyOf when button clicked', async () => {
        const [amf, type] = await AmfLoader.loadType(
          'Monster',
          compact,
          newOas3Types
        );
        element.amf = amf;
        element.type = type;
        await aTimeout(0);
        assert.equal(element.selectedAnyOf, 0);
        /** @type HTMLElement */ (element.shadowRoot.querySelectorAll('.any-of-toggle')[1]).click();
        assert.equal(element.selectedAnyOf, 1);
      });
    });
  });

  [
    ['Regular model - AAP-1698', false],
    ['Compact model - AAP-1698', true],
  ].forEach(([name, compact]) => {
    describe(String(name), () => {
      let element = /** @type ApiTypeDocument */ (null);
      let amf;
      let type;

      beforeEach(async () => {
        element = await basicFixture();
        amf = await AmfLoader.load(compact, 'aap-1698');
        element.amf = amf;
        [type] = getPayloadType(element, amf, '/not-working', 'post');
        element.type = type;
        await nextFrame();
        await aTimeout(0);
      });

      it('renders array of enum strings property with partial model', () => {
        assert.exists(
          element.shadowRoot.querySelector('property-shape-document')
        );
      });
    });
  });

  describe('_mediaTypesChanged()', () => {
    let element = /** @type ApiTypeDocument */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets renderMediaSelector to false when no argument', () => {
      element._mediaTypesChanged(undefined);
      assert.isFalse(element.renderMediaSelector);
    });

    it('Sets renderMediaSelector to false when argument is not an array', () => {
      // @ts-ignore
      element._mediaTypesChanged('test');
      assert.isFalse(element.renderMediaSelector);
    });

    it('Sets renderMediaSelector to false when argument has no items', () => {
      element._mediaTypesChanged([]);
      assert.isFalse(element.renderMediaSelector);
    });

    it('Sets renderMediaSelector to false when single media type provided', () => {
      element._mediaTypesChanged(['application/json']);
      assert.isFalse(element.renderMediaSelector);
    });

    it('Sets media type when single media type provided', () => {
      element._mediaTypesChanged(['application/json']);
      assert.equal(element.mediaType, 'application/json');
    });

    it('Sets renderMediaSelector to true when multiple media types provided', () => {
      element._mediaTypesChanged(['application/json', 'application/xml']);
      assert.isTrue(element.renderMediaSelector);
    });

    it('Sets media type when multiple media type provided', () => {
      element._mediaTypesChanged(['application/xml', 'application/json']);
      assert.equal(element.mediaType, 'application/xml');
    });
  });

  describe('_mediaTypeActive()', () => {
    let element = /** @type ApiTypeDocument */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns false when arguments do not match', () => {
      const result = element._mediaTypeActive(1, 2);
      assert.isFalse(result);
    });

    it('Returns true when arguments matches', () => {
      const result = element._mediaTypeActive(1, 1);
      assert.isTrue(result);
    });
  });

  describe('_selectMediaType()', () => {
    let element = /** @type ApiTypeDocument */ (null);
    let target;

    beforeEach(async () => {
      element = await basicFixture();
      await aTimeout(0);
      target = document.createElement('span');
      target.dataset.index = '1';
    });

    it('Sets selectedMediaType', () => {
      const e = {
        target,
      };
      element.mediaTypes = ['invalid', 'valid'];
      // @ts-ignore
      element._selectMediaType(e);
      assert.equal(element.selectedMediaType, 1);
    });

    it('Sets mediaType', () => {
      const e = {
        target,
      };
      element.mediaTypes = ['invalid', 'valid'];
      // @ts-ignore
      element._selectMediaType(e);
      assert.equal(element.mediaType, 'valid');
    });

    it('Sets event target active', () => {
      const e = {
        target,
      };
      element.mediaTypes = ['invalid', 'valid'];
      element.selectedMediaType = 1;
      // @ts-ignore
      element._selectMediaType(e);
      assert.isTrue(e.target.active);
    });

    it('Ignores invalid index', () => {
      target.dataset.index = 'test';
      const e = {
        target,
      };
      element.mediaTypes = ['invalid', 'valid'];
      element.selectedMediaType = undefined;
      // @ts-ignore
      element._selectMediaType(e);
      assert.isUndefined(element.selectedMediaType);
    });
  });

  [
    ['Regular model - noMediaSelector', false],
    ['Compact model - noMediaSelector', true],
  ].forEach(([name, compact]) => {
    describe(String(name), () => {
      let element = /** @type ApiTypeDocument */ (null);

      beforeEach(async () => {
        element = await basicFixture();
        // element.amf = await AmfLoader.load(compact, 'APIC-667');
        await nextFrame();
        const [amf, type] = await AmfLoader.loadType(
          'aNumberType',
          compact,
          'APIC-667'
        );
        element.amf = amf;
        element.type = type;

        let webApi = element._computeWebApi(element.amf);
        if (webApi instanceof Array) {
          [webApi] = webApi;
        }
        const key = element._getAmfKey(element.ns.aml.vocabularies.apiContract.accepts);
        const value = element._ensureArray(webApi[key]);
        if (value) {
          element.mediaTypes = value.map((item) => item['@value']);
        }
        await nextFrame();
      });

      it('it should render media type selector', () => {
        assert.exists(element.shadowRoot.querySelector('.media-type-selector'));
      });

      it('it should not render media type selector', async () => {
        element.noMediaSelector = true;
        await nextFrame();
        assert.notExists(element.shadowRoot.querySelector('.media-type-selector'))
      });
    });
  });

  describe('shouldRenderMediaSelector()', () => {
    let element = /** @type ApiTypeDocument */ (null);

      beforeEach(async () => {
        element = await basicFixture();
      });

      it('should return false when noMediaSelector is true and renderMediaSelector is false', () => {
        element.renderMediaSelector = false;
        element.noMediaSelector = true;
        assert.isFalse(element.shouldRenderMediaSelector);
      });

      it('should return false when noMediaSelector is true and renderMediaSelector is true', () => {
        element.renderMediaSelector = true;
        element.noMediaSelector = true;
        assert.isFalse(element.shouldRenderMediaSelector);
      });

      it('should return false when noMediaSelector is false and renderMediaSelector is false', () => {
        element.renderMediaSelector = false;
        element.noMediaSelector = false;
        assert.isFalse(element.shouldRenderMediaSelector);
      });

      it('should return true when noMediaSelector is false and renderMediaSelector is true', () => {
        element.renderMediaSelector = true;
        element.noMediaSelector = false;
        assert.isTrue(element.shouldRenderMediaSelector);
      });
  });

  describe('a11y', () => {
    let element = /** @type ApiTypeDocument */ (null);

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('is accessible', async () => {
      const data = await AmfLoader.loadType('ComplexRecursive');
      element.amf = data[0];
      element._typeChanged(element._resolve(data[1]));
      await assert.isAccessible(element);
    });
  });
});
