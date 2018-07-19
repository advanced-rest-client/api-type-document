/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-type-document.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-if.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-repeat.d.ts" />
/// <reference path="../raml-aware/raml-aware.d.ts" />
/// <reference path="../paper-button/paper-button.d.ts" />
/// <reference path="../amf-helper-mixin/amf-helper-mixin.d.ts" />
/// <reference path="property-shape-document.d.ts" />
/// <reference path="property-document-mixin.d.ts" />

declare namespace ApiElements {

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
   */
  class ApiTypeDocument extends
    ArcBehaviors.PropertyDocumentMixin(
    ApiElements.AmfHelperMixin(
    Polymer.Element)) {

    /**
     * Generated AMF json/ld model form the API spec.
     * The element assumes the object of the first array item to be a
     * type of `"http://raml.org/vocabularies/document#Document`
     * on AMF vocabulary.
     *
     * It is only usefult for the element to resolve references.
     */
    amfModel: object|any[]|null;

    /**
     * `raml-aware` scope property to use.
     */
    aware: string|null|undefined;

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
    type: object|any[]|null;

    /**
     * The type after it has been resolved.
     */
    readonly _resolvedType: object|null|undefined;

    /**
     * Should be set if described properties has a parent type.
     * This is used when recursively iterating over properties.
     */
    parentTypeName: string|null|undefined;

    /**
     * True if given `type` is a scalar property
     */
    readonly isScalar: boolean|null|undefined;

    /**
     * True if given `type` is an array property
     */
    readonly isArray: boolean|null|undefined;

    /**
     * True if given `type` is an object property
     */
    readonly isObject: boolean|null|undefined;

    /**
     * True if given `type` is an union property
     */
    readonly isUnion: boolean|null|undefined;

    /**
     * Computed list of union type types to render in union type
     * selector.
     * Each item has `label` and `isScalar` property.
     */
    unionTypes: Array<object|null>|null;

    /**
     * Selected index of union type in `unionTypes` array.
     */
    selectedUnion: number|null|undefined;

    /**
     * A property to set when the component is rendered in the narrow
     * view. To be used with mobile rendering or when the
     * components occupies only small part of the screen.
     */
    narrow: boolean|null|undefined;

    /**
     * Handles type change. Sets basic view control properties.
     *
     * @param type Passed type/
     */
    _typeChanged(type: any[]|object|null): void;

    /**
     * Computes parent name for the array type table.
     *
     * @param parent `parentTypeName` if available
     * @returns Parent type name of refault value for array type.
     */
    _computeArrayParentName(parent: String|null): String|null;

    /**
     * Resets union selection when union types list changes.
     *
     * @param types List of current union types.
     */
    _unionTypesChanged(types: any[]|null): void;

    /**
     * Handler for union type button click.
     * Sets `selectedUnion` property.
     */
    _selectUnion(e: ClickEvent|null): void;

    /**
     * Computes if selectedUnion equals current item index.
     */
    _unionTypeActive(selectedUnion: Number|null, index: Number|null): Boolean|null;

    /**
     * Computes properties for union type.
     *
     * @param type Current `type` value.
     * @param selected Selected union index from `unionTypes` array
     * @returns Properties for union type.
     */
    _computeUnionProperty(type: object|null, selected: Number|null): Array<object|null>|null|undefined;
  }
}

interface HTMLElementTagNameMap {
  "api-type-document": ApiElements.ApiTypeDocument;
}
