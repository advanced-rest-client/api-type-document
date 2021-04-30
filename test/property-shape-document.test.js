import { assert, fixture, html, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import { AmfLoader } from './amf-loader.js';
import '../property-shape-document.js';

/** @typedef {import('../').PropertyShapeDocument} PropertyShapeDocument */

/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */

describe('PropertyShapeDocument', () => {
  async function basicFixture() {
    const elm = await fixture(
      `<property-shape-document></property-shape-document>`
    );
    return /** @type PropertyShapeDocument */ (elm);
  }

  async function graphFixture(amf) {
    const elm = await fixture(html`<property-shape-document
      .amf="${amf}"
      graph
    ></property-shape-document>`);
    return /** @type PropertyShapeDocument */ (elm);
  }

  async function modelFixture(amf, shape) {
    const elm = await fixture(html`<property-shape-document
      .amf="${amf}"
      .shape="${shape}"
    ></property-shape-document>`);
    return /** @type PropertyShapeDocument */ (elm);
  }

  function getPropertyShape(element, type, name) {
    const propKey = element._getAmfKey(element.ns.w3.shacl.property);
    const props = type[propKey];
    for (let i = 0, len = props.length; i < len; i++) {
      const item = props[i];
      const itemName = element._getValue(item, element.ns.w3.shacl.name);
      if (itemName === name) {
        return item;
      }
    }
    return undefined;
  }

  function getShapeRange(element, type, propName) {
    const shape = getPropertyShape(element, type, propName);
    const key = element._getAmfKey(element.ns.aml.vocabularies.shapes.range);
    const range = element._ensureArray(shape[key])[0];
    return [shape, range];
  }

  describe('_shapeChanged()', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element = /** @type PropertyShapeDocument */ (null);
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('AppPerson', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        it('sets range', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.typeOf(element.range, 'object', 'range is an object');
          const key = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.range
          );
          const range = element._ensureArray(shape[key]);
          assert.deepEqual(element.range, range[0], 'range value is set');
        });

        it('sets isRequired', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isTrue(element.isRequired);
        });

        it('sets isReadOnly', async () => {
          const data = await AmfLoader.loadType(
            'Article',
            item[1],
            'read-only-properties'
          );
          amf = data[0];
          type = data[1];
          element.shape = getPropertyShape(element, type, 'id');
          assert.isTrue(element.isReadOnly);
        });

        it('renders read only trait', async () => {
          const data = await AmfLoader.loadType(
            'Article',
            item[1],
            'read-only-properties'
          );
          amf = data[0];
          type = data[1];
          element.shape = getPropertyShape(element, type, 'id');
          await nextFrame();
          assert.lengthOf(
            element.shadowRoot.querySelectorAll('span.readonly-type'),
            1
          );
        });
      });
    });
  });

  describe('_rangeChanged()', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element = /** @type PropertyShapeDocument */ (null);
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('AppPerson', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        it('sets propertyDescription', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.typeOf(
            element.propertyDescription,
            'string',
            'propertyDescription is a string'
          );
          const key = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.range
          );
          const range = element._ensureArray(shape[key]);
          const desc = element._getValue(
            range[0],
            element.ns.aml.vocabularies.core.description
          );
          assert.deepEqual(element.propertyDescription, desc, 'value is set');
        });

        it('sets propertyDescription', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isTrue(element.hasPropertyDescription);
        });

        it('sets isEnum to true when is enum', async () => {
          const shape = getPropertyShape(element, type, 'gender');
          element.shape = shape;
          assert.isTrue(element.isEnum);
        });

        it('sets isEnum to false when is not enum', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isEnum);
        });

        it('sets isUnion to true when is union', async () => {
          const shape = getPropertyShape(element, type, 'nillable');
          element.shape = shape;
          assert.isTrue(element.isUnion);
        });

        it('sets isUnion to false when is not union', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isUnion);
        });

        it('sets isObject to true when is enum', async () => {
          const shape = getPropertyShape(element, type, 'image');
          element.shape = shape;
          assert.isTrue(element.isObject);
        });

        it('sets isObject to false when is not enum', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isObject);
        });

        it('sets isArray to true when array property', async () => {
          const data = await AmfLoader.loadType('PropertyArray', item[1]);
          const shape = getPropertyShape(element, data[1], 'data');
          element.shape = shape;
          assert.isTrue(element.isArray);
        });

        it('sets isArray to false when is not array', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isArray);
        });

        it('sets isComplex to true when is object', async () => {
          const shape = getPropertyShape(element, type, 'image');
          element.shape = shape;
          assert.isTrue(element.isComplex);
        });

        it('sets isComplex to true when is union', async () => {
          const shape = getPropertyShape(element, type, 'nillable');
          element.shape = shape;
          assert.isTrue(element.isComplex);
        });

        it('sets isComplex to true when array property', async () => {
          const data = await AmfLoader.loadType('PropertyArray', item[1]);
          const shape = getPropertyShape(element, data[1], 'data');
          element.shape = shape;
          assert.isTrue(element.isComplex);
        });

        it('sets isComplex to true when is or', async () => {
          const data = await AmfLoader.loadType('Companies', item[1], 'SE-19500');
          const shape = getPropertyShape(element, data[1], 'companyType');
          element.shape = shape;
          assert.isTrue(element.isComplex);
        });

        it('sets isComplex to false otherwise', async () => {
          const shape = getPropertyShape(element, type, 'name');
          element.shape = shape;
          assert.isFalse(element.isComplex);
        });
      });
    });
  });

  describe('_shapeRangeChanged()', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element = /** @type PropertyShapeDocument */ (null);
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('AppPerson', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        it('sets displayName', async () => {
          const shape = getPropertyShape(element, type, 'newsletter');
          element.shape = shape;
          assert.equal(element.displayName, 'Newsletter consent');
        });

        it('sets displayName to propertyName when no name', async () => {
          const shape = getPropertyShape(element, type, 'image');
          element.shape = shape;
          assert.equal(element.displayName, element.propertyName);
        });

        it('sets propertyName', async () => {
          const shape = getPropertyShape(element, type, 'newsletter');
          element.shape = shape;
          assert.equal(element.propertyName, 'newsletter');
        });

        it('sets hasDisplayName when has name', async () => {
          const shape = getPropertyShape(element, type, 'newsletter');
          element.shape = shape;
          assert.isTrue(element.hasDisplayName);
        });

        it('sets hasDisplayName when has no name', async () => {
          const shape = getPropertyShape(element, type, 'image');
          element.shape = shape;
          assert.isFalse(element.hasDisplayName);
        });

        [
          ['image', 'Object'],
          ['favouriteTime', 'Time'],
          ['favouriteNumber', 'Number'],
          ['newsletter', 'Boolean'],
          ['fietype', 'File'],
          ['etag', 'String'],
          ['age', 'Integer'],
          ['nillable', 'Union'],
          ['birthday', 'Date'],
        ].forEach(([property, dataType]) => {
          it(`sets propertyDataType to ${dataType}`, () => {
            const shape = getPropertyShape(element, type, property);
            element.shape = shape;
            assert.equal(
              element.propertyDataType,
              dataType,
              `sets ${dataType}`
            );
          });
        });
      });
    });
  });

  describe('_computePropertyName()', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element = /** @type PropertyShapeDocument */ (null);
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('AppPerson', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        it('returns undefined when no shape and no range', async () => {
          const result = element._computePropertyName(undefined, undefined);
          assert.isUndefined(result);
        });

        it('computes name for PropertyShape', () => {
          const [shape, range] = getShapeRange(element, type, 'favouriteTime');
          const result = element._computePropertyName(range, shape);
          assert.equal(result, 'favouriteTime');
        });
      });
    });
  });

  describe('Graph linking', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
        let element = /** @type PropertyShapeDocument */ (null);
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('withEmbeddedType', compact);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await graphFixture(amf);
        });

        // something is not right with the AMF model.
        // The _targetTypeName property is not properly computed.
        it.skip('computes name and id of declared type', async () => {
          const shape = getPropertyShape(element, type, 'imageProperty');
          element.shape = shape;
          await nextFrame();
          assert.typeOf(element._targetTypeId, 'string', 'id is set');
          assert.typeOf(element._targetTypeName, 'string', 'name is set');
        });

        it('renders a link', async () => {
          const shape = getPropertyShape(element, type, 'imageProperty');
          element.shape = shape;
          await nextFrame();
          const node = element.shadowRoot.querySelector(
            '.data-type.link-label'
          );
          assert.equal(node.getAttribute('role'), 'link');
        });

        it('link click dispatches api-navigation-selection-changed event', async () => {
          const shape = getPropertyShape(element, type, 'imageProperty');
          element.shape = shape;
          await nextFrame();
          const node = element.shadowRoot.querySelector(
            '.data-type.link-label'
          );
          const spy = sinon.spy();
          element.addEventListener('api-navigation-selection-changed', spy);
          /** @type HTMLElement */ (node).click();
          assert.isTrue(spy.called, 'the event is called');
          const { detail } = spy.args[0][0];
          assert.equal(detail.type, 'type', 'type is set');
          assert.equal(
            detail.selected,
            element._targetTypeId,
            'selected is set'
          );
        });

        it('link enter press dispatches api-navigation-selection-changed event', async () => {
          const shape = getPropertyShape(element, type, 'imageProperty');
          element.shape = shape;
          await nextFrame();
          const node = element.shadowRoot.querySelector(
            '.data-type.link-label'
          );
          const spy = sinon.spy();
          element.addEventListener('api-navigation-selection-changed', spy);
          const keyEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13,
          });
          node.dispatchEvent(keyEvent);
          assert.isTrue(spy.called, 'the event is called');
        });
      });
    });
  });

  describe('a11y', () => {
    let element = /** @type PropertyShapeDocument */ (null);
    let amf;
    let type;
    before(async () => {
      const data = await AmfLoader.loadType('AppPerson', true);
      amf = data[0];
      type = data[1];
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
    });

    it('is accessible for trivial property', async () => {
      const shape = getPropertyShape(element, type, 'favouriteTime');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible for enum property', async () => {
      const shape = getPropertyShape(element, type, 'gender');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible for complex property', async () => {
      const shape = getPropertyShape(element, type, 'image');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible for union property', async () => {
      const shape = getPropertyShape(element, type, 'nillable');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });

    it('is accessible for a property with an example', async () => {
      const shape = getPropertyShape(element, type, 'name');
      element.shape = shape;
      await nextFrame();
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast'],
      });
    });
  });

  describe('Complex structure toggle', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element = /** @type PropertyShapeDocument */ (null);
        let amf;
        let type;
        before(async () => {
          const data = await AmfLoader.loadType('ComplexRecursive', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        it('does not render api-type-document by default', async () => {
          const shape = getPropertyShape(element, type, 'iteration1');
          element.shape = shape;
          await nextFrame();
          const node = element.shadowRoot.querySelector('api-type-document');
          assert.notOk(node);
        });

        it('renders api-type-document when opened is set', async () => {
          const shape = getPropertyShape(element, type, 'iteration1');
          element.shape = shape;
          element.opened = true;
          await nextFrame();
          const node = element.shadowRoot.querySelector('api-type-document');
          assert.ok(node);
        });

        it('renders toggle button', async () => {
          const shape = getPropertyShape(element, type, 'iteration1');
          element.shape = shape;
          await nextFrame();
          const node = element.shadowRoot.querySelector('.complex-toggle');
          assert.ok(node);
        });

        it('toggles opened state on toggle button click', async () => {
          const shape = getPropertyShape(element, type, 'iteration1');
          element.shape = shape;
          await nextFrame();
          const node = element.shadowRoot.querySelector('.complex-toggle');
          /** @type HTMLElement */ (node).click();
          await nextFrame();
          const typeDoc = element.shadowRoot.querySelector('api-type-document');
          assert.ok(typeDoc);
        });

        it('sets "opened" via toggle()', () => {
          element.toggle();
          assert.isTrue(element.opened);
        });
      });
    });
  });

  describe('Array of scalar property', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
        let amf;
        let type;
        before(async () => {
          [amf, type] = await AmfLoader.loadType('Arrays', compact, 'APIC-282');
        });

        it('sets isScalarArray for scalar item', async () => {
          const shape = AmfLoader.lookupPropertyShape(
            amf,
            type,
            'testRepeatable'
          );
          const element = await modelFixture(amf, shape);
          assert.isTrue(element.isScalarArray);
        });

        it('sets isScalarArray for complex item', async () => {
          const shape = AmfLoader.lookupPropertyShape(amf, type, 'multiArray');
          const element = await modelFixture(amf, shape);
          assert.isFalse(element.isScalarArray);
        });

        it('does not render toggle view button for scalar array', async () => {
          const shape = AmfLoader.lookupPropertyShape(
            amf,
            type,
            'testRepeatable'
          );
          const element = await modelFixture(amf, shape);
          assert.isFalse(
            element._renderToggleButton,
            '_renderToggleButton is set'
          );
          const node = element.shadowRoot.querySelector('.complex-toggle');
          assert.notOk(node);
        });

        it('renders toggle view button for complex array', async () => {
          const shape = AmfLoader.lookupPropertyShape(amf, type, 'multiArray');
          const element = await modelFixture(amf, shape);
          assert.isTrue(
            element._renderToggleButton,
            '_renderToggleButton is set'
          );
          const node = element.shadowRoot.querySelector('.complex-toggle');
          assert.ok(node);
        });

        it('uses scalar type in type name', async () => {
          const shape = AmfLoader.lookupPropertyShape(
            amf,
            type,
            'testRepeatable'
          );
          const element = await modelFixture(amf, shape);
          const typeName = element.arrayScalarTypeName;
          assert.equal(typeName, 'String', 'Computes scalar type name');
          const node = element.shadowRoot.querySelector('.data-type');
          assert.equal(
            node.textContent.trim(),
            'Array of String',
            'Renders full type'
          );
        });

        it('renders "array" only when complex array', async () => {
          const shape = AmfLoader.lookupPropertyShape(amf, type, 'multiArray');
          const element = await modelFixture(amf, shape);
          const typeName = element.arrayScalarTypeName;
          assert.equal(typeName, 'Unknown', 'Scalar type name is unknown');
          const node = element.shadowRoot.querySelector('.data-type');
          assert.equal(node.textContent.trim(), 'Array', 'Renders array type');
        });
      });
    });
  });

  describe('SE-17897', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element = /** @type PropertyShapeDocument */ (null);
        let amf;

        before(async () => {
          amf = await AmfLoader.load(item[1], 'SE-17897')
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
        });

        it('sets shape description when schema does not have one', async () => {
          const [parameter] = AmfLoader.lookupParameters(amf, '/default', 'post');
          element.shape = parameter;
          await nextFrame();
          assert.isFalse(element.hasPropertyDescription);
          assert.isTrue(element.hasShapeDescription);
          assert.isTrue(element.shapeDescription.startsWith('The ConversationId uniquely identifies the message sent from the sender to the receiver.'));
        });
      });
    });
  });

  // this API does not produce amf_inline_type anymore
  // nor any inn the demos
  describe.skip('APIC-282', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(compact, 'APIC-282');
        });

        it('Ignores name that has "amf_inline_type"', async () => {
          const payload = AmfLoader.lookupPayload(amf, '/endpoint', 'post');
          const shape = AmfLoader.lookupPayloadProperty(
            amf,
            payload[0],
            'numericRepeatable'
          );
          const range = AmfLoader.lookupArrayItemRange(amf, shape);
          const element = await modelFixture(amf, range);
          assert.isUndefined(element.propertyName);
        });
      });
    });
  });

  // this api does not exists anymore....
  describe.skip('_computeIsEnum()', () => {
    let element = /** @type PropertyShapeDocument */ (null);
    let amf;
    let type;

    before(async () => {
      const data = await AmfLoader.loadType(
        'ApiQuickSearchFilters',
        false,
        'APIC-405'
      );
      amf = data[0];
      type = data[1];
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
    });

    it('Returns false when no range', () => {
      const result = element._computeIsEnum(undefined, undefined);
      assert.isFalse(result);
    });

    it('Returns true for string array property with enum', () => {
      const [, range] = getShapeRange(element, type, 'quickSearchType');
      const result = element._computeIsEnum(range, true);
      assert.isTrue(result);
    });

    it('Returns true for string property with enum', () => {
      const [, range] = getShapeRange(element, type, 'status');
      const result = element._computeIsEnum(range, undefined);
      assert.isTrue(result);
    });
  });

  // This API does not exists anymore
  describe.skip('_computeIsEnumArray()', () => {
    let element = /** @type PropertyShapeDocument */ (null);
    let amf;
    let type;

    before(async () => {
      const data = await AmfLoader.loadType(
        'ApiQuickSearchFilters',
        false,
        'APIC-405'
      );
      amf = data[0];
      type = data[1];
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
    });

    it('Returns false when empty range', () => {
      const result = element._computeIsEnumArray({});
      assert.isFalse(result);
    });

    it('Returns true for string array property with enum', () => {
      const [, range] = getShapeRange(element, type, 'quickSearchType');
      const result = element._computeIsEnumArray(range);
      assert.isTrue(result);
    });
  });
});
