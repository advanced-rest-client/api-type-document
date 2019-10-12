import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import { tap } from '@polymer/iron-test-helpers/mock-interactions.js';
import '../api-type-document.js';

describe('<api-type-document>', function() {
  async function basicFixture() {
    return (await fixture(`<api-type-document></api-type-document>`));
  }

  function getPayloadType(element, model, path, methodName) {
    const webApi = element._computeWebApi(model);
    const endpoint = element._computeEndpointByPath(webApi, path);
    const opKey = element._getAmfKey(element.ns.aml.vocabularies.apiContract.supportedOperation);
    const methods = endpoint[opKey];
    let method;
    for (let j = 0, jLen = methods.length; j < jLen; j++) {
      const m = methods[j];
      const value = element._getValue(m, element.ns.aml.vocabularies.apiContract.method);
      if (value === methodName) {
        method = m;
        break;
      }
    }
    const expects = element._computeExpects(method);
    const payload = element._computePayload(expects)[0];
    const mt = element._getValue(payload, element.ns.aml.vocabularies.core.mediaType);
    const key = element._getAmfKey(element.ns.aml.vocabularies.shapes.schema);
    let schema = payload && payload[key];
    if (!schema) {
      return;
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
      let element;
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
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Does nothing whe no argument', () => {
        element.selectedUnion = 1;
        element._unionTypesChanged();
        assert.equal(element.selectedUnion, 1);
      });

      it('Re-sets selected union index', () => {
        element.selectedUnion = 1;
        element._unionTypesChanged([]);
        assert.equal(element.selectedUnion, 0);
      });
    });

    describe('_computeRenderMainExample()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns true when has examples and not stopped', () => {
        const result = element._computeRenderMainExample(false, true);
        assert.isTrue(result);
      });

      it('Returns fasle when no examples and not stopped', () => {
        const result = element._computeRenderMainExample(false, false);
        assert.isFalse(result);
      });

      it('Returns false when has examples and stopped', () => {
        const result = element._computeRenderMainExample(true, true);
        assert.isFalse(result);
      });
    });
  });

  [
    ['Regulatr model', false],
    ['Compact model', true]
  ].forEach((item) => {
    describe(item[0], () => {
      describe('a11y', () => {
        let element;
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
        let element;
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
      });

      describe('_selectUnion()', () => {
        let element;
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
          await aTimeout();
        });

        it('selectedUnion is 0', () => {
          assert.equal(element.selectedUnion, 0);
        });

        it('unionTypes is computed', () => {
          assert.typeOf(element.unionTypes, 'array');
        });

        it('Sets event target as active when selecting current selection', async () => {
          await nextFrame();
          const nodes = element.shadowRoot.querySelectorAll('.union-type-selector .union-toggle');
          tap(nodes[1]);
          await nextFrame();
          assert.isTrue(nodes[1].hasAttribute('activated'));
        });

        it('Changes the selection', async () => {
          await nextFrame();
          const nodes = element.shadowRoot.querySelectorAll('.union-type-selector .union-toggle');
          tap(nodes[1]);
          assert.equal(element.selectedUnion, 1);
        });
      });

      describe('_computeUnionProperty()', () => {
        let element;
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Computes union type', () => {
          return AmfLoader.loadType('Unionable', item[1])
          .then((data) => {
            element.amf = data[0];
            const result = element._computeUnionProperty(data[1], 0);
            assert.typeOf(result, 'object');
          });
        });

        it('Returns undefined when no type', () => {
          const result = element._computeUnionProperty();
          assert.isUndefined(result);
        });

        it('Returns undefined when no anyOf property', () => {
          const result = element._computeUnionProperty({});
          assert.isUndefined(result);
        });

        it('Computes union type for an array item', () => {
          return AmfLoader.loadType('UnionArray', item[1])
          .then((data) => {
            element.amf = data[0];
            const result = element._computeUnionProperty(data[1], 0);
            assert.isTrue(element._hasType(result, element.ns.aml.vocabularies.shapes.ScalarShape));
          });
        });
      });

      describe('_computeProperties()', () => {
        let element;
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Returns passed item is array', () => {
          // Used when recuresively rendering properties
          const result = element._computeProperties(['test']);
          assert.deepEqual(result, ['test']);
        });

        it('Returns undefined for no argument', () => {
          const result = element._computeProperties();
          assert.isUndefined(result);
        });

        it('Computes object properties', () => {
          return AmfLoader.loadType('Image', item[1])
          .then((data) => {
            element.amf = data[0];
            const result = element._computeProperties(data[1]);
            assert.typeOf(result, 'array');
            assert.lengthOf(result, 2);
          });
        });
      });

      describe('_computeAndTypes()', () => {
        let element;
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
        let element;
        beforeEach(async () => {
          const data = await AmfLoader.loadType('Notification', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout();
        });

        it('isObject is true', () => {
          assert.isTrue(element.isObject);
        });

        it('Renders object document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.object-document');
          assert.ok(doc);
        });

        it('Does not render array document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.array-document');
          assert.notOk(doc);
        });

        it('Does not render scalar document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.shape-document');
          assert.notOk(doc);
        });

        it('Does not render union selector', () => {
          const selector = element.shadowRoot.querySelector('.union-type-selector');
          assert.notOk(selector);
        });

        it('Does not render union document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.union-document');
          assert.notOk(doc);
        });
      });

      describe('Array type', () => {
        let element;
        beforeEach(async () => {
          const data = await AmfLoader.loadType('ArrayType', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout();
        });

        it('isArray is true', () => {
          assert.isTrue(element.isArray);
        });

        it('Does not render object document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.object-document');
          assert.notOk(doc);
        });

        it('Renders array document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.array-document');
          assert.ok(doc);
        });

        it('Does not render scalar document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.shape-document');
          assert.notOk(doc);
        });

        it('Does not render union selector', () => {
          const selector = element.shadowRoot.querySelector('.union-type-selector');
          assert.notOk(selector);
        });

        it('Does not render union document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.union-document');
          assert.notOk(doc);
        });
      });

      describe('Scalar type', () => {
        let element;

        beforeEach(async () => {
          const data = await AmfLoader.loadType('BooleanType', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout();
        });

        it('isScalar is true', () => {
          assert.isTrue(element.isScalar);
        });

        it('Does not render object document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.object-document');
          assert.notOk(doc);
        });

        it('Does not render array document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.array-document');
          assert.notOk(doc);
        });

        it('Renders scalar document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.shape-document');
          assert.ok(doc);
        });

        it('Does not render union selector', () => {
          const selector = element.shadowRoot.querySelector('.union-type-selector');
          assert.notOk(selector);
        });

        it('Does not render union document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.union-document');
          assert.notOk(doc);
        });
      });

      describe('Nil type', () => {
        let element;

        beforeEach(async () => {
          const data = await AmfLoader.loadType('NilType', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout();
        });

        it('isScalar is true', () => {
          assert.isTrue(element.isScalar);
        });
      });

      describe('Union type', () => {
        let element;

        beforeEach(async () => {
          const data = await AmfLoader.loadType('Unionable', item[1]);
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout();
        });

        it('isUnion is true', () => {
          assert.isTrue(element.isUnion);
        });

        it('Does not render object document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.object-document');
          assert.notOk(doc);
        });

        it('Does not render array document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.array-document');
          assert.notOk(doc);
        });

        it('Does not render scalar document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.shape-document');
          assert.notOk(doc);
        });

        it('Renders union selector', () => {
          const selector = element.shadowRoot.querySelector('.union-type-selector');
          assert.ok(selector);
        });

        it('Selectes first union => selectedUnion = 0', () => {
          assert.equal(element.selectedUnion, 0);
        });

        it('Renders union document', () => {
          const doc = element.shadowRoot.querySelector('api-type-document.union-document');
          assert.ok(doc);
        });

        it('Renders 2 union type change buttons', () => {
          const buttons = element.shadowRoot.querySelectorAll('.union-toggle');
          assert.equal(buttons.length, 2);
        });

        it('Button change selection', () => {
          const buttons = element.shadowRoot.querySelectorAll('.union-toggle');
          tap(buttons[1]);
          assert.equal(element.selectedUnion, 1);
        });

        it('Selection change computes properties for the table', () => {
          element.selectedUnion = 1;
          const doc = element.shadowRoot.querySelector('api-type-document.union-document');
          const key = element._getAmfKey(element.ns.aml.vocabularies.shapes.anyOf);
          const type = element.type[key][0];
          assert.deepEqual(doc.type, type);
        });
      });

      describe('And type', () => {
        let element;

        beforeEach(async () => {
          const data = await AmfLoader.loadType('Pet', item[1], 'Petstore');
          element = await basicFixture();
          element.amf = data[0];
          element.type = data[1];
          await aTimeout();
        });

        it('isAnd is true', () => {
          assert.isTrue(element.isAnd);
        });

        it('Does not render object document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.object-document');
          assert.notOk(doc);
        });

        it('Does not render array document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.array-document');
          assert.notOk(doc);
        });

        it('Does not render scalar document', () => {
          const doc = element.shadowRoot.querySelector('property-shape-document.shape-document');
          assert.notOk(doc);
        });

        it('"And" documents are in the DOM', () => {
          const docs = element.shadowRoot.querySelectorAll('api-type-document.and-document');
          assert.lengthOf(docs, 3);
        });

        it('Inheritance labels are rendered', () => {
          const docs = element.shadowRoot.querySelectorAll('.inheritance-label');
          assert.lengthOf(docs, 3);
        });
      });
    });
  });

  [
    ['Regular model - Union types', false],
    ['Compact model - Union types', true]
  ].forEach((item) => {
    describe(item[0], () => {
      describe('_typeChanged()', () => {
        let element;
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Computes names in union shape #1', async () => {
          const data = await AmfLoader.load(item[1], 'SE-11155');
          element.amf = data[0];
          const [schema, mt] = getPayloadType(element, data[0], '/users', 'post');
          element.type = schema;
          element.mediaType = mt;

          await aTimeout();

          const u1 = element.unionTypes[0];
          const u2 = element.unionTypes[1];
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
          const [schema, mt] = getPayloadType(element, data[0], '/union', 'post');
          element.type = schema;
          element.mediaType = mt;

          await aTimeout();

          const u1 = element.unionTypes[0];
          const u2 = element.unionTypes[1];
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
    });
  });

  describe('_mediaTypesChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets renderMediaSelector to false when no argument', () => {
      element._mediaTypesChanged();
      assert.isFalse(element.renderMediaSelector);
    });

    it('Sets renderMediaSelector to false when argument is not an array', () => {
      element._mediaTypesChanged('test');
      assert.isFalse(element.renderMediaSelector);
    });

    it('Sets renderMediaSelector to false when arument has no items', () => {
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
    let element;
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
    let element;
    let target;

    beforeEach(async () => {
      element = await basicFixture();
      await aTimeout();
      target = document.createElement('span');
      target.dataset.index = '1';
    });

    it('Sets selectedMediaType', () => {
      const e = {
        target
      };
      element.mediaTypes = ['invalid', 'valid'];
      element._selectMediaType(e);
      assert.equal(element.selectedMediaType, 1);
    });

    it('Sets mediaType', () => {
      const e = {
        target
      };
      element.mediaTypes = ['invalid', 'valid'];
      element._selectMediaType(e);
      assert.equal(element.mediaType, 'valid');
    });

    it('Sets event target active', () => {
      const e = {
        target
      };
      element.mediaTypes = ['invalid', 'valid'];
      element.selectedMediaType = 1;
      element._selectMediaType(e);
      assert.isTrue(e.target.active);
    });

    it('Ignores invalid index', () => {
      target.dataset.index = 'test';
      const e = {
        target
      };
      element.mediaTypes = ['invalid', 'valid'];
      element.selectedMediaType = undefined;
      element._selectMediaType(e);
      assert.isUndefined(element.selectedMediaType);
    });
  });

  describe('compatibility mode', () => {
    it('sets compatibility on item when setting legacy', async () => {
      const element = await basicFixture();
      element.legacy = true;
      assert.isTrue(element.legacy, 'legacy is set');
      assert.isTrue(element.compatibility, 'compatibility is set');
    });

    it('returns compatibility value from item when getting legacy', async () => {
      const element = await basicFixture();
      element.compatibility = true;
      assert.isTrue(element.legacy, 'legacy is set');
    });
  });

  describe('a11y', () => {
    let element;

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
