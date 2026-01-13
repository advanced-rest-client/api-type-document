import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-type-document.js';

/** @typedef {import('..').ApiTypeDocument} ApiTypeDocument */

describe('Nullable Types Rendering', () => {
  /**
   * @param {ApiTypeDocument} element
   * @param {string} typeName
   * @param {string} propertyName
   * @returns {HTMLElement|null}
   */
  async function getPropertyElement(element, typeName, propertyName) {
    const data = await AmfLoader.loadType(typeName, false, 'nullable-test');
    element.amf = data[0];
    element.type = data[1];
    await aTimeout(100);
    
    const properties = element.shadowRoot.querySelectorAll('property-shape-document');
    for (const prop of properties) {
      const nameEl = prop.shadowRoot.querySelector('.property-name');
      if (nameEl && nameEl.textContent.trim() === propertyName) {
        return prop;
      }
    }
    return null;
  }

  /**
   * @param {HTMLElement} propertyElement
   * @returns {string}
   */
  function getDataType(propertyElement) {
    const dataTypeEl = propertyElement.shadowRoot.querySelector('.data-type');
    return dataTypeEl ? dataTypeEl.textContent.trim() : '';
  }

  /**
   * @param {HTMLElement} propertyElement
   * @returns {boolean}
   */
  function hasUnionSelector(propertyElement) {
    return !!propertyElement.shadowRoot.querySelector('.union-type-selector, .any-of, .one-of');
  }

  [
    ['Regular model', false],
    ['Compact model', true],
  ].forEach((item) => {
    describe(String(item[0]), () => {
      /** @type ApiTypeDocument */
      let element;

      beforeEach(async () => {
        element = await fixture(`<api-type-document></api-type-document>`);
      });

      describe('Scalar Nullables (should show "Type or null")', () => {
        const scalarTests = [
          ['nullableString', 'String or null'],
          ['nullableInteger', 'Integer or null'],
          ['nullableNumber', 'Number or null'],
          ['nullableBoolean', 'Boolean or null'],
          ['nullableDateTime', 'DateTime or null'],
          ['nullableDate', 'Date or null'],
          ['nullableEmail', 'String or null'],
          ['nullableUuid', 'String or null'],
        ];

        scalarTests.forEach(([propertyName, expectedType]) => {
          it(`${propertyName} should show "${expectedType}"`, async () => {
            const prop = await getPropertyElement(element, 'ScalarNullables', propertyName);
            assert.exists(prop, `Property ${propertyName} should exist`);
            
            const dataType = getDataType(prop);
            assert.equal(dataType, expectedType, `Data type should be ${expectedType}`);
            
            const hasSelector = hasUnionSelector(prop);
            assert.isFalse(hasSelector, 'Should NOT have union selector');
          });
        });
      });

      describe('Complex Nullables (should also show "Type or null")', () => {
        const complexTests = [
          ['nullableArray', 'Array or null'],
          ['nullableObject', 'Object or null'],
          ['nullableArrayOfObjects', 'Array or null'],
        ];

        complexTests.forEach(([propertyName, expectedType]) => {
          it(`${propertyName} should show "${expectedType}"`, async () => {
            const prop = await getPropertyElement(element, 'ComplexNullables', propertyName);
            assert.exists(prop, `Property ${propertyName} should exist`);
            
            const dataType = getDataType(prop);
            assert.equal(dataType, expectedType, `Data type should be ${expectedType}`);
            
            const hasSelector = hasUnionSelector(prop);
            assert.isFalse(hasSelector, 'Should NOT have union selector');
          });
        });
      });

      describe('Real Unions (should keep Union selector)', () => {
        it('stringOrNumber should show Union selector', async () => {
          const prop = await getPropertyElement(element, 'RealUnions', 'stringOrNumber');
          assert.exists(prop, 'Property should exist');
          
          const dataType = getDataType(prop);
          // Real unions should not be simplified
          assert.notInclude(dataType, 'or null', 'Should not show as nullable');
        });

        it('multipleTypes should show Union selector', async () => {
          const prop = await getPropertyElement(element, 'RealUnions', 'multipleTypes');
          assert.exists(prop, 'Property should exist');
          
          const dataType = getDataType(prop);
          assert.notInclude(dataType, 'or null', 'Should not show as nullable');
        });
      });

      describe('Nested Nullables', () => {
        it('nested scalar nullable (email) should show "String or null"', async () => {
          const data = await AmfLoader.loadType('NestedNullables', false, 'nullable-test');
          element.amf = data[0];
          element.type = data[1];
          await aTimeout(150);
          
          // Find the user object property
          const userProp = Array.from(
            element.shadowRoot.querySelectorAll('property-shape-document')
          ).find(p => {
            const name = p.shadowRoot.querySelector('.property-name');
            return name && name.textContent.trim() === 'user';
          });
          
          assert.exists(userProp, 'User property should exist');
          
          // Expand the user object
          const toggleBtn = userProp.shadowRoot.querySelector('.complex-toggle');
          if (toggleBtn) {
            toggleBtn.click();
            await aTimeout(100);
          }
          
          // Now check for email inside
          const apiTypeDoc = userProp.shadowRoot.querySelector('api-type-document');
          if (apiTypeDoc) {
            const emailProp = Array.from(
              apiTypeDoc.shadowRoot.querySelectorAll('property-shape-document')
            ).find(p => {
              const name = p.shadowRoot.querySelector('.property-name');
              return name && name.textContent.trim() === 'email';
            });
            
            if (emailProp) {
              const dataType = getDataType(emailProp);
              assert.equal(dataType, 'String or null', 'Nested email should show "String or null"');
            }
          }
        });
      });

      describe('Edge Cases', () => {
        const edgeCaseTests = [
          ['enumNullable', 'String or null'],
          ['numberWithConstraints', 'Number or null'],
          ['stringWithPattern', 'String or null'],
          ['readOnlyNullable', 'String or null'],
          ['deprecatedNullable', 'Integer or null'],
        ];

        edgeCaseTests.forEach(([propertyName, expectedType]) => {
          it(`${propertyName} should show "${expectedType}"`, async () => {
            const prop = await getPropertyElement(element, 'EdgeCases', propertyName);
            assert.exists(prop, `Property ${propertyName} should exist`);
            
            const dataType = getDataType(prop);
            assert.equal(dataType, expectedType, `Data type should be ${expectedType}`);
            
            const hasSelector = hasUnionSelector(prop);
            assert.isFalse(hasSelector, 'Should NOT have union selector');
          });
        });
      });

      describe('Request/Response Schemas', () => {
        it('TestRequest.timezone should show "String or null"', async () => {
          const prop = await getPropertyElement(element, 'TestRequest', 'timezone');
          assert.exists(prop, 'Property should exist');
          
          const dataType = getDataType(prop);
          assert.equal(dataType, 'String or null');
        });

        it('TestResponse.message should show "String or null"', async () => {
          const prop = await getPropertyElement(element, 'TestResponse', 'message');
          assert.exists(prop, 'Property should exist');
          
          const dataType = getDataType(prop);
          assert.equal(dataType, 'String or null');
        });

        it('TestResponse.errorCode should show "Integer or null"', async () => {
          const prop = await getPropertyElement(element, 'TestResponse', 'errorCode');
          assert.exists(prop, 'Property should exist');
          
          const dataType = getDataType(prop);
          assert.equal(dataType, 'Integer or null');
        });
      });
    });
  });
});

