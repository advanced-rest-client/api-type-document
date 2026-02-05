/* eslint-disable prefer-destructuring */
import { fixture, assert, aTimeout, nextFrame } from '@open-wc/testing'
import { AmfLoader } from './amf-loader.js';
import '../api-type-document.js';

/** @typedef {import('..').ApiTypeDocument} ApiTypeDocument */
/** @typedef {import('@api-components/amf-helper-mixin').AmfDocument} AmfDocument */

/**
 * Test for array response examples in OAS 3.0.
 *
 * This test reproduces the bug where example payloads were not displaying
 * on the Exchange main page for APIs using OpenAPI Specification (OAS) 3.0.0
 * when the response schema is an array type.
 *
 * The issue affected partner automation for order placement and was caused by
 * the component not recognizing array types as eligible for example rendering,
 * only checking for object types.
 *
 * Bug details:
 * - Started: January 30, 2026
 * - Impact: All OAS 3.0.0 specifications with array response schemas
 * - Examples visible in Design Center but failed to render in Exchange
 * - RAML specifications were unaffected
 *
 * Fix: Added isArray checks alongside isObject checks in:
 * - _showExamples computation
 * - _exampleMediaType defaulting (both should default to 'application/json')
 */
describe('Array Examples - OAS 3.0 (nested-examples)', () => {
  const file = 'nested-examples-oas3';

  /**
   * @returns {Promise<ApiTypeDocument>}
   */
  async function basicFixture() {
    return fixture(`<api-type-document></api-type-document>`);
  }

  /**
   * Get response payload schema for a specific endpoint and operation
   * @param {AmfDocument} model
   * @param {string} endpoint
   * @param {string} operation
   * @returns {any}
   */
  function getResponsePayloadSchema(model, endpoint, operation) {
    const op = AmfLoader.lookupOperation(model, endpoint, operation);

    // Find the response with status 200
    const returnsKey = Object.keys(op).find(k => k.includes('returns'));
    if (!returnsKey) return null;

    const responses = op[returnsKey];
    let response200;

    for (const resp of responses) {
      const statusKey = Object.keys(resp).find(k => k.includes('statusCode'));
      if (statusKey && resp[statusKey]) {
        const statusValue = Array.isArray(resp[statusKey]) ? resp[statusKey][0] : resp[statusKey];
        const status = typeof statusValue === 'object' ? statusValue['@value'] : statusValue;
        if (status === '200') {
          response200 = resp;
          break;
        }
      }
    }

    if (!response200) return null;

    // Get payload
    const payloadKey = Object.keys(response200).find(k => k.includes('payload'));
    if (!payloadKey) return null;

    const payloads = response200[payloadKey];
    const payload = Array.isArray(payloads) ? payloads[0] : payloads;

    // Get schema
    const schemaKey = Object.keys(payload).find(k => k.includes('schema'));
    if (!schemaKey) return null;

    const schemas = payload[schemaKey];
    return Array.isArray(schemas) ? schemas[0] : schemas;
  }

  [
    ['Regular model', false],
    ['Compact model', true],
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

      it('loads the nested-examples-oas3 model', async () => {
        assert.exists(amf, 'AMF model should be loaded');
      });

      it('identifies array response schema correctly', async () => {
        const responseSchema = getResponsePayloadSchema(amf, '/productOrderItems', 'get');
        assert.exists(responseSchema, 'Response schema should exist');

        element.amf = amf;
        element.type = responseSchema;
        await aTimeout(0);

        // Verify it's recognized as an array type
        assert.isTrue(element.isArray, 'Response schema should be identified as array');
      });

      it('renders examples section for array responses', async () => {
        const responseSchema = getResponsePayloadSchema(amf, '/productOrderItems', 'get');

        element.amf = amf;
        element.type = responseSchema;
        await aTimeout(0);

        // Verify the examples section is rendered
        const examplesSection = element.shadowRoot.querySelector('.examples');
        assert.exists(examplesSection, 'Examples section should be rendered for array responses');
      });

      it('passes resolved type to api-resource-example-document for arrays', async () => {
        const responseSchema = getResponsePayloadSchema(amf, '/productOrderItems', 'get');

        element.amf = amf;
        element.type = responseSchema;
        await aTimeout(0);

        const exampleDoc = element.shadowRoot.querySelector('api-resource-example-document');
        assert.exists(exampleDoc, 'api-resource-example-document should be rendered');
        assert.isDefined(exampleDoc.examples, 'Examples should be passed to the component');
      });

      it('uses default mediaType for arrays without explicit mediaType', async () => {
        const responseSchema = getResponsePayloadSchema(amf, '/productOrderItems', 'get');

        element.amf = amf;
        element.type = responseSchema;
        // Don't set mediaType explicitly
        await aTimeout(0);

        const exampleDoc = element.shadowRoot.querySelector('api-resource-example-document');
        assert.exists(exampleDoc, 'api-resource-example-document should exist');
        assert.equal(
          exampleDoc.mediaType,
          'application/json',
          'Should default to application/json for arrays'
        );
      });

      it('sets _showExamples to true for array types', async () => {
        const responseSchema = getResponsePayloadSchema(amf, '/productOrderItems', 'get');

        element.amf = amf;
        element.type = responseSchema;
        await aTimeout(0);

        assert.isTrue(element._showExamples, '_showExamples should be true for arrays');
      });

      it('respects noMainExample flag for arrays', async () => {
        const responseSchema = getResponsePayloadSchema(amf, '/productOrderItems', 'get');

        element.amf = amf;
        element.noMainExample = true;
        element.type = responseSchema;
        await element.updateComplete;
        await nextFrame();

        const examplesSection = element.shadowRoot.querySelector('.examples');
        assert.notExists(examplesSection, 'Examples should not render when noMainExample is true');
      });

      it('renders complex nested array examples correctly', async () => {
        const responseSchema = getResponsePayloadSchema(amf, '/productOrderItems', 'get');

        element.amf = amf;
        element.type = responseSchema;
        element.mediaType = 'application/json';
        await aTimeout(0);

        const exampleDoc = element.shadowRoot.querySelector('api-resource-example-document');
        assert.exists(exampleDoc, 'Example document should be rendered');

        // Verify the component received the correct props
        assert.equal(exampleDoc.mediaType, 'application/json');
        assert.isDefined(exampleDoc.examples, 'Examples should be defined');
        assert.exists(element.shadowRoot.querySelector('.examples'), 'Examples section should exist');
      });
    });
  });
});
