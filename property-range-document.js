import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {AmfHelperMixin} from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@advanced-rest-client/markdown-styles/markdown-styles.js';
import '@polymer/marked-element/marked-element.js';
import '@api-components/api-annotation-document/api-annotation-document.js';
import '@api-components/api-resource-example-document/api-resource-example-document.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {PropertyDocumentMixin} from './property-document-mixin.js';
import './api-type-document.js';
/**
 * `property-range-document`
 *
 * Renders a documentation for a shape property of AMF model.
 *
 * ## Styling
 *
 * `<property-range-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--property-range-document` | Mixin applied to this elment | `{}`
 * `--api-type-document-type-attribute-color` | Color of each attribute that describes a property | `#616161`
 * `--api-type-document-examples-title-color` | Color of examples section title | ``
 * `--api-type-document-examples-border-color` | Example section border color | `transparent`
 * `--code-background-color` | Background color of the examples section | ``
 * `--arc-font-body1` | Mixin applied to an example name label | `{}`
 * `--arc-font-body2` | Mixin applied to the examples section title | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin PropertyDocumentMixin
 * @appliesMixin AmfHelperMixin
 */
class PropertyRangeDocument extends AmfHelperMixin(PropertyDocumentMixin(PolymerElement)) {
  static get template() {
    return html`
    <style include="markdown-styles"></style>
    <style>
    :host {
      display: block;
      @apply --property-range-document;
    }

    [hidden] {
      display: none !important;
    }

    .property-attribute {
      @apply --layout-horizontal;
      @apply --layout-start;
      margin: 0;
      padding: 0;
      color: var(--api-type-document-type-attribute-color, #616161);
    }

    .property-attribute:last-of-type {
      margin-bottom: 12px;
    }

    .attribute-label {
      font-weight: 500;
      margin-right: 12px;
    }

    .attribute-value {
      @apply --layout-flex;
    }

    .attribute-value ul {
      margin: 0;
      padding-left: 18px;
    }

    .examples {
      border: 1px var(--api-type-document-examples-border-color, transparent) solid;
      background-color: var(--code-background-color);
    }

    api-annotation-document {
      margin-bottom: 12px;
    }

    .examples-section-title {
      @apply --arc-font-body2;
      padding: 8px;
      margin: 0;
      color: var(--api-type-document-examples-title-color);
    }

    .example-title {
      @apply --arc-font-body1;
      font-size: 15px;
      margin: 0;
      padding: 0 8px;
    }
    </style>
    <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.defaultValueStr)]]">
      <div class="property-attribute">
        <span class="attribute-label">Default value:</span>
        <span class="attribute-value" title="This value is used as a default value">[[_getValue(range, ns.w3.shacl.defaultValueStr)]]</span>
      </div>
    </template>
    <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.pattern)]]">
      <div class="property-attribute">
        <span class="attribute-label">Pattern:</span>
        <span class="attribute-value" title="Regular expression value for this property">[[_getValue(range, ns.w3.shacl.pattern)]]</span>
      </div>
    </template>
    <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.minInclusive)]]">
      <div class="property-attribute">
        <span class="attribute-label">Min value:</span>
        <span class="attribute-value" title="Minimum numeric value possible to set on this property">[[_getValue(range, ns.w3.shacl.minInclusive)]]</span>
      </div>
    </template>
    <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.maxInclusive)]]">
      <div class="property-attribute">
        <span class="attribute-label">Max value:</span>
        <span class="attribute-value" title="Maximum numeric value possible to set on this property">[[_getValue(range, ns.w3.shacl.maxInclusive)]]</span>
      </div>
    </template>
    <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.multipleOf)]]">
      <div class="property-attribute">
        <span class="attribute-label">Multiple of:</span>
        <span class="attribute-value" title="The numeric value has to be multiplicable by this value">[[_getValue(range, ns.w3.shacl.multipleOf)]]</span>
      </div>
    </template>
    <template is="dom-if" if="[[!isFile]]">
      <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.minLength)]]">
        <div class="property-attribute">
          <span class="attribute-label">Minimum characters:</span>
          <span class="attribute-value" title="Minimum number of characters in the value">[[_getValue(range, ns.w3.shacl.minLength)]]</span>
        </div>
      </template>
      <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.maxLength)]]">
        <div class="property-attribute">
          <span class="attribute-label">Maximum characters:</span>
          <span class="attribute-value" title="Maximum number of characters in the value">[[_getValue(range, ns.w3.shacl.maxLength)]]</span>
        </div>
      </template>
    </template>
    <template is="dom-if" if="[[isFile]]">
      <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.fileType)]]">
        <div class="property-attribute">
          <span class="attribute-label">File types:</span>
          <span class="attribute-value" title="File mime types accepted by the endpoint">[[_getValueArray(range, ns.w3.shacl.fileType)]]</span>
        </div>
      </template>
      <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.minLength)]]">
        <div class="property-attribute">
          <span class="attribute-label">File minimum size:</span>
          <span class="attribute-value" title="Minimum size of the file accepted by this endpoint">[[_getValue(range, ns.w3.shacl.minLength)]]</span>
        </div>
      </template>
      <template is="dom-if" if="[[_hasProperty(range, ns.w3.shacl.maxLength)]]">
        <div class="property-attribute">
          <span class="attribute-label">File maximum size:</span>
          <span class="attribute-value" title="Maximum size of the file accepted by this endpoint">[[_getValue(range, ns.w3.shacl.maxLength)]]</span>
        </div>
      </template>
    </template>
    <template is="dom-if" if="[[isEnum]]">
      <div class="property-attribute">
        <span class="attribute-label">Enum values:</span>
        <span class="attribute-value" title="List of possible values to use with this property">
          <ul>
            <template is="dom-repeat" items="[[enumValues]]">
              <li>[[item]]</li>
            </template>
          </ul>
        </span>
      </div>
    </template>
    <api-annotation-document amf-model="[[amfModel]]" shape="[[range]]"></api-annotation-document>
    <section class="examples" hidden\$="[[!_hasExamples]]">
      <h5 class="examples-section-title">[[_computeExamplesLabel(examples)]]</h5>
      <api-resource-example-document amf-model="[[amfModel]]" examples="[[range]]" rendered-examples="{{examples}}" media-type="[[mediaType]]" type-name="[[propertyName]]" has-examples="{{_hasExamples}}" no-auto="" no-actions="[[noExamplesActions]]" raw-only="[[!_hasMediaType]]"></api-resource-example-document>
    </section>
`;
  }

