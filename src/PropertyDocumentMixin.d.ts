import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

declare function PropertyDocumentMixin<T extends new (...args: any[]) => {}>(base: T): T & PropertyDocumentMixinConstructor;
interface PropertyDocumentMixinConstructor {
  new(...args: any[]): PropertyDocumentMixin;
}

export declare interface ArrayPropertyItem {
  isShape: boolean;
  isType: boolean;
}


interface PropertyDocumentMixin extends AmfHelperMixin {
  /**
   * A property shape definition of AMF.
   */
  shape: any;
  /**
   * Computes value of shape's http://raml.org/vocabularies/shapes#range
   */
  range: any;
  /**
   * Type's current media type.
   * This is used to select/generate examples according to current body
   * media type. When not set it only renders examples that were defined
   * in API spec file in a form as they were written.
   *
   * @attribute
   */
  mediaType: string;
  /**
   * When set it removes actions bar from the examples render.
   * @attribute
   */
  noExamplesActions: boolean;

  _hasMediaType: boolean;

  /**
   * Enables compatibility with Anypoint components.
   * @attribute
   */
  compatibility: boolean;
  /**
   * When enabled it renders external types as links and dispatches
   * `api-navigation-selection-changed` when clicked.
   * @attribute
   */
  graph: boolean;

  /**
   * Computes type from a `http://raml.org/vocabularies/shapes#range` object
   *
   * @param range AMF property range object
   * @returns Data type of the property.
   */
  _computeRangeDataType(range: Object): String | undefined;

  /**
   * Computes type from a scalar shape.
   *
   * @param range AMF property range object
   * @returns Data type of the property.
   */
  _computeScalarDataType(range: Object): String;

  /**
   * Computes value for `range` property.
   * @param shape Current shape object.
   * @returns Range object
   */
  _computeRange(shape: Object): Object;

  /**
   * Computes properties to render Array items documentation.
   *
   * @param range Range object of current shape.
   * @returns List of Array items.
   */
  _computeArrayProperties(range: Object): ArrayPropertyItem[] | undefined;

  /**
   * Computes value for `isUnion` property.
   * Union type is identified as a `http://raml.org/vocabularies/shapes#UnionShape`
   * type.
   *
   * @param range Range object of current shape.
   */
  _computeIsUnion(range: Object): boolean;

  /**
   * Computes value for `isObject` property.
   * Object type is identified as a `http://raml.org/vocabularies/shapes#NodeShape`
   * type.
   *
   * @param range Range object of current shape.
   */
  _computeIsObject(range: Object): boolean;

  /**
   * Computes value for `isArray` property.
   * Array type is identified as a `http://raml.org/vocabularies/shapes#ArrayShape`
   * type.
   *
   * @param range Range object of current shape.
   */
  _computeIsArray(range: Object): boolean;

  /**
   * Computes value for `isAnyOf` property.
   * AnyOf type is identified as a `http://www.w3.org/ns/shacl#or`
   *
   * @param range Range object of current shape.
   */
  _computeIsAnyOf(range: Object): boolean


  /**
   * Computes value for `isAllOf` property.
   * AllOf type is identified as `http://www.w3.org/ns/shacl#and`
   * Returns true if `and` property is present in shape. Otherwise returns false.
   *
   * @param {Object} range Range object of current shape.
   * @returns {boolean}
   */
  _computeIsAllOf(range: Object): boolean

  /**
   * Computes list of type labels to render.
   *
   * @param {Object} range
   * @param {String} key Key to look for values in
   * @return {Array<Object>}
   */
  _computeTypes(range, key);

  /**
   * Computes union type label when the union is in Array.
   *
   * @param items Array's items property or a single property
   * @returns Label for the union type.
   */
  _computeArrayUnionLabel(items: object | object[]): string | undefined;

  /**
   * Computes name label for the shape.
   *
   * @param range Range object of current shape.
   * @param shape The shape of the property.
   * @returns Display name of the property
   */
  _computeDisplayName(range: Object, shape: Object): string | undefined;

  _computeParentName(range: Object, shape: Object): string | undefined;

  _computeHasMediaType(mediaType: string): boolean;

  _evaluateGraph(): void;

  _isPropertyReadOnly(property: any): boolean;
  _isReadOnly(property: any): boolean;
}
export { PropertyDocumentMixinConstructor };
export { PropertyDocumentMixin };
