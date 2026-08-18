/* eslint-disable prefer-destructuring */
import { fixture, assert, aTimeout } from '@open-wc/testing';
import '../api-type-document.js';

/** @typedef {import('..').ApiTypeDocument} ApiTypeDocument */

/**
 * Regression tests for composition schema variant labels (oneOf/anyOf/allOf)
 * for OAS 3.1/3.2 — W-23748896 (AC1).
 *
 * AMF generates synthetic placeholder names (`item0`, `item1`,
 * `amf_inline_type_...`) for inline anonymous composition members. The oneOf /
 * anyOf path (`_computeTypes`) used to render those raw as tab labels; the fix
 * replaces them with a datatype (for scalars) or a 1-indexed "Option N"
 * positional label. The allOf path (`_computeAndTypes`) already nulled such
 * names, but with a fragile `indexOf('item') === 0` check that also mis-matched
 * legit names like `item`/`items`; both paths now share
 * `_isPlaceholderTypeLabel`.
 *
 * Nodes are built inline (no api-model-generator) so the shapes are
 * deterministic and independent of the pinned generator version. With `amf`
 * unset, `_getAmfKey` returns the raw expanded URIs, so keys/`@type` use the
 * full namespace strings from `element.ns`.
 */
describe('Composition variant labels', () => {
  /** @returns {Promise<ApiTypeDocument>} */
  async function basicFixture() {
    return fixture(`<api-type-document></api-type-document>`);
  }

  /** @type ApiTypeDocument */
  let element;

  beforeEach(async () => {
    element = await basicFixture();
  });

  function shapes() {
    return element.ns.aml.vocabularies.shapes;
  }

  /** Builds an AMF compact `core.name` entry. */
  function withName(node, name) {
    const nameKey = element._getAmfKey(element.ns.aml.vocabularies.core.name);
    return { ...node, [nameKey]: [{ '@value': name }] };
  }

  /** Object (NodeShape) inline variant with the given synthetic/real name. */
  function objectVariant(name) {
    return withName({ '@type': [element.ns.w3.shacl.NodeShape] }, name);
  }

  /** Scalar (string) inline variant with the given synthetic/real name. */
  function scalarVariant(name) {
    const datatypeKey = element._getAmfKey(element.ns.w3.shacl.datatype);
    return withName(
      {
        '@type': [shapes().ScalarShape],
        [datatypeKey]: [{ '@id': element.ns.w3.xmlSchema.string }],
      },
      name
    );
  }

  /** A oneOf wrapper shape whose `xone` members are the given variants. */
  function oneOfNode(variants) {
    const xoneKey = element._getAmfKey(element.ns.w3.shacl.xone);
    return {
      '@type': [shapes().AnyShape],
      [xoneKey]: variants,
    };
  }

  /**
   * Sets the type and flushes both the Lit render and the `_typeChanged`
   * debouncer (scheduled via setTimeout), so the multi-type tab selector is
   * rendered.
   * @param {object} type
   */
  async function applyType(type) {
    element.type = type;
    await element.updateComplete;
    await aTimeout(0);
    await element.updateComplete;
  }

  describe('oneOf tab labels via _computeTypes', () => {
    it('replaces item0/item1 placeholders with 1-indexed "Option N"', () => {
      const key = element._getAmfKey(element.ns.w3.shacl.xone);
      const node = oneOfNode([objectVariant('item0'), objectVariant('item1')]);

      const result = element._computeTypes(node, key);

      assert.lengthOf(result, 2);
      assert.equal(result[0].label, 'Option 1');
      assert.equal(result[1].label, 'Option 2');
    });

    it('uses the datatype for a scalar variant with a placeholder name', () => {
      const key = element._getAmfKey(element.ns.w3.shacl.xone);
      const node = oneOfNode([scalarVariant('item0')]);

      const result = element._computeTypes(node, key);

      assert.equal(result[0].label, 'String');
    });

    it('keeps a real core.name (no over-replacement)', () => {
      const key = element._getAmfKey(element.ns.w3.shacl.xone);
      const node = oneOfNode([objectVariant('Cat'), objectVariant('Dog')]);

      const result = element._computeTypes(node, key);

      assert.equal(result[0].label, 'Cat');
      assert.equal(result[1].label, 'Dog');
    });

    it('renders "Option 1"/"Option 2" as the tab text (end to end)', async () => {
      await applyType(oneOfNode([objectVariant('item0'), objectVariant('item1')]));

      assert.isTrue(element.isOneOf, 'element is classified as oneOf');
      const toggles = element.shadowRoot.querySelectorAll('.one-of-toggle');
      assert.lengthOf(toggles, 2, 'renders one tab per variant');
      assert.equal(toggles[0].textContent.trim(), 'Option 1');
      assert.equal(toggles[1].textContent.trim(), 'Option 2');
    });
  });

  describe('_isPlaceholderTypeLabel()', () => {
    it('is true for item0', () => {
      assert.isTrue(element._isPlaceholderTypeLabel('item0'));
    });

    it('is true for item5', () => {
      assert.isTrue(element._isPlaceholderTypeLabel('item5'));
    });

    it('is true for amf_inline_type_1', () => {
      assert.isTrue(element._isPlaceholderTypeLabel('amf_inline_type_1'));
    });

    it('is false for the legit name "item"', () => {
      assert.isFalse(element._isPlaceholderTypeLabel('item'));
    });

    it('is false for the legit name "items"', () => {
      assert.isFalse(element._isPlaceholderTypeLabel('items'));
    });

    it('is false for a real name "Cat"', () => {
      assert.isFalse(element._isPlaceholderTypeLabel('Cat'));
    });

    it('is false for empty string', () => {
      assert.isFalse(element._isPlaceholderTypeLabel(''));
    });

    it('is false for undefined', () => {
      assert.isFalse(element._isPlaceholderTypeLabel(undefined));
    });

    it('is false for null', () => {
      assert.isFalse(element._isPlaceholderTypeLabel(null));
    });
  });

  describe('allOf placeholder handling (shared helper)', () => {
    it('does NOT null a legit member named "items" (anchored regex fix)', () => {
      const result = element._computeAndTypes([objectVariant('items')]);
      assert.equal(result[0].label, 'items');
    });

    it('still nulls a synthetic placeholder member named "item0"', () => {
      const result = element._computeAndTypes([objectVariant('item0')]);
      assert.isUndefined(result[0].label);
    });
  });
});
