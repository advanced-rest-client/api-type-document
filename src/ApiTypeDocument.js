import { LitElement, html } from 'lit-element';
import '@api-components/raml-aware/raml-aware.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@api-components/api-resource-example-document/api-resource-example-document.js';
import '../property-shape-document.js';
import '../property-range-document.js';
import { PropertyDocumentMixin } from './PropertyDocumentMixin.js';
import typeStyles from './TypeStyles.js';

/** @typedef {import('@anypoint-web-components/anypoint-button').AnypointButton} AnypointButton */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */

/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

/**
 * `api-type-document`
 *
 * An element that recuresively renders a documentation for a data type
 * using from model.
 *
 * Pass AMF's shape type `property` array to render the documentation.
 */
export class ApiTypeDocument extends PropertyDocumentMixin(LitElement) {
  get styles() {
    return typeStyles;
  }

  static get properties() {
    return {
      /**
       * `raml-aware` scope property to use.
       */
      aware: { type: String },
      /**
       * A type definition to render.
       * This should be a one of the following AMF types:
       *
       * - `http://www.w3.org/ns/shacl#NodeShape` (Object)
       * - `http://raml.org/vocabularies/shapes#UnionShape` (Union)
       * - `http://raml.org/vocabularies/shapes#ArrayShape` (Array)
       * - `http://raml.org/vocabularies/shapes#ScalarShape` (single property)
       *
       * It also accepts array of properties like list of headers or
       * parameters.
       */
      type: { type: Object },
      /**
       * Media type to use to render examples.
       * If not set a "raw" version of the example from API spec file is used.
       */
      mediaType: { type: String },
      /**
       * A list of supported media types for the type.
       * This is used by `api-resource-example-document` to compute examples.
       * In practive it should be value of raml's `mediaType`.
       *
       * Each item in the array is just a name of thr media type.
       *
       * Example:
       *
       * ```json
       * ["application/json", "application/xml"]
       * ```
       */
      mediaTypes: { type: Array },
      /**
       * Currently selected media type.
       * It is an index of a media type in `mediaTypes` array.
       * It is set to `0` each time the body changes.
       */
      selectedMediaType: { type: Number },
      // The type after it has been resolved.
      _resolvedType: { type: Object },
      /**
       * Should be set if described properties has a parent type.
       * This is used when recursively iterating over properties.
       */
      parentTypeName: { type: String },
      /**
       * Computed value, true if the shape has parent type.
       */
      hasParentType: { type: Boolean },
      /**
       * True if given `type` is a scalar property
       */
      isScalar: { type: Boolean },
      /**
       * True if given `type` is an array property
       */
      isArray: { type: Boolean },
      /**
       * True if given `type` is an object property
       */
      isObject: { type: Boolean },
      /**
       * True if given `type` is an union property
       */
      isUnion: { type: Boolean },
      /**
       * True if given `type` is OAS "and" type.
       */
      isAnd: { type: Boolean },
      /**
       * True if given `type` is OAS "oneOf" type.
       */
      isOneOf: { type: Boolean },
      /**
       * True if given `type` is OAS "anyOf" type.
       */
      isAnyOf: { type: Boolean },
      /**
       * Computed list of union type types to render in union type
       * selector.
       * Each item has `label` and `isScalar` property.
       */
      unionTypes: { type: Array },
      /**
       * Computed list of oneOf type types to render in oneOf type
       * selector.
       * Each item has `label` and `isScalar` property.
       */
      oneOfTypes: { type: Array },
      /**
       * Computed list of anyOf type types to render in anyOf type
       * selector.
       * Each item has `label` and `isScalar` property.
       */
      anyOfTypes: { type: Array },
      /**
       * List of types definition and name for OAS' "and" type
       */
      andTypes: { type: Array },
      /**
       * Selected index of union type in `unionTypes` array.
       */
      selectedUnion: { type: Number },
      /**
       * Selected index of oneOf type in `oneOfTypes` array.
       */
      selectedOneOf: { type: Number },
      /**
       * Selected index of anyOf type in `anyOfTypes` array.
       */
      selectedAnyOf: { type: Number },
      /**
       * A property to set when the component is rendered in the narrow
       * view. To be used with mobile rendering or when the
       * components occupies only small part of the screen.
       */
      narrow: { type: Boolean },
      /**
       * When set an example in this `type` object won't be rendered even if set.
       */
      noMainExample: { type: Boolean },
      /**
       * When rendering schema for a payload set this to the payload ID
       * so the examples can be correctly rendered.
       */
      selectedBodyId: { type: String },

      _hasExamples: { type: Boolean },

      _renderMainExample: { type: Boolean },

      renderReadOnly: { type: Boolean },
    };
  }

