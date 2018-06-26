/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   property-shape-document.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-if.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-repeat.d.ts" />
/// <reference path="../iron-flex-layout/iron-flex-layout.d.ts" />
/// <reference path="../markdown-styles/markdown-styles.d.ts" />
/// <reference path="../marked-element/marked-element.d.ts" />
/// <reference path="../amf-helper-mixin/amf-helper-mixin.d.ts" />
/// <reference path="api-type-document.d.ts" />
/// <reference path="property-range-document.d.ts" />
/// <reference path="property-document-mixin.d.ts" />

declare namespace ApiElements {

  /**
   * `property-shape-document`
   *
   * Renders a documentation for a shape property of AMF model.
   *
   * ## Styling
   *
   * `<property-shape-document>` provides the following custom properties and mixins for styling:
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--property-shape-document` | Mixin applied to this elment | `{}`
   * `--property-shape-document-array-color` | Property border color when type is an array | `#8BC34A`
   * `--property-shape-document-object-color` | Property border color when type is an object | `#FF9800`
   * `--property-shape-document-union-color` | Property border color when type is an union | `#FFEB3B`
   * `--arc-font-subhead` | Theme mixin, applied to the property title | `{}`
   * `--property-shape-document-title` | Mixin applied to the property title | `{}`
   * `--api-type-document-property-parent-color` | Color of the parent property label | `#757575`
   * `--api-type-document-property-color` | Color of the property name label when display name is used | `#757575`
   * `--api-type-document-docs-margin-left` | Margin left of the item's properties description relative to the title. | `12px`
   * `--api-type-document-child-docs-margin-left` | Margin left of the item's properties description relative to the title when the item is a child property of another property | `24px`
   * `--api-type-document-type-color` | Color of the "type" trait | `white`
   * `--api-type-document-type-background-color` | Background color of the "type" trait | `#2196F3`
   * `--api-type-document-trait-background-color` | Background color to main range trait (type, required, enum) | `#EEEEEE`,
   * `--api-type-document-trait-border-radius` | Border radious of a main property traits like type, required, enum | `3px`
   */
  class PropertyShapeDocument extends
    ArcBehaviors.PropertyDocumentMixin(
    ApiElements.AmfHelperMixin(
    Polymer.Element)) {

    /**
     * Computed value of shape's http://raml.org/vocabularies/shapes#range
     */
    readonly range: object|null;

    /**
     * Computed value of "display name" of the property
     */
    readonly displayName: string|null|undefined;

    /**
     * A type property name.
     * This may be different from `displayName` property if
     * `displayName` was specified in the API spec for this property.
     */
    readonly propertyName: string|null|undefined;

    /**
     * Computed value, true if `displayName` has been defined for this
     * property.
     */
    readonly hasDisplayName: boolean|null|undefined;

    /**
     * Computed value, true if current property is an union.
     */
    readonly isUnion: boolean|null|undefined;

    /**
     * Computed value, true if current property is an object.
     */
    readonly isObject: boolean|null|undefined;

    /**
     * Computed value, true if current property is an array.
     */
    readonly isArray: boolean|null|undefined;

    /**
     * Computed value, true if this propery contains a complex
     * structure. It is computed when the property is and array,
     * object, or union.
     */
    readonly isComplex: boolean|null|undefined;

    /**
     * Should be set if described properties has a parent type.
     * This is used when recursively iterating over properties.
     */
    parentTypeName: string|null|undefined;

    /**
     * Computed value, true if `parentTypeName` has a value.
     */
    readonly hasParentTypeName: boolean|null|undefined;

    /**
     * Computed value of shape data type
     */
    readonly propertyDataType: object|null;

    /**
     * Computed value form the shape. True if the property is required.
     */
    readonly isRequired: boolean|null|undefined;

    /**
     * Computed value form the shape. True if the property is ENUM.
     */
    readonly isEnum: boolean|null|undefined;

    /**
     * A description of the property to render.
     */
    readonly propertyDescription: string|null|undefined;

    /**
     * Computed value, true if desceription is set.
     */
    readonly hasPropertyDescription: boolean|null|undefined;

    /**
     * A property to set when the component is rendered in the narrow
     * view. To be used with mobile rendering or when the
     * components occupies only small part of the screen.
     */
    narrow: boolean|null|undefined;

    /**
     * Computes value for `propertyDescription`.
     *
     * @param range Range model
     * @returns Description to render.
     */
    _computeDescription(range: object|null): String|null;
    _computeType(range: any, shape: any): any;

    /**
     * Computes name of the property. This may be different from the
     * `displayName` if `displayName` is set in API spec.
     *
     * @param range Range object of current shape.
     * @returns Display name of the property
     */
    _computePropertyName(range: object|null, shape: any): String|null;

    /**
     * Computes value for `hasDisplayName` property.
     * Indicates that `displayName` has been defined in the API specification.
     */
    _computeHasDisplayName(displayName: String|null): Boolean|null;

    /**
     * Computes value for `hasParentTypeName`.
     */
    _computeHasParentTypeName(parentTypeName: String|null): Boolean|null;

    /**
     * Sets "active" attribute on this element when the border is hovered.
     */
    _borderHover(): void;

    /**
     * Removes "active" attribute on this element when the border is not hovered.
     */
    _borderBlur(): void;

    /**
     * Computes value for `isRequired` property.
     * In AMF model a property is required when `http://www.w3.org/ns/shacl#minCount`
     * does not equal `0`.
     *
     * @param shape Current shape object
     */
    _computeIsRequired(shape: object|null): Boolean|null;

    /**
     * Computes value `isEnum` property.
     *
     * @param range Current `range` object.
     * @returns Curently it always returns `false`
     */
    _computeIsEnum(range: object|null): Boolean|null;

    /**
     * Computes value for `isComplex` property.
     */
    _computeIsComplex(isUnion: any, isObject: any, isArray: any): any;
  }
}

interface HTMLElementTagNameMap {
  "property-shape-document": ApiElements.PropertyShapeDocument;
}
