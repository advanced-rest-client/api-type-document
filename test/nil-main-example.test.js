/* eslint-disable prefer-destructuring */
import { fixture, assert, aTimeout } from '@open-wc/testing';
import '../api-type-document.js';

/** @typedef {import('..').ApiTypeDocument} ApiTypeDocument */

/**
 * Regression tests for the "empty main-example section for Nil types" bug.
 *
 * AMF 5.11.x materializes OAS `example: null` as a concrete Example node, which
 * flips `_hasExamples` to `true` on Nil-typed props and made the standalone
 * `.examples` section render empty. The fix suppresses that section for
 * scalar-like types (Scalar + Nil), mirroring `_typeChanged`.
 *
 * Nodes are built inline (no api-model-generator) so the shapes are
 * deterministic and independent of the pinned generator version. With `amf`
 * unset, `_getAmfKey` returns the raw expanded URIs, so `@type` uses the full
 * namespace strings from `element.ns`.
 */
describe('Nil main-example suppression', () => {
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

  function nilNode() {
    return { '@type': [shapes().NilShape] };
  }

  function scalarNode() {
    return { '@type': [shapes().ScalarShape] };
  }

  function objectNode() {
    return { '@type': [element.ns.w3.shacl.NodeShape] };
  }

  function arrayNode() {
    return { '@type': [shapes().ArrayShape] };
  }

  /**
   * Builds a nullable union `[Scalar, Nil]` whose members match what
   * `_checkNullableUnion` recognizes: a UnionShape with exactly two `anyOf`
   * members, one NilShape and one non-nil.
   */
  function nullableUnionNode() {
    const anyOfKey = element._getAmfKey(shapes().anyOf);
    return {
      '@type': [shapes().UnionShape],
      [anyOfKey]: [scalarNode(), nilNode()],
    };
  }

  /**
   * Sets the type, forces the "has examples" signal, and flushes both the
   * Lit render and the `_typeChanged` debouncer (scheduled via setTimeout).
   * @param {object} type
   */
  async function applyTypeWithExamples(type) {
    element.type = type;
    element._hasExamples = true;
    await element.updateComplete;
    await aTimeout(0);
    await element.updateComplete;
  }

  it('A - pure Nil with examples keeps the main-example section hidden', async () => {
    await applyTypeWithExamples(nilNode());

    assert.isFalse(element._renderMainExample, '_renderMainExample is false for Nil');
    const section = element.shadowRoot.querySelector('.examples');
    assert.isTrue(section.hasAttribute('hidden'), '.examples section is hidden');
  });

  it('B - nullable union [Scalar, Nil] with examples keeps the section hidden', async () => {
    const type = nullableUnionNode();
    // Sanity: the union is the nullable shape `_typeChanged` treats as scalar.
    assert.isTrue(
      element._checkNullableUnion(type).isNullable,
      'node is a nullable union'
    );

    await applyTypeWithExamples(type);

    assert.isTrue(element.isScalar, '_typeChanged classifies nullable union as scalar');
    assert.isFalse(element._renderMainExample, '_renderMainExample is false for nullable union');
    const section = element.shadowRoot.querySelector('.examples');
    assert.isTrue(section.hasAttribute('hidden'), '.examples section is hidden');
  });

  it('C - object with examples still renders the main-example section', async () => {
    await applyTypeWithExamples(objectNode());

    assert.isTrue(element._renderMainExample, '_renderMainExample is true for object');
    const section = element.shadowRoot.querySelector('.examples');
    assert.isFalse(section.hasAttribute('hidden'), '.examples section is visible');
  });

  describe('_isScalarLikeType()', () => {
    it('is true for a NilShape node', () => {
      assert.isTrue(element._isScalarLikeType(nilNode()));
    });

    it('is true for a ScalarShape node', () => {
      assert.isTrue(element._isScalarLikeType(scalarNode()));
    });

    it('is false for undefined', () => {
      assert.isFalse(element._isScalarLikeType(undefined));
    });

    it('is false for an array input', () => {
      assert.isFalse(element._isScalarLikeType([nilNode()]));
    });

    it('is false for a NodeShape node', () => {
      assert.isFalse(element._isScalarLikeType(objectNode()));
    });

    it('is false for an ArrayShape node', () => {
      assert.isFalse(element._isScalarLikeType(arrayNode()));
    });
  });
});