  get type() {
    return this._type;
  }

  set type(value) {
    const old = this._type;
    if (old === value) {
      return;
    }
    this._type = value;
    this.requestUpdate('type', old);
    this._resolvedType = this._resolve(value);
    this.__typeChanged();
  }

  get mediaTypes() {
    return this._mediaTypes;
  }

  set mediaTypes(value) {
    const old = this._mediaTypes;
    if (old === value) {
      return;
    }
    this._mediaTypes = value;
    this.requestUpdate('mediaTypes', old);
    this._mediaTypesChanged(value);
  }

  get parentTypeName() {
    return this._parentTypeName;
  }

  set parentTypeName(value) {
    const old = this._parentTypeName;
    if (old === value) {
      return;
    }
    this._parentTypeName = value;
    this.requestUpdate('parentTypeName', old);
    this.hasParentType = !!value;
  }

  get unionTypes() {
    return this._unionTypes;
  }

  set unionTypes(value) {
    const old = this._unionTypes;
    if (old === value) {
      return;
    }
    this._unionTypes = value;
    this.requestUpdate('unionTypes', old);
    this._multiTypesChanged('selectedUnion', value);
  }

  get oneOfTypes() {
    return this._oneOfTypes;
  }

  set oneOfTypes(value) {
    const old = this._oneOfTypes;
    if (old === value) {
      return;
    }
    this._oneOfTypes = value;
    this.requestUpdate('oneOfTypes', old);
    this._multiTypesChanged('selectedOneOf', value);
  }

  get anyOfTypes() {
    return this._anyOfTypes;
  }

  set anyOfTypes(value) {
    const old = this._anyOfTypes;
    if (old === value) {
      return;
    }
    this._anyOfTypes = value;
    this.requestUpdate('anyOfTypes', old);
    this._multiTypesChanged('selectedAnyOf', value);
  }

  get noMainExample() {
    return this._noMainExample;
  }

  set noMainExample(value) {
    const old = this._noMainExample;
    if (old === value) {
      return;
    }
    this._noMainExample = value;
    this.requestUpdate('noMainExample', old);
    this._renderMainExample = this._computeRenderMainExample(
      value,
      this._hasExamples
    );
  }

  get _hasExamples() {
    return this.__hasExamples;
  }

  set _hasExamples(value) {
    const old = this.__hasExamples;
    if (old === value) {
      return;
    }
    this.__hasExamples = value;
    this.requestUpdate('_hasExamples', old);
    this._renderMainExample = this._computeRenderMainExample(
      this.noMainExample,
      value
    );
  }

  constructor() {
    super();
    this.hasParentType = false;
    this.narrow = false;
    this.selectedBodyId = undefined;
    this.aware = undefined;

    this._filterReadOnlyItemsIfNecessary = this._filterReadOnlyItemsIfNecessary.bind(
      this
    );
    this._isPropertyReadOnly = this._isPropertyReadOnly.bind(this);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    // @ts-ignore
    if (window.ShadyCSS) {
      // @ts-ignore
      window.ShadyCSS.styleElement(this);
    }
  }

  _computeRenderMainExample(noMainExample, hasExamples) {
    return !!(!noMainExample && hasExamples);
  }

  /**
   * Called when resolved type or amf changed.
   * Creates a debouncer to compute UI values so it's independent of
   * order of assigning properties.
   */
  __typeChanged() {
    if (this.__typeChangeDebouncer) {
      return;
    }
    this.__typeChangeDebouncer = true;
    setTimeout(() => {
      this.__typeChangeDebouncer = false;
      this._typeChanged(this._resolvedType);
    });
  }

