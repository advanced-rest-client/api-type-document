import { LitElement, html } from 'lit-element';
import '@api-components/api-annotation-document/api-annotation-document.js';
import '@api-components/api-resource-example-document/api-resource-example-document.js';
import { PropertyDocumentMixin } from './PropertyDocumentMixin.js';
import rangeStyles from './RangeStyles.js';

/** @typedef {import('lit-element').TemplateResult} TemplateResult */

/* eslint-disable class-methods-use-this */

/**
 * Renders a documentation for a shape property of AMF model.
 */
export class PropertyRangeDocument extends PropertyDocumentMixin(LitElement) {
  get styles() {
    return rangeStyles;
  }

  static get properties() {
    return {
      /**
       * Name of the property that is being described by this definition.
       */
      propertyName: { type: String },
      /**
       * Computed value form the shape. True if the property is ENUM.
       */
      isEnum: { type: Boolean, reflect: true },
      /**
       * Computed value, true if current property is an union.
       */
      isUnion: { type: Boolean, reflect: true },
      /**
       * Computed value, true if current property is an object.
       */
      isObject: { type: Boolean, reflect: true },
      /**
       * Computed value, true if current property is an array.
       */
      isArray: { type: Boolean, reflect: true },
      /**
       * Computed value, true if current property is a File.
       */
      isFile: { type: Boolean },
      /**
       * Computed values for list of enums.
       * Enums are list of types names.
       */
      enumValues: { type: Array },
      /**
       * When set it removes actions bar from the examples render.
       */
      noExamplesActions: { type: Boolean },
      _hasExamples: { type: Boolean },
      exampleSectionTitle: { type: String },
    };
  }

  get range() {
    return this._range;
  }

  set range(value) {
    const old = this._range;
    if (old === value) {
      return;
    }
    this._range = value;
    this._rangeChanged(value);
    this.requestUpdate('range', old);
  }

