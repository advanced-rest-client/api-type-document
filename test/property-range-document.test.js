import { assert, aTimeout, fixture, nextFrame } from '@open-wc/testing';
import * as sinon from 'sinon';
import { AmfLoader } from './amf-loader.js';
import '../property-range-document.js';

/** @typedef {import('..').PropertyRangeDocument} PropertyRangeDocument */

/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

describe('PropertyRangeDocument', () => {
  async function basicFixture() {
    const elm = await fixture(
      `<property-range-document></property-range-document>`
    );
    return /** @type PropertyRangeDocument */ (elm);
  }

  function findTypePropertyRange(element, type, index = 0, propIndex = 0) {
    type = element._resolve(type);
    const props = element._computeObjectProperties(type);
    const key = element._getAmfKey(element.ns.aml.vocabularies.shapes.range);
    return element._ensureArray(props[propIndex][key])[index];
  }

  async function getTypePropertyRange(
    element,
    typeName,
    compact,
    index,
    modelFile
  ) {
    const data = await AmfLoader.loadType(typeName, compact, modelFile);
    element.amf = data[0];
    return findTypePropertyRange(element, data[1], index);
  }

  describe('_rangeChanged()', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element;
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Calls _rangeChanged() for property set', () => {
          const spy = sinon.spy(element, '_rangeChanged');
          element.range = {};
          assert.isTrue(spy.called);
        });

        it('Sets "isUnion" property', async () => {
          const data = await AmfLoader.loadType('Unionable', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.isTrue(element.isUnion, 'isUnion is set');
          await nextFrame();
          assert.isTrue(
            element.hasAttribute('isunion'),
            'isunion attribute is set'
          );
        });

        it('Sets "isEnum" property', async () => {
          const data = await AmfLoader.loadType('Feature', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.isTrue(element.isEnum, 'isEnum is set');
          await nextFrame();
          assert.isTrue(
            element.hasAttribute('isenum'),
            'isenum attribute is set'
          );
        });

        it('Sets "enumValues" property', async () => {
          const data = await AmfLoader.loadType('Feature', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.typeOf(element.enumValues, 'array', 'enumValues is an array');
          assert.lengthOf(element.enumValues, 3, 'enumValues has 3 elements');
          await nextFrame();
          const node = element.shadowRoot.querySelector('.enum-values');
          assert.ok(node, 'Enum values are rendered');
        });

        it('Sets "isObject" property', async () => {
          const data = await AmfLoader.loadType('Notification', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.isTrue(element.isObject, 'isObject is set');
          await nextFrame();
          assert.isTrue(
            element.hasAttribute('isobject'),
            'isobject attribute is set'
          );
        });

        it('Sets "isArray" property', async () => {
          const data = await AmfLoader.loadType('Arrable2', item[1]);
          element.amf = data[0];
          element.range = element._resolve(data[1]);
          assert.isTrue(element.isArray, 'isArray is set');
          await nextFrame();
          assert.isTrue(
            element.hasAttribute('isarray'),
            'isarray attribute is set'
          );
        });

        it('Sets "isFile" property', async () => {
          /* eslint require-atomic-updates: 0 */
          const range = await getTypePropertyRange(
            element,
            'FieType',
            item[1],
            0
          );
          element.range = range;
          assert.isTrue(element.isFile, 'isFile is set');
          await nextFrame();
        });
      });
    });
  });

  describe('_computeObjectProperties()', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element;
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Returns list of properties', async () => {
          const data = await AmfLoader.loadType('Notification', item[1]);
          element.amf = data[0];
          const result = element._computeObjectProperties(data[1]);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 2);
        });

        it('Returns undefined when no argument', async () => {
          const result = element._computeObjectProperties();
          assert.isUndefined(result);
        });
      });
    });
  });

  describe('_computeEnumValues()', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element;
        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Returns undefined when no argument', async () => {
          const result = element._computeEnumValues();
          assert.isUndefined(result);
        });

        it('Returns undefined when no "in" property', async () => {
          const result = element._computeEnumValues({});
          assert.isUndefined(result);
        });

        it('Returns list of properties', async () => {
          const data = await AmfLoader.loadType('Feature', item[1]);
          element.amf = data[0];
          const range = element._resolve(data[1]);
          const result = element._computeEnumValues(range);
          assert.deepEqual(result, ['1', '2', '3']);
        });

        it('Returns list of properties for array', async () => {
          const data = await AmfLoader.loadType('TrademarkPierreNotWorkingType', item[1], 'enum-test');
          element.amf = data[0];
          const range = element._resolve(data[1]);
          const result = element._computeEnumValues(range, true);
          assert.deepEqual(result, ['NON_USE', 'INTERNATIONAL_REGISTRATION', 'REGULATED', 'SERIES']);
        });
      });
    });
  });

  describe('File data rendering', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element;
        let amf;
        let type;

        before(async () => {
          const data = await AmfLoader.loadType('FieType', item[1]);
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          element.range = findTypePropertyRange(element, type, 0);
          await aTimeout(0);
        });

        it('Renders file properties section', async () => {
          const node = element.shadowRoot.querySelector('.file-properties');
          assert.ok(node);
        });

        it('Renders file types', async () => {
          const node = element.shadowRoot.querySelectorAll(
            '.file-properties > .property-attribute'
          )[0];
          const target = node.querySelector('.attribute-value');
          assert.equal(
            target.innerText.trim().toLowerCase(),
            'image/png, image/jpeg'
          );
        });

        it('Renders file minimum size', async () => {
          const node = element.shadowRoot.querySelectorAll(
            '.file-properties > .property-attribute'
          )[1];
          const target = node.querySelector('.attribute-value');
          assert.equal(target.innerText.trim().toLowerCase(), '100');
        });

        it('Renders file maximum size', async () => {
          const node = element.shadowRoot.querySelectorAll(
            '.file-properties > .property-attribute'
          )[2];
          const target = node.querySelector('.attribute-value');
          assert.equal(target.innerText.trim().toLowerCase(), '300');
        });
      });
    });
  });

  describe('Array data rendering', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element;
        let amf;
        let type;

        before(async () => {
          const data = await AmfLoader.loadType('testType', item[1], 'W-11858334');
          amf = data[0];
          type = data[1];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          element.range = findTypePropertyRange(element, type, 0, 1);
          await aTimeout(0);
        });

        it('Renders array minimum count', async () => {
          const properties = element.shadowRoot.querySelectorAll('.property-attribute');
          assert.lengthOf(properties, 2);

          const minProperty = properties[0]
          const label = minProperty.querySelector('.attribute-label');
          assert.equal(label.innerText, 'Minimum array length:');

          const value = minProperty.querySelector('.attribute-value');
          assert.equal(value.title, 'Minimum amount of items in array');
          assert.equal(value.innerText.trim().toLowerCase(), '3');
        });

        it('Renders array maximum count', async () => {
          const properties = element.shadowRoot.querySelectorAll('.property-attribute');
          assert.lengthOf(properties, 2);

          const maxProperty = properties[1]
          const label = maxProperty.querySelector('.attribute-label');
          assert.equal(label.innerText, 'Maximum array length:');

          const value = maxProperty.querySelector('.attribute-value');
          assert.equal(value.title, 'Maximum amount of items in array');
          assert.equal(value.innerText.trim().toLowerCase(), '10');
        });
      });
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
      element.range = data[1];
      await aTimeout(0);
      await assert.isAccessible(element);
    });
  });

  describe('Properties with enum values', () => {
    let element;

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns false when no in property in range', () => {
      element.range = {};
      assert.isFalse(element.isEnum);
    });

    // This file does not exists
    it.skip('Sets isEnum property to true when string array with enum', async () => {
      element.range = await getTypePropertyRange(
        element,
        'ApiQuickSearchFilters',
        false,
        0,
        'APIC-405'
      );
      assert.isTrue(element.isEnum);
      assert.deepEqual(element.enumValues, [
        'WORD',
        'NAME',
        'NUMBER',
        'IR_NUMBER',
      ]);
    });
  });
});