  /**
   * Handles type change. Sets basic view control properties.
   *
   * @param {Array|Object} type Passed type/
   */
  _typeChanged(type) {
    if (!type) {
      return;
    }
    let isScalar = false;
    let isArray = false;
    let isObject = false;
    let isUnion = false;
    let isAnd = false;
    let isOneOf = false;
    let isAnyOf = false;
    let key = ''
    if (type instanceof Array) {
      isObject = true;
    } else if (
      this._hasType(type, this.ns.aml.vocabularies.shapes.ScalarShape) ||
      this._hasType(type, this.ns.aml.vocabularies.shapes.NilShape)
    ) {
      isScalar = true;
    } else if (
      this._hasType(type, this.ns.aml.vocabularies.shapes.UnionShape)
    ) {
      isUnion = true;
      key = this._getAmfKey(this.ns.aml.vocabularies.shapes.anyOf);
      this.unionTypes = this._computeTypes(type, key);
    } else if (this._hasProperty(type, this.ns.w3.shacl.xone)) {
      isOneOf = true;
      key = this._getAmfKey(this.ns.w3.shacl.xone);
      this.oneOfTypes = this._computeTypes(type, key);
    } else if (this._hasProperty(type, this.ns.w3.shacl.or)) {
      isAnyOf = true;
      key = this._getAmfKey(this.ns.w3.shacl.or);
      this.anyOfTypes = this._computeTypes(type, key);
    } else if (
      this._hasType(type, this.ns.aml.vocabularies.shapes.ArrayShape)
    ) {
      isArray = true;
      const iKey = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
      let items = this._ensureArray(type[iKey]);
      if (items) {
        items = items[0];
        const key = this._getAmfKey(this.ns.w3.shacl.and);
        if (key in items) {
          isArray = false;
          isAnd = true;
          this.andTypes = this._computeAndTypes(items[key]);
        }
      }
    } else if (this._hasType(type, this.ns.w3.shacl.NodeShape)) {
      isObject = true;
    } else if (this._hasType(type, this.ns.aml.vocabularies.shapes.AnyShape)) {
      const key = this._getAmfKey(this.ns.w3.shacl.and);
      if (key in type) {
        isAnd = true;
        this.andTypes = this._computeAndTypes(type[key]);
      } else {
        isScalar = true;
      }
    }
    this.isScalar = isScalar;
    this.isArray = isArray;
    this.isObject = isObject;
    this.isUnion = isUnion;
    this.isAnd = isAnd;
    this.isOneOf = isOneOf;
    this.isAnyOf = isAnyOf;
  }

  /**
   * Computes parent name for the array type table.
   *
   * @param {String=} parent `parentTypeName` if available
   * @return {String} Parent type name of refault value for array type.
   */
  _computeArrayParentName(parent) {
    return parent || '';
  }

  /**
   * Resets type selection for property.
   * @param {Array=} types List of current anyOf types.
   * @param {String} property Name of the property to be reset
   * @private
   */
  _multiTypesChanged(property, types) {
    if (!types) {
      return;
    }
    this[property] = 0;
  }

