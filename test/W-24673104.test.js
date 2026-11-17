import { fixture, assert, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-type-document.js';

/** @typedef {import('..').ApiTypeDocument} ApiTypeDocument */

const MODEL = 'W-24673104';
const TYPE = 'Things';
const ARRAYS = ['refNullable', 'refPlain', 'inlineNullable', 'inlinePlain'];

/**
 * Collects text from a root, descending into every nested shadow root.
 * @param {ParentNode} root
 * @return {string}
 */
function deepText(root) {
  let out = '';
  root.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      out += n.textContent;
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      if (n.shadowRoot) {
        out += deepText(n.shadowRoot);
      }
      out += deepText(n);
    }
  });
  return out;
}

describe('W-24673104 nullable scalar description in array members', () => {
  /**
   * Renders the `Things` type and returns its property-shape elements by name.
   * @return {Promise<Map<string, HTMLElement>>}
   */
  async function renderProperties() {
    const [amf, type] = await AmfLoader.loadType(TYPE, false, MODEL);
    const elm = /** @type ApiTypeDocument */ (await fixture(
      `<api-type-document></api-type-document>`
    ));
    elm.amf = amf;
    elm.type = type;
    await aTimeout(100);
    const found = new Map();
    elm.shadowRoot.querySelectorAll('property-shape-document').forEach((prop) => {
      const nameEl = prop.shadowRoot.querySelector('.property-name');
      if (nameEl) {
        found.set(nameEl.textContent.trim(), prop);
      }
    });
    return found;
  }

  ARRAYS.forEach((name) => {
    it(`${name}: array member descriptions render for every scalar member`, async () => {
      const props = await renderProperties();
      const prop = props.get(name);
      assert.ok(prop, `property ${name} is rendered`);
      prop.toggle();
      await prop.updateComplete;
      await aTimeout(50);
      const text = deepText(prop.shadowRoot);
      assert.include(text, 'Unique identifier', `${name} shows uniqueId description`);
      assert.include(text, 'Amount in USD', `${name} shows amount description`);
    });
  });
});
