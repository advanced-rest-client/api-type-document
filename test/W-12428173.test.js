/* eslint-disable prefer-destructuring */
import {fixture, assert, aTimeout} from '@open-wc/testing'
import { AmfLoader } from './amf-loader.js';
import '../api-type-document.js';

/** @typedef {import('..').ApiTypeDocument} ApiTypeDocument */
/** @typedef {import('..').PropertyShapeDocument} PropertyShapeDocument */
/** @typedef {import('@api-components/amf-helper-mixin').AmfDocument} AmfDocument */

describe('<api-type-document>', () => {
  const file = 'W-12428173';

  /**
   * @returns {Promise<ApiTypeDocument>}
   */
  async function basicFixture() {
    return fixture(`<api-type-document></api-type-document>`);
  }

  [
    ['Regular model', false],
    ['Compact model', true],
  ].forEach((item) => {
    describe(String(item[0]), () => {
      let element = /** @type ApiTypeDocument */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('renders complex element', async () => {
        const data = await AmfLoader.loadType('valueAddedServiceMapping', item[1], file);
        element.amf = data[0];
        element.type = data[1];
        await aTimeout(0);

        const shape = element.shadowRoot.querySelector('property-shape-document')
        assert.ok(shape);

        /** @type HTMLElement */ (shape.shadowRoot.querySelector('.complex-toggle')).click();
        await aTimeout(0);
        await aTimeout(0);

        assert.ok(shape.shadowRoot.querySelector('api-type-document.children.complex'));
      });
    });
  });
});