  /**
   * Handler for button click when changing selected type
   * in multi type template.
   * Sets given property to the index returned from button.
   *
   * @param {String} property Property name where selected index is kept
   * @param {MouseEvent} e
   * @private
   */
  _selectType(property, e) {
    const node = /** @type AnypointButton */ (e.target);
    const index = Number(node.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    if (this[property] === index) {
      node.active = true;
    } else {
      this[property] = index;
    }
  }

  /**
   * Computes properties for type
   *
   * @param {Object} type Type object
   * @param {String} key Key of property to search in the `type` object
   * @param {number} selected Index of the currently selected type
   * @returns {object|undefined} Properties for type
   * @private
   */
  _computeProperty(type, key, selected) {
    if (!type) {
      return undefined;
    }
    const data = type[key];
    if (!data) {
      return undefined;
    }
    let item = /** @type object */ (data[selected]);
    if (!item) {
      return undefined;
    }
    if (Array.isArray(item)) {
      [item] = item;
    }
    if (this._hasType(item, this.ns.aml.vocabularies.shapes.ArrayShape)) {
      item = this._resolve(item);
      const ikey = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
      const items = this._ensureArray(item[ikey]);
      if (items && items.length === 1) {
        let result = items[0];
        if (Array.isArray(result)) {
          [result] = result;
        }
        result = this._resolve(result);
        return result;
      }
    }
    if (Array.isArray(item)) {
      [item] = item;
    }
    // @ts-ignore
    return this._resolve(item);
  }

  /**
   * Helper function for the view. Extracts `http://www.w3.org/ns/shacl#property`
   * from the shape model
   *
   * @param {Object} item Range object
   * @return {Object[]|undefined} Shape object
   */
  _computeProperties(item) {
    if (!item) {
      return undefined;
    }
    if (Array.isArray(item)) {
      return item;
    }
    const key = this._getAmfKey(this.ns.w3.shacl.property);
    return this._filterReadOnlyProperties(this._ensureArray(item[key]));
  }

  /**
   * Computes list values for `andTypes` property.
   * @param {Object[]} items List of OAS' "and" properties
   * @return {Object[]|undefined} An array of type definitions and label to render
   */
  _computeAndTypes(items) {
    if (!items || !items.length) {
      return undefined;
    }
    return items.map((item) => {
      if (Array.isArray(item)) {
        [item] = item;
      }
      item = this._resolve(item);
      let label = /** @type string */ (this._getValue(
        item,
        this.ns.aml.vocabularies.core.name
      ));
      if (!label) {
        label = /** @type string */ (this._getValue(
          item,
          this.ns.w3.shacl.name
        ));
      }
      if (label && label.indexOf('item') === 0) {
        label = undefined;
      }
      return {
        label,
        type: item,
      };
    });
  }

  /**
   * Observer for `mediaTypes` property.
   * Controls media type selected depending on the value.
   *
   * @param {string[]} types List of media types that are supported by the API.
   */
  _mediaTypesChanged(types) {
    if (!types || !(types instanceof Array) || !types.length) {
      this.renderMediaSelector = false;
    } else if (types.length === 1) {
      this.renderMediaSelector = false;
      this.mediaType = types[0];
    } else {
      this.renderMediaSelector = true;
      this.mediaType = types[0];
      this.selectedMediaType = 0;
    }
  }

  /**
   * Computes if `selected` equals current item index.
   *
   * @param {number} selected
   * @param {number} index
   * @return {boolean}
   */
  _mediaTypeActive(selected, index) {
    return selected === index;
  }

  /**
   * Handler for media type type button click.
   * Sets `selected` property.
   *
   * @param {MouseEvent} e
   */
  _selectMediaType(e) {
    const button = /** @type AnypointButton */ (e.target);
    const index = Number(button.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    if (index !== this.selectedMediaType) {
      this.selectedMediaType = index;
      this.mediaType = this.mediaTypes[index];
    } else {
      button.active = true;
    }
  }

  _apiChangedHandler(e) {
    const { value } = e.detail;
    this.amf = value;
  }

  _hasExamplesHandler(e) {
    const { value } = e.detail;
    this._hasExamples = value;
  }

  /**
   * @return {TemplateResult[]|string} Templates for object properties
   */
  _objectTemplate() {
    const items = this._computeProperties(this._resolvedType);
    if (!items || !items.length) {
      return '';
    }
    return items.map(
      (item) => html`<property-shape-document
        class="object-document"
        .shape="${this._resolve(item)}"
        .amf="${this.amf}"
        .parentTypeName="${this.parentTypeName}"
        ?narrow="${this.narrow}"
        ?noexamplesactions="${this.noExamplesActions}"
        ?compatibility="${this.compatibility}"
        ?graph="${this.graph}"
        .mediaType="${this.mediaType}"
        ?renderReadOnly="${this.renderReadOnly}"
      ></property-shape-document>`
    );
  }

  /**
   * @return {TemplateResult} Templates for object properties
   */
  _arrayTemplate() {
    const items = this._computeArrayProperties(this._resolvedType) || [];
    return html`
      ${this.hasParentType
        ? html`<property-shape-document
            class="array-document"
            .amf="${this.amf}"
            .shape="${this._resolvedType}"
            .parentTypeName="${this.parentTypeName}"
            ?narrow="${this.narrow}"
            ?noexamplesactions="${this.noExamplesActions}"
            ?compatibility="${this.compatibility}"
            .mediaType="${this.mediaType}"
            ?graph="${this.graph}"
          ></property-shape-document>`
        : ''}

      <div class="array-children">
        ${items.map(
          (item) => html`
            ${item.isShape
              ? html`<property-shape-document
                  class="array-document"
                  .amf="${this.amf}"
                  .shape="${item}"
                  parentTypeName="${this._computeArrayParentName(
                    this.parentTypeName
                  )}"
                  ?narrow="${this.narrow}"
                  ?noexamplesactions="${this.noExamplesActions}"
                  ?compatibility="${this.compatibility}"
                  .mediaType="${this.mediaType}"
                  ?graph="${this.graph}"
                ></property-shape-document>`
              : ''}
            ${item.isType
              ? html`<api-type-document
                  class="union-document"
                  .amf="${this.amf}"
                  .parentTypeName="${this.parentTypeName}"
                  .type="${item}"
                  ?narrow="${this.narrow}"
                  ?noexamplesactions="${this.noExamplesActions}"
                  ?nomainexample="${this._renderMainExample}"
                  ?compatibility="${this.compatibility}"
                  .mediaType="${this.mediaType}"
                  ?graph="${this.graph}"
                ></api-type-document>`
              : ''}
          `
        )}
      </div>
    `;
  }

  /**
   * @return {TemplateResult} Template for an union type
   */
  _unionTemplate() {
    const items = this.unionTypes || [];
    const selected = this.selectedUnion;
    const selectTypeCallback = this._selectType.bind(this, 'selectedUnion');
    const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.anyOf);
    const type = this._computeProperty(this._resolvedType, key,selected);
    const typeName = 'union'
    const label = 'Any of'
    return this._multiTypeTemplate({ label, items, typeName, selected, selectTypeCallback, type });
  }

  /**
   * @return {TemplateResult} Template for a oneOf type
   * @private
   */
  _oneOfTemplate() {
    const items = this.oneOfTypes;
    const label = 'One of';
    const typeName = 'one-of';
    const selected = this.selectedOneOf;
    const selectTypeCallback = this._selectType.bind(this, 'selectedOneOf');
    const key = this._getAmfKey(this.ns.w3.shacl.xone);
    const type = this._computeProperty(this._resolvedType, key, selected);
    return this._multiTypeTemplate({ label, items, typeName, selected, selectTypeCallback, type });
  }

  /**
   * @return {TemplateResult} Template for an anyOf type
   * @private
   */
  _anyOfTemplate() {
    const items = this.anyOfTypes;
    const label = 'Any of';
    const typeName = 'any-of';
    const selected = this.selectedAnyOf;
    const selectTypeCallback = this._selectType.bind(this, 'selectedAnyOf');
    const key = this._getAmfKey(this.ns.w3.shacl.or);
    const type = this._computeProperty(this._resolvedType, key, selected);
    return this._multiTypeTemplate({ label, items, typeName, selected, selectTypeCallback, type });
  }

  /**
   *
   * @param {Object} args
   * @param args.label
   * @param args.items
   * @param args.typeName
   * @param args.selected
   * @param args.selectTypeCallback
   * @param args.type
   * @return {TemplateResult} Template for a type which hosts multiple types
   * @private
   */
  _multiTypeTemplate({ label, items, typeName, selected, selectTypeCallback, type }) {
    return html`
      <div class="union-type-selector">
        <span>${label}:</span>
        ${items.map(
      (item, index) => html`<anypoint-button
            class="${typeName}-toggle"
            data-index="${index}"
            ?activated="${selected === index}"
            aria-pressed="${selected === index ? 'true' : 'false'}"
            @click="${selectTypeCallback}"
            ?compatibility="${this.compatibility}"
            title="Select ${item.label} type"
            >${item.label}</anypoint-button
          >`
    )}
      </div>
      <api-type-document
        class="${typeName}-document"
        .amf="${this.amf}"
        .parentTypeName="${this.parentTypeName}"
        .type="${type}"
        ?narrow="${this.narrow}"
        ?noexamplesactions="${this.noExamplesActions}"
        ?nomainexample="${this._renderMainExample}"
        ?compatibility="${this.compatibility}"
        .mediaType="${this.mediaType}"
        ?graph="${this.graph}"
      ></api-type-document>
    `;
  }

  /**
   * @return {TemplateResult|string} Template for Any type
   */
  _anyTemplate() {
    const items = this.andTypes;
    if (!items || !items.length) {
      return '';
    }
    return html` ${items.map(
      (item) => html` ${item.label
          ? html`<p class="inheritance-label">
              Properties inherited from <b>${item.label}</b>.
            </p>`
          : html`<p class="inheritance-label">Properties defined inline.</p>`}
        <api-type-document
          class="and-document"
          .amf="${this.amf}"
          .type="${item.type}"
          ?narrow="${this.narrow}"
          ?noexamplesactions="${this.noExamplesActions}"
          ?nomainexample="${this._renderMainExample}"
          ?compatibility="${this.compatibility}"
          .mediaType="${this.mediaType}"
          ?graph="${this.graph}"
        ></api-type-document>`
    )}`;
  }

  /**
   * @return {TemplateResult} Template for the element
   */
  render() {
    let parts =
      'content-action-button, code-content-action-button, content-action-button-disabled, ';
    parts +=
      'code-content-action-button-disabled content-action-button-active, ';
    parts +=
      'code-content-action-button-active, code-wrapper, example-code-wrapper, markdown-html';
    const mediaTypes = this.mediaTypes || [];
    return html`<style>
        ${this.styles}
      </style>
      ${this.aware
        ? html`<raml-aware
            @api-changed="${this._apiChangedHandler}"
            scope="${this.aware}"
          ></raml-aware>`
        : ''}
      <section class="examples" ?hidden="${!this._renderMainExample}">
        ${this.renderMediaSelector
          ? html`<div class="media-type-selector">
              <span>Media type:</span>
              ${mediaTypes.map((item, index) => {
                const selected = this.selectedMediaType === index;
                const pressed = selected ? 'true' : 'false';
                return html`<anypoint-button
                  part="content-action-button"
                  class="media-toggle"
                  data-index="${index}"
                  ?activated="${selected}"
                  aria-pressed="${pressed}"
                  @click="${this._selectMediaType}"
                  ?compatibility="${this.compatibility}"
                  title="Select ${item} media type"
                  >${item}</anypoint-button
                >`;
              })}
            </div>`
          : ''}

        <api-resource-example-document
          .amf="${this.amf}"
          .payloadId="${this.selectedBodyId}"
          .examples="${this._resolvedType}"
          .mediaType="${this.mediaType}"
          .typeName="${this.parentTypeName}"
          @has-examples-changed="${this._hasExamplesHandler}"
          ?noauto="${!!this.isScalar}"
          ?noactions="${this.noExamplesActions}"
          ?rawOnly="${!this.mediaType}"
          ?compatibility="${this.compatibility}"
          exportparts="${parts}"
          ?renderReadOnly="${this.renderReadOnly}"
        ></api-resource-example-document>
      </section>

      ${this.isObject ? this._objectTemplate() : ''}
      ${this.isArray ? this._arrayTemplate() : ''}
      ${this.isScalar
        ? html`<property-shape-document
            class="shape-document"
            .amf="${this.amf}"
            .shape="${this._resolvedType}"
            .parentTypeName="${this.parentTypeName}"
            ?narrow="${this.narrow}"
            ?noexamplesactions="${this.noExamplesActions}"
            ?compatibility="${this.compatibility}"
            .mediaType="${this.mediaType}"
            ?graph="${this.graph}"
          ></property-shape-document>`
        : ''}
      ${this.isUnion ? this._unionTemplate() : ''}
      ${this.isAnd ? this._anyTemplate() : ''}
      ${this.isAnyOf ? this._anyOfTemplate() : ''}
      ${this.isOneOf ? this._oneOfTemplate() : ''}`;
  }

  _filterReadOnlyItemsIfNecessary(resolvedType) {
    if (this.renderReadOnly) {
      return resolvedType;
    }
    const pKey = this._getAmfKey(this.ns.w3.shacl.property);
    const properties = resolvedType[pKey];
    return {
      ...resolvedType,
      [pKey]: this._filterReadOnlyProperties(properties),
    };
  }

  _filterReadOnlyProperties(properties) {
    if (this.renderReadOnly) {
      return properties;
    }
    if (!properties) {
      return undefined;
    }
    return properties.filter((p) => !this._isPropertyReadOnly(p));
  }
}
