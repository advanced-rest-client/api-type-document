import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {AmfHelperMixin} from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@api-components/raml-aware/raml-aware.js';
import '@polymer/paper-button/paper-button.js';
import './property-shape-document.js';
import {PropertyDocumentMixin} from './property-document-mixin.js';
/**
 * `api-type-document`
 *
 * An element that recuresively renders a documentation for a data type
 * using from model.
 *
 * Pass AMF's shape type `property` array to render the documentation.
 *
 * ## Styling
 *
 * `<api-type-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-type-document` | Mixin applied to this elment | `{}`
 * `--api-type-document-union-button-background-color` | Background color of union selector button | `#fff`
 * `--api-type-document-union-button-color` | Color of union selector button | `#000`
 * `--api-type-document-union-button-active-background-color` | Background color of active union selector button | `#CDDC39`
 * `--api-type-document-union-button-active-color` | Color of active union selector button | `#000`
 *
 * From `property-shape-document`
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--property-shape-document` | Mixin applied each proeprty element | `{}`
 * `--property-shape-document-array-color` | Property border color when type is an array | `#8BC34A`
 * `--property-shape-document-object-color` | Property border color when type is an object | `#FF9800`
 * `--property-shape-document-union-color` | Property border color when type is an union | `#FFEB3B`
 * `--arc-font-subhead` | Theme mixin, applied to the property title | `{}`
 * `--property-shape-document-title` | Mixin applied to the property title | `{}`
 * `--api-type-document-property-parent-color` | Color of the parent property label | `#757575`
 * `--api-type-document-property-color` | Color of the property name label when display name is used | `#757575`
 * `--api-type-document-child-docs-margin-left` | Margin left of the item's properties description relative to the title when the item is a child property of another property | `24px`
 * `--api-type-document-type-color` | Color of the "type" trait | `white`
 * `--api-type-document-type-background-color` | Background color of the "type" trait | `#2196F3`
 * `--api-type-document-trait-background-color` | Background color to main range trait (type, required, enum) | `#EEEEEE`,
 * `--api-type-document-trait-border-radius` | Border radious of a main property traits like type, required, enum | `3px`
 *
 * From `property-range-document`
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
class ApiTypeDocument extends
  AmfHelperMixin(PropertyDocumentMixin(PolymerElement)) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --arc-font-body1;
      @apply --api-type-document;
    }

    .union-toggle {
      outline: none;
      background-color: var(--api-type-document-union-button-background-color, #fff);
      color: var(--api-type-document-union-button-color, #000);
    }

    .union-toggle[active] {
      background-color: var(--api-type-document-union-button-active-background-color, #CDDC39);
      color: var(--api-type-document-union-button-active-color, #000);
    }

    .union-type-selector {
      margin: 12px 0;
    }

    property-shape-document {
      padding: 12px 0;
    }

    property-shape-document:last-of-type,
    :last-of-type {
      border-bottom: none;
    }

    .array-children {
      box-sizing: border-box;
      padding-left: 12px;
      border-left: 2px var(--property-shape-document-array-color, #8BC34A) solid;
    }

    :host([has-parent-type]) .array-children {
      padding-left: 0px;
      border-left: none;
    }

    .inheritance-label {
      font-size: var(--api-type-document-inheritance-label-font-size, 16px);
    }
    </style>
    <template is="dom-if" if="[[aware]]">
      <raml-aware raml="{{amfModel}}" scope="[[aware]]"></raml-aware>
    </template>
    <section class="examples" hidden\$="[[!_renderMainExample]]">
      <h5 class="examples-section-title">Examples</h5>
      <api-resource-example-document amf-model="[[amfModel]]" examples="[[_resolvedType]]" media-type="[[mediaType]]" type-name="[[parentTypeName]]" has-examples="{{_hasExamples}}" no-auto="" no-actions="[[noExamplesActions]]" raw-only="[[!_hasMediaType]]"></api-resource-example-document>
    </section>
    <template is="dom-if" if="[[isObject]]" restamp="">
      <template is="dom-repeat" data-object-repeater="" items="[[_computeProperties(_resolvedType)]]">
        <property-shape-document class="object-document" shape="[[_resolve(item)]]" amf-model="[[amfModel]]" parent-type-name="[[parentTypeName]]" narrow="[[narrow]]" no-examples-actions="[[noExamplesActions]]" media-type="[[mediaType]]"></property-shape-document>
      </template>
    </template>
    <template is="dom-if" if="[[isArray]]" restamp="">
      <template is="dom-if" if="[[!hasParentType]]">
        <property-shape-document class="array-document" amf-model="[[amfModel]]" shape="[[_resolve(_resolvedType)]]" parent-type-name="Array test" narrow="[[narrow]]" no-examples-actions="[[noExamplesActions]]" media-type="[[mediaType]]"></property-shape-document>
      </template>
      <div class="array-children">
        <template is="dom-repeat" data-array-repeater="" items="[[_computeArrayProperties(_resolvedType)]]">
          <template is="dom-if" if="[[item.isShape]]" restamp="true">
            <property-shape-document class="array-document" amf-model="[[amfModel]]" shape="[[_resolve(item)]]" parent-type-name="[[_computeArrayParentName(parentTypeName, item)]]" narrow="[[narrow]]" no-examples-actions="[[noExamplesActions]]" media-type="[[mediaType]]"></property-shape-document>
          </template>
          <template is="dom-if" if="[[item.isType]]" restamp="true">
            <api-type-document class="union-document" amf-model="[[amfModel]]" parent-type-name="[[parentTypeName]]" type="[[item]]" narrow="[[narrow]]" no-examples-actions="[[noExamplesActions]]" no-main-example="[[_renderMainExample]]" media-type="[[mediaType]]"></api-type-document>
          </template>
        </template>
      </div>
    </template>
    <template is="dom-if" if="[[isScalar]]" restamp="">
      <property-shape-document class="shape-document" amf-model="[[amfModel]]" shape="[[_resolvedType]]" parent-type-name="[[parentTypeName]]" narrow="[[narrow]]" no-examples-actions="[[noExamplesActions]]" media-type="[[mediaType]]"></property-shape-document>
    </template>
    <template is="dom-if" if="[[isUnion]]">
      <div class="union-type-selector">
        <span>Any of:</span>
        <template is="dom-repeat" data-union-repeater="" items="[[unionTypes]]">
          <paper-button class="union-toggle" active="[[_unionTypeActive(selectedUnion, index)]]" on-click="_selectUnion" title\$="Select [[item.label]] type">[[item.label]]</paper-button>
        </template>
      </div>
      <api-type-document class="union-document" amf-model="[[amfModel]]" parent-type-name="[[parentTypeName]]" type="[[_computeUnionProperty(_resolvedType, selectedUnion)]]" narrow="[[narrow]]" no-examples-actions="[[noExamplesActions]]" no-main-example="[[_renderMainExample]]" media-type="[[mediaType]]"></api-type-document>
    </template>

    <template is="dom-if" if="[[isAnd]]">
      <template is="dom-repeat" items="[[andTypes]]">
        <template is="dom-if" if="[[item.label]]">
          <p class="inheritance-label">Properties inherited from <b>[[item.label]]</b>.</p>
        </template>
        <template is="dom-if" if="[[!item.label]]">
          <p class="inheritance-label">Properties defined inline.</p>
        </template>
        <api-type-document class="and-document" amf-model="[[amfModel]]" type="[[item.type]]" narrow="[[narrow]]" no-examples-actions="[[noExamplesActions]]" no-main-example="[[_renderMainExample]]" media-type="[[mediaType]]"></api-type-document>
      </template>
    </template>
`;
  }

  static get is() {
    return 'api-type-document';
  }
  static get properties() {
    return {
      /**
       * `raml-aware` scope property to use.
       */
      aware: String,
      /**
       * Generated AMF json/ld model form the API spec.
       * The element assumes the object of the first array item to be a
       * type of `"http://raml.org/vocabularies/document#Document`
       * on AMF vocabulary.
       *
       * It is only usefult for the element to resolve references.
       *
       * @type {Object|Array}
       */
      amfModel: Object,
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
       * @type {Object|Array}
       */
      type: Object,
      /**
       * Media type to use to render examples.
       * If not set a "raw" version of the example from API spec file is used.
       */
      mediaType: String,
      // The type after it has been resolved.
      _resolvedType: {
        type: Object,
        computed: '_resolve(type)'
      },
      /**
       * Should be set if described properties has a parent type.
       * This is used when recursively iterating over properties.
       */
      parentTypeName: String,
      /**
       * Computed value, true if the shape has parent type.
       */
      hasParentType: {
        type: Boolean,
        value: false,
        computed: '_computeHasStringValue(parentTypeName)',
        reflectToAttribute: true
      },
      /**
       * True if given `type` is a scalar property
       */
      isScalar: {
        type: Boolean,
        readOnly: true
      },
      /**
       * True if given `type` is an array property
       */
      isArray: {
        type: Boolean,
        readOnly: true
      },
      /**
       * True if given `type` is an object property
       */
      isObject: {
        type: Boolean,
        readOnly: true
      },
      /**
       * True if given `type` is an union property
       */
      isUnion: {
        type: Boolean,
        readOnly: true
      },
      /**
       * True if given `type` is OAS "and" type.
       */
      isAnd: {
        type: Boolean,
        readOnly: true
      },
      /**
       * Computed list of union type types to render in union type
       * selector.
       * Each item has `label` and `isScalar` property.
       *
       * @type {Array<Object>}
       */
      unionTypes: {
        type: Array,
        observer: '_unionTypesChanged'
      },
      /**
       * List of types definition and name for OAS' "and" type
       */
      andTypes: {
        type: Array
      },
      /**
       * Selected index of union type in `unionTypes` array.
       */
      selectedUnion: {
        type: Number
      },
      /**
       * A property to set when the component is rendered in the narrow
       * view. To be used with mobile rendering or when the
       * components occupies only small part of the screen.
       */
      narrow: Boolean,
      /**
       * When set an example in this `type` object won't be rendered even if set.
       */
      noMainExample: Boolean,

      _hasExamples: Boolean,
      _renderMainExample: {
        type: Boolean,
        computed: '_computeRenderMainExample(noMainExample, _hasExamples)'
      }
    };
  }

  static get observers() {
    return [
      '__typeChanged(_resolvedType, amfModel)'
    ];
  }

  _computeRenderMainExample(noMainExample, hasExamples) {
    return !!(!noMainExample && hasExamples);
  }
  /**
   * Called when resolved type or amfModel changed.
   * Creates a debouncer to compute UI values so it's independent of
   * order of assigning properties.
   */
  __typeChanged() {
    if (this.__typeChangeDebouncer) {
      return;
    }
    this.__typeChangeDebouncer = true;
    afterNextRender(this, () => {
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
    if (type instanceof Array) {
      isObject = true;
    } else if (this._hasType(type, this.ns.raml.vocabularies.shapes + 'ScalarShape') ||
      this._hasType(type, this.ns.raml.vocabularies.shapes + 'NilShape')) {
      isScalar = true;
    } else if (this._hasType(type, this.ns.raml.vocabularies.shapes + 'UnionShape')) {
      isUnion = true;
      this.unionTypes = this._computeUnionTypes(true, type);
    } else if (this._hasType(type, this.ns.raml.vocabularies.shapes + 'ArrayShape')) {
      isArray = true;
    } else if (this._hasType(type, this.ns.w3.shacl.name + 'NodeShape')) {
      isObject = true;
    } else if (this._hasType(type, this.ns.raml.vocabularies.shapes + 'AnyShape')) {
      const key = this._getAmfKey(this.ns.w3.shacl.name + 'and');
      if (key in type) {
        isAnd = true;
        this.andTypes = this._computeAndTypes(type[key]);
      } else {
        isScalar = true;
      }
    }
    this._setIsScalar(isScalar);
    this._setIsArray(isArray);
    this._setIsObject(isObject);
    this._setIsUnion(isUnion);
    this._setIsAnd(isAnd);
  }
  /**
   * Computes parent name for the array type table.
   *
   * @param {?String} parent `parentTypeName` if available
   * @return {String} Parent type name of refault value for array type.
   */
  _computeArrayParentName(parent) {
    return parent || '';
  }
  /**
   * Resets union selection when union types list changes.
   *
   * @param {?Array} types List of current union types.
   */
  _unionTypesChanged(types) {
    if (!types) {
      return;
    }
    this.selectedUnion = 0;
  }
  /**
   * Handler for union type button click.
   * Sets `selectedUnion` property.
   *
   * @param {ClickEvent} e
   */
  _selectUnion(e) {
    const index = e.model.get('index');
    if (this.selectedUnion === index) {
      e.target.active = true;
    } else {
      this.selectedUnion = index;
    }
  }
  /**
   * Computes if selectedUnion equals current item index.
   *
   * @param {Number} selectedUnion
   * @param {Number} index
   * @return {Boolean}
   */
  _unionTypeActive(selectedUnion, index) {
    return selectedUnion === index;
  }
  /**
   * Computes properties for union type.
   *
   * @param {Object} type Current `type` value.
   * @param {Number} selected Selected union index from `unionTypes` array
   * @return {Array<Object>|undefined} Properties for union type.
   */
  _computeUnionProperty(type, selected) {
    if (!type) {
      return;
    }
    const key = this._getAmfKey(this.ns.raml.vocabularies.shapes + 'anyOf');
    const data = type[key];
    if (!data) {
      return;
    }
    let item = data[selected];
    if (!item) {
      return;
    }
    if (item instanceof Array) {
      item = item[0];
    }
    if (this._hasType(item, this.ns.raml.vocabularies.shapes + 'ArrayShape')) {
      item = this._resolve(item);
      const key = this._getAmfKey(this.ns.raml.vocabularies.shapes + 'items');
      const items = this._ensureArray(item[key]);
      if (items && items.length === 1) {
        let result = items[0];
        if (result instanceof Array) {
          result = result[0];
        }
        result = this._resolve(result);
        return result;
      }
    }
    if (item instanceof Array) {
      item = item[0];
    }
    return this._resolve(item);
  }
  /**
   * Helper function for the view. Extracts `http://www.w3.org/ns/shacl#property`
   * from the shape model
   *
   * @param {Object} item Range object
   * @return {Array<Object>} Shape object
   */
  _computeProperties(item) {
    if (!item) {
      return;
    }
    if (item instanceof Array) {
      return item;
    }
    const key = this._getAmfKey(this.ns.w3.shacl.name + 'property');
    return this._ensureArray(item[key]);
  }
  /**
   * Computes list values for `andTypes` property.
   * @param {Array<Object>} items List of OAS' "and" properties
   * @return {Array<Object>} An array of type definitions and label to render
   */
  _computeAndTypes(items) {
    if (!items || !items.length) {
      return;
    }
    return items.map((item) => {
      if (item instanceof Array) {
        item = item[0];
      }
      item = this._resolve(item);
      let label = this._getValue(item, this.ns.schema.schemaName);
      if (!label) {
        label = this._getValue(item, this.ns.w3.shacl.name + 'name');
      }
      if (label && label.indexOf('item') === 0) {
        label = undefined;
      }
      return {
        label,
        type: item
      };
    });
  }
}
window.customElements.define(ApiTypeDocument.is, ApiTypeDocument);