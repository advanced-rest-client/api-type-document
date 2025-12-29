import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@api-components/api-navigation/api-navigation.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '../api-type-document.js';

/* eslint-disable no-continue */

class ApiDemo extends ApiDemoPage {
  constructor() {
    super();
    this.endpointsOpened = false;
    this.typesOpened = true;
    this.hasType = false;
    this.noActions = false;
    this.componentName = 'api-type-document';
    this.renderReadOnly = true;
    this.initObservableProperties([
      'noActions',
      'dataProperties',
      'mediaType',
      'mediaTypes',
      'renderReadOnly',
    ]);
    this._toggleRenderReadOnly = this._toggleRenderReadOnly.bind(this);
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
   this.hasType = false;
    this.mediaType = undefined;
    this.mediaTypes = undefined;

    if (type === 'type') {
      this.setTypeData(selected);
    } else if (type === 'method') {
      this.setBodyData(selected);
    }
  }

  setBodyData(id) {
    const webApi = this._computeWebApi(this.amf) || this._computeApi(this.amf);
    const method = this._computeMethodModel(webApi, id);
    const expects = this._computeExpects(method);
    const payload = expects ? this._computePayload(expects)[0] : {};
    const mt = this._getValue(payload, this.ns.aml.vocabularies.core.mediaType);
    const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.schema);
    let schema = payload && payload[key];
    if (!schema) {
      return;
    }
    schema = schema instanceof Array ? schema[0] : schema;
    this.dataProperties = schema;
    this.mediaType = mt;
    this.hasType = true;
  }

  setTypeData(id) {
    const declares = this._computeDeclares(this.amf);
    const refs = this._computeReferences(this.amf);
    const type = this._computeType(declares, refs, id);

    if (!type) {
      console.error('Type not found');
      return;
    }
    this.dataProperties = type;
    this.hasType = true;

    let webApi = this._computeWebApi(this.amf);
    if (webApi instanceof Array) {
      [webApi] = webApi;
    }
    const key = this._getAmfKey(this.ns.aml.vocabularies.apiContract.accepts);
    const value = this._ensureArray(webApi[key]);
    if (value) {
      this.mediaTypes = value.map((item) => item['@value']);
    }
  }

  // _headerTemplate() {
  //   return html`
  //   <header>
  //     <paper-dropdown-menu label="Select demo API">
  //       <paper-listbox slot="dropdown-content" id="apiList" @selected-changed="${this._apiChanged}">
  //       ${this._apiListTemplate()}
  //       </paper-listbox>
  //     </paper-dropdown-menu>
  //     <div class="spacer"></div>
  //     <div class="options">
  //       <paper-toggle-button @checked-changed="${this._optionChanged}"
  //         id="narrow">Render narrow view</paper-toggle-button>
  //       <paper-toggle-button @checked-changed="${this._optionChanged}"
  //         id="noActions">Remove actions from examples</paper-toggle-button>
  //     </div>
  //   </header>`;
  // }

  _apiListTemplate() {
    return [
      // grpc
      ['grpc-test', 'GRPC test'],
      ['shopper-products', 'shopper-products'],
      ['demo-api', 'Demo API'],
      ['avro', 'avro'],
      ['avro2', 'avro2'],
      ['jldAsync26', 'jldAsync26'],
      ['APIC-649', 'Deprecated properties'],
      ['APIC-429', 'APIC 429'],
      ['read-only-properties', 'Read Only Properties API'],
      ['examples-api', 'Examples render demo'],
      ['Petstore', 'OAS: Petstore'],
      ['apic-83', 'APIC-83'],
      ['SE-10469', 'SE-1046'],
      ['SE-11155', 'SE-11155'],
      ['demo-api-v4', 'Demo Api - AMF v4'],
      ['APIC-282', 'APIC-282'],
      ['new-oas3-types', 'New OAS 3 types API'],
      ['APIC-483', 'APIC 483'],
      ['array-type', 'array-type'],
      ['W-11858334', 'W-11858334'],
      ['W-12137562', 'W-12137562'],
      ['W-12428173', 'W-12428173'],
      ['W-13547158', 'W-13547158'],
      ['W-13770031', 'W-13770031'],
    ].map(
      ([file, label]) => html` <anypoint-item data-src="${file}-compact.json"
          >${label} - compact model</anypoint-item
        >
        <anypoint-item data-src="${file}.json">${label}</anypoint-item>`
    );
  }

  _toggleRenderReadOnly() {
    this.renderReadOnly = !this.renderReadOnly;
  }

  contentTemplate() {
    return html`
      ${this.hasType
        ? html`<div>
              <anypoint-checkbox
                @change="${this._toggleRenderReadOnly}"
                ?checked="${this.renderReadOnly}"
              >
                Render read-only
              </anypoint-checkbox>
            </div>
            <api-type-document
              ?narrow="${this.narrow}"
              .amf="${this.amf}"
              .type="${this.dataProperties}"
              .mediaType="${this.mediaType}"
              .mediaTypes="${this.mediaTypes}"
              ?noexamplesactions="${this.noActions}"
              ?renderReadOnly="${this.renderReadOnly}"
            ></api-type-document>`
        : html`<p>Select type in the navigation to see the demo.</p>`}
    `;
  }
}

const instance = new ApiDemo();
instance.render();