  static get is() {
    return 'property-range-document';
  }
  static get properties() {
    return {
      /**
       * Name of the property that is being described by this definition.
       */
      propertyName: String,
      /**
       * Computed value form the shape. True if the property is ENUM.
       */
      isEnum: {
        type: Boolean,
        computed: '_computeIsEnum(range)'
      },
      /**
       * Computed value, true if current property is an union.
       */
      isUnion: {
        type: Boolean,
        computed: '_computeIsUnion(range)',
        reflectToAttribute: true
      },
      /**
       * Computed value, true if current property is an object.
       */
      isObject: {
        type: Boolean,
        computed: '_computeIsObject(range)',
        reflectToAttribute: true
      },
      /**
       * Computed value, true if current property is an array.
       */
      isArray: {
        type: Boolean,
        computed: '_computeIsArray(range)',
        reflectToAttribute: true
      },
      /**
       * Computed value, true if current property is a File.
       */
      isFile: {
        type: Boolean,
        computed: '_computeIsFile(range)',
        value: false
      },
      /**
       * Computed values for list of enums.
       * Enums are list of types names.
       *
       * @type {Array<String>}
       */
      enumValues: {
        type: Array,
        computed: '_computeEnumValues(isEnum, range)'
      },
      /**
       * When set it removes actions bar from the examples render.
       */
      noExamplesActions: Boolean,
      _hasExamples: {type: Boolean, value: false}
    };
  }

  static get observers() {
    return [
      '_rangeChanged(range)'
    ];
  }

  _rangeChanged() {
    this._hasExamples = false;
  }
  /**
   * Computes value `isEnum` property.
   * @param {Object} range Current `range` object.
   * @return {Boolean} Curently it always returns `false`
   */
  _computeIsEnum(range) {
    const key = this._getAmfKey(this.ns.w3.shacl.name + 'in');
    return !!(range && (key in range));
  }
  /**
   * Computes value for `isUnion` property.
   * Union type is identified as a `http://raml.org/vocabularies/shapes#UnionShape`
   * type.
   *
   * @param {Object} range Range object of current shape.
   * @return {Boolean}
   */
  _computeIsUnion(range) {
    return this._hasType(range, this.ns.raml.vocabularies.shapes + 'UnionShape');
  }
  /**
   * Computes value for `isObject` property.
   * Object type is identified as a `http://raml.org/vocabularies/shapes#NodeShape`
   * type.
   *
   * @param {Object} range Range object of current shape.
   * @return {Boolean}
   */
  _computeIsObject(range) {
    return this._hasType(range, this.ns.w3.shacl.name + 'NodeShape');
  }

  /**
   * Computes value for `isArray` property.
   * Array type is identified as a `http://raml.org/vocabularies/shapes#ArrayShape`
   * type.
   *
   * @param {Object} range Range object of current shape.
   * @return {Boolean}
   */
  _computeIsArray(range) {
    return this._hasType(range, this.ns.raml.vocabularies.shapes + 'ArrayShape');
  }
  /**
   * Computes value for `isFile` property
   *
   * @param {Object} range Range object of current shape.
   * @return {Boolean}
   */
  _computeIsFile(range) {
    return this._hasType(range, this.ns.raml.vocabularies.shapes + 'FileShape');
  }

  _computeObjectProperties(range) {
    if (!range) {
      return;
    }
    const pkey = this._getAmfKey(this.ns.w3.shacl.name + 'property');
    return range[pkey];
  }
  /**
   * Computes value for `enumValues` property.
   *
   * @param {Boolean} isEnum Current value of `isEnum` property
   * @param {Object} range Range object of current shape.
   * @return {Array<String>|undefined} List of enum types.
   */
  _computeEnumValues(isEnum, range) {
    if (!isEnum || !range) {
      return;
    }
    const ikey = this._getAmfKey(this.ns.w3.shacl.name + 'in');
    let model = range[ikey];
    if (!model) {
      return;
    }
    model = this._ensureArray(model);
    if (!model) {
      return;
    }
    if (model instanceof Array) {
      model = model[0];
    }
    const results = [];
    Object.keys(model).forEach((key) => {
      const amfKey = this._getAmfKey('http://www.w3.org/2000/01/rdf-schema#');
      if (key.indexOf(amfKey) !== 0) {
        return;
      }
      let value = model[key];
      if (value instanceof Array) {
        value = value[0];
      }
      let result = this._getValue(value, this.ns.raml.vocabularies.data + 'value');
      if (result) {
        if (result['@value']) {
          result = result['@value'];
        }
        results.push(result);
      }
    });
    return results;
  }
  /**
   * Computes label for examples section title.
   * @param {Array} examples List of examples
   * @return {String} Correct form for examples
   */
  _computeExamplesLabel(examples) {
    return examples && examples.length === 1 ? 'Example' : 'Examples';
  }
}
window.customElements.define(PropertyRangeDocument.is, PropertyRangeDocument);