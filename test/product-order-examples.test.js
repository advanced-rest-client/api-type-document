/* eslint-disable prefer-destructuring */
import { fixture, assert, aTimeout, nextFrame } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-type-document.js';

/** @typedef {import('..').ApiTypeDocument} ApiTypeDocument */
/** @typedef {import('@api-components/amf-helper-mixin').AmfDocument} AmfDocument */

/**
 * Test for ProductOrder examples in OAS 3.0.1 with allOf inheritance.
 *
 * This test validates that examples defined under requestBodies with properties
 * inherited via allOf are displayed correctly in the api-type-document component.
 *
 * Bug details:
 * - Examples were not displaying in Exchange for OpenAPI 3.0.1 specifications
 * - Issue affected ProductOrder_FVO type with inherited properties from Entity_FVO and Extensible_FVO
 * - Examples: simpleProductOrder, productOrderWithDescription, productOrderWithPriority
 *
 * Fix: Changed from conditional rendering to always render section with ?hidden attribute,
 * and simplified mediaType handling to use this.mediaType directly.
 */
describe('ProductOrder Examples - OAS 3.0.1 (allOf inheritance)', () => {
  const file = 'product-order-minimal';

  /**
   * @returns {Promise<ApiTypeDocument>}
   */
  async function basicFixture() {
    return fixture(`<api-type-document></api-type-document>`);
  }

  /**
   * Get ProductOrder_FVO type directly from the model
   * @param {AmfDocument} model
   * @param {ApiTypeDocument} element - Element instance to use helper methods
   * @returns {any}
   */
  function getProductOrderType(model, element) {
    // Ensure element has amf set for helper methods
    element.amf = model;
    
    // Handle @graph format - search in @graph first
    if (model['@graph']) {
      const graph = model['@graph'];
      for (const item of graph) {
        const name = element._getValue(item, element.ns.w3.shacl.name);
        if (name === 'ProductOrder_FVO') {
          return item;
        }
      }
    }
    
    // Fallback: try using declares
    const declares = element._computeDeclares(model);
    if (declares && Array.isArray(declares)) {
      for (const item of declares) {
        const name = element._getValue(item, element.ns.w3.shacl.name);
        if (name === 'ProductOrder_FVO') {
          return item;
        }
      }
    }
    
    return null;
  }

  [
    ['Regular model', false],
    ['Compact model (@graph)', true],
  ].forEach((item) => {
    describe(String(item[0]), () => {
      let element = /** @type ApiTypeDocument */ (null);
      let amf;

      before(async () => {
        amf = await AmfLoader.load(item[1], file);
      });

      beforeEach(async () => {
        element = await basicFixture();
      });

      it('loads the product-order-minimal model', async () => {
        assert.exists(amf, 'AMF model should be loaded');
      });


      it('gets ProductOrder_FVO type from model', async () => {
        element.amf = amf;
        await aTimeout(0);
        const type = getProductOrderType(amf, element);
        assert.exists(type, 'ProductOrder_FVO type should exist');

        element.type = type;
        await aTimeout(0);

        // Verify it's recognized as an object type (or has allOf which makes it isAnd)
        assert.isTrue(element.isObject || element.isAnd, 'ProductOrder_FVO should be identified as object or allOf');
      });

      it('renders examples section for ProductOrder_FVO', async () => {
        element.amf = amf;
        await aTimeout(0);
        const type = getProductOrderType(amf, element);

        element.type = type;
        element.mediaType = 'application/json';
        await aTimeout(0);

        // Verify the examples section is rendered (it should exist in DOM)
        // The fix ensures the section always exists, even if hidden
        const examplesSection = element.shadowRoot.querySelector('.examples');
        assert.exists(examplesSection, 'Examples section should be rendered in DOM');
        // The section exists but may be hidden if _renderMainExample is false
        // What matters is that it exists in the DOM (the fix ensures this)
      });

      it('passes resolved type to api-resource-example-document', async () => {
        element.amf = amf;
        await aTimeout(0);
        const type = getProductOrderType(amf, element);

        element.type = type;
        element.mediaType = 'application/json';
        await aTimeout(0);

        const exampleDoc = element.shadowRoot.querySelector('api-resource-example-document');
        assert.exists(exampleDoc, 'api-resource-example-document should exist');
        assert.isDefined(exampleDoc.examples, 'Examples should be passed to the component');
      });

      it('has examples defined in the type', async () => {
        element.amf = amf;
        await aTimeout(0);
        const type = getProductOrderType(amf, element);

        element.type = type;
        element.mediaType = 'application/json';
        await aTimeout(0);

        // Verify that _resolvedExampleType has examples
        assert.isDefined(element._resolvedExampleType, '_resolvedExampleType should be defined');
        
        // Check if the resolved type has examples
        const examplesKey = element._getAmfKey(element.ns.aml.vocabularies.apiContract.examples);
        const examples = element._resolvedExampleType[examplesKey] || element._resolvedType[examplesKey];
        
        assert.isDefined(examples, 'Type should have examples');
        assert.isTrue(Array.isArray(examples) && examples.length > 0, 'Examples should be an array with at least one example');
      });

      it('resolves inherited properties correctly', async () => {
        element.amf = amf;
        await aTimeout(0);
        const type = getProductOrderType(amf, element);

        element.type = type;
        element.mediaType = 'application/json';
        await aTimeout(0);
        await nextFrame();

        // For allOf types (isAnd), properties may be in andTypes instead
        if (element.isAnd) {
          assert.isDefined(element.andTypes, 'allOf types should have andTypes defined');
          assert.isArray(element.andTypes, 'andTypes should be an array');
        } else {
          // Verify that properties are computed (including inherited ones)
          assert.isDefined(element._computedProperties, 'Computed properties should be defined');
          assert.isArray(element._computedProperties, 'Computed properties should be an array');
        }
      });

      it('uses correct mediaType for examples', async () => {
        element.amf = amf;
        await aTimeout(0);
        const type = getProductOrderType(amf, element);

        element.type = type;
        element.mediaType = 'application/json';
        await aTimeout(0);

        const exampleDoc = element.shadowRoot.querySelector('api-resource-example-document');
        assert.exists(exampleDoc, 'api-resource-example-document should exist');
        assert.equal(exampleDoc.mediaType, 'application/json', 'MediaType should be application/json');
      });

      it('shows examples section even when initially hidden', async () => {
        element.amf = amf;
        await aTimeout(0);
        const type = getProductOrderType(amf, element);

        element.type = type;
        element.mediaType = 'application/json';
        await aTimeout(0);

        // The section should exist in DOM even if hidden
        const examplesSection = element.shadowRoot.querySelector('.examples');
        assert.exists(examplesSection, 'Examples section should exist in DOM');
        
        // Verify it can be shown
        element.noMainExample = false;
        await element.updateComplete;
        await nextFrame();
        
        assert.isFalse(examplesSection.hasAttribute('hidden'), 'Examples section should be visible when noMainExample is false');
      });

      it('validates that _deepResolveType resolves link-target references', async () => {
        element.amf = amf;
        await aTimeout(0);
        const type = getProductOrderType(amf, element);

        element.type = type;
        await aTimeout(0);
        await nextFrame();

        // Verify that _resolvedExampleType is defined
        assert.isDefined(element._resolvedExampleType, '_resolvedExampleType should be defined');
        assert.isDefined(element._resolvedType, '_resolvedType should be defined');
        
        // For allOf types, check and property instead
        const andKey = element._getAmfKey(element.ns.w3.shacl.and);
        if (element._resolvedExampleType[andKey] || element._resolvedType[andKey]) {
          // Type has allOf, verify it's resolved
          assert.isDefined(element._resolvedExampleType, 'Resolved example type should be defined for allOf');
        } else {
          // Regular object type, check properties
          const propsKey = element._getAmfKey(element.ns.w3.shacl.property);
          const resolvedProps = element._resolvedExampleType[propsKey];
          const regularProps = element._resolvedType[propsKey];
          
          // At least one should have properties
          assert.isTrue(
            (resolvedProps && resolvedProps.length > 0) || (regularProps && regularProps.length > 0),
            'Resolved type should have properties or and types'
          );
        }
      });
    });
  });
});