  constructor() {
    super();
    this.propertyName = undefined;
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

  _rangeChanged(range) {
    this._hasExamples = false;
    this.isUnion = this._computeIsUnion(range);
    this.isObject = this._computeIsObject(range);
    this.isArray = this._computeIsArray(range);
    this.isEnum = this._computeIsEnum(range, this.isArray);
    this.isFile = this._computeIsFile(range);
    this.enumValues = this.isEnum
      ? this._computeEnumValues(range, this.isArray)
      : false;
  }

  /**
   * Computes value `isEnum` property.
   * @param {Object} range Current `range` object
   * @param {boolean} isArray Whether the `range` represent an array.
   * @return {boolean} True when the `range` represents an enum.
   */
  _computeIsEnum(range, isArray) {
    if (!range) {
      return false;
    }
    if (isArray) {
      return this._computeIsEnumArray(range);
    }

    const ikey = this._getAmfKey(this.ns.w3.shacl.in);
    return ikey in range;
  }

  /**
   * @param {Object} range Current `range` object
   * @return {boolean} True when the `range` represents an enum in array values.
   */
  _computeIsEnumArray(range) {
    const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
    const items = this._ensureArray(range[key]);
    if (!items) {
      return false;
    }
    const item = items[0];
    const ikey = this._getAmfKey(this.ns.w3.shacl.in);
    return ikey in item;
  }

  /**
   * Computes value for `isFile` property
   *
   * @param {Object} range Range object of current shape.
   * @return {Boolean}
   */
  _computeIsFile(range) {
    return this._hasType(range, this.ns.aml.vocabularies.shapes.FileShape);
  }

  _computeObjectProperties(range) {
    if (!range) {
      return undefined;
    }
    const pkey = this._getAmfKey(this.ns.w3.shacl.property);
    return range[pkey];
  }

  /**
   * Computes value for `enumValues` property.
   *
   * @param {Object} range Range object of current shape.
   * @param {Boolean} isArray Whether the range represents an array shape.
   * @return {Array<String>|undefined} List of enum types.
   */
  _computeEnumValues(range, isArray) {
    if (!range) {
      return undefined;
    }
    const itemsKey = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
    const ikey = this._getAmfKey(this.ns.w3.shacl.in);

    let model = range[isArray ? itemsKey : ikey];
    if (!model) {
      return undefined;
    }
    model = this._ensureArray(model);
    if (Array.isArray(model)) {
      [model] = model;
    }
    if (isArray) {
      model = model[ikey];
    }
    const results = [];
    Object.keys(model).forEach((key) => {
      const amfKey = this._getAmfKey(this.ns.w3.rdfSchema.key);
      if (key.indexOf(amfKey) !== 0) {
        return;
      }
      let value = model[key];
      if (value instanceof Array) {
        [value] = value;
      }
      let result = this._getValue(value, this.ns.aml.vocabularies.data.value);
      if (result) {
        if (result['@value']) {
          result = result['@value'];
        }
        results.push(result);
      }
    });
    return results;
  }

  _examplesChanged(e) {
    const { value } = e.detail;
    this.exampleSectionTitle =
      value && value.length === 1 ? 'Example' : 'Examples';
  }

  _hasExamplesHandler(e) {
    this._hasExamples = e.detail.value;
  }

  _listItemTemplate(label, title, key, isArray) {
    let value = isArray
      ? this._getValueArray(this.range, key)
      : this._getValue(this.range, key);
    if (isArray && value instanceof Array) {
      value = value.join(', ');
    }
    return html`<div class="property-attribute" part="property-attribute">
      <span class="attribute-label" part="attribute-label">${label}:</span>
      <span class="attribute-value" part="attribute-value" title="${title}"
        >${value}</span
      >
    </div>`;
  }

  _nonFilePropertisTemplate() {
    const { range } = this;

    return html` ${this._hasProperty(range, this.ns.w3.shacl.minLength)
      ? this._listItemTemplate(
          'Minimum characters',
          'Minimum number of characters in the value',
          this.ns.w3.shacl.minLength
        )
      : ''}
    ${this._hasProperty(range, this.ns.w3.shacl.maxLength)
      ? this._listItemTemplate(
          'Maximum characters',
          'Maximum number of characters in the value',
          this.ns.w3.shacl.maxLength
        )
      : ''}`;
  }

  _filePropertisTemplate() {
    const { range } = this;
    return html` <section class="file-properties">
      ${this._hasProperty(range, this.ns.w3.shacl.fileType)
        ? this._listItemTemplate(
            'File types',
            'File mime types accepted by the endpoint',
            this.ns.w3.shacl.fileType,
            true
          )
        : ''}
      ${this._hasProperty(range, this.ns.aml.vocabularies.shapes.fileType)
        ? this._listItemTemplate(
            'File types',
            'File mime types accepted by the endpoint',
            this.ns.aml.vocabularies.shapes.fileType,
            true
          )
        : ''}
      ${this._hasProperty(range, this.ns.w3.shacl.minLength)
        ? this._listItemTemplate(
            'File minimum size',
            'Minimum size of the file accepted by this endpoint',
            this.ns.w3.shacl.minLength
          )
        : ''}
      ${this._hasProperty(range, this.ns.w3.shacl.maxLength)
        ? this._listItemTemplate(
            'File maximum size',
            'Maximum size of the file accepted by this endpoint',
            this.ns.w3.shacl.maxLength
          )
        : ''}
    </section>`;
  }

  /**
   * @return {TemplateResult|string} Template for enum values.
   */
  _enumTemplate() {
    const items = /** @type string[] */ (this.enumValues);
    if (!items || !items.length) {
      return '';
    }
    return html`<div
      class="property-attribute enum-values"
      part="property-attribute"
    >
      <span class="attribute-label" part="attribute-label">Enum values:</span>
      <span
        class="attribute-value"
        part="attribute-value"
        title="List of possible values to use with this property"
      >
        <ul>
          ${items.map((item) => html`<li>${item}</li>`)}
        </ul>
      </span>
    </div>`;
  }

  /**
   * @return {TemplateResult|string} Template for the element.
   */
  render() {
    const { range } = this;
    return html`<style>
        ${this.styles}
      </style>
      <api-annotation-document
        ?compatibility="${this.compatibility}"
        .amf="${this.amf}"
        .shape="${range}"
      ></api-annotation-document>
      ${this._hasProperty(range, this.ns.w3.shacl.defaultValueStr)
        ? this._listItemTemplate(
            'Default value',
            'This value is used as a default value',
            this.ns.w3.shacl.defaultValueStr
          )
        : ''}
      ${this._hasProperty(range, this.ns.w3.shacl.pattern)
        ? this._listItemTemplate(
            'Pattern',
            'Regular expression value for this property',
            this.ns.w3.shacl.pattern
          )
        : ''}
      ${this._hasProperty(range, this.ns.w3.shacl.minInclusive)
        ? this._listItemTemplate(
            'Min value',
            'Minimum numeric value possible to set on this property',
            this.ns.w3.shacl.minInclusive
          )
        : ''}
      ${this._hasProperty(range, this.ns.w3.shacl.maxInclusive)
        ? this._listItemTemplate(
            'Max value',
            'Maximum numeric value possible to set on this property',
            this.ns.w3.shacl.maxInclusive
          )
        : ''}
      ${this._hasProperty(range, this.ns.w3.shacl.multipleOf)
        ? this._listItemTemplate(
            'Multiple of',
            'The numeric value has to be multiplicable by this value',
            this.ns.w3.shacl.multipleOf
          )
        : ''}
      ${this.isFile
        ? this._filePropertisTemplate()
        : this._nonFilePropertisTemplate()}
      ${this.isEnum ? this._enumTemplate() : ''}

      <section class="examples" ?hidden="${!this._hasExamples}">
        <api-resource-example-document
          .amf="${this.amf}"
          .examples="${range}"
          .mediaType="${this.mediaType}"
          .typeName="${this.propertyName}"
          noauto
          ?compatibility="${this.compatibility}"
          ?noactions="${this.noExamplesActions}"
          ?rawonly="${!this._hasMediaType}"
          ?graph="${this.graph}"
          @rendered-examples-changed="${this._examplesChanged}"
          @has-examples-changed="${this._hasExamplesHandler}"
        ></api-resource-example-document>
      </section>`;
  }
}
