import { AmfHelperMixinConstructor } from '@api-components/amf-helper-mixin/src/AmfHelperMixin';
declare function PropertyDocumentMixin<T extends new (...args: any[]) => {}>(base: T): T & AmfHelperMixinConstructor & PropertyDocumentMixinConstructor;
interface PropertyDocumentMixinConstructor {
  new(...args: any[]): PropertyDocumentMixin;
}

declare interface ArrayPropertyItem {
  isShape: boolean;
  isType: boolean;
}


interface PropertyDocumentMixin {
  /**
   * A property shape definition of AMF.
   */
  shape: Object;
  /**
   * Computes value of shape's http://raml.org/vocabularies/shapes#range
   */
  range: Object;
  /**
   * Type's current media type.
   * This is used to select/generate examples according to current body
   * media type. When not set it only renders examples that were defined
   * in API specfile in a form as they were written.
   */
  mediaType: string;
  /**
   * When set it removes actions bar from the examples render.
   */
  noExamplesActions: boolean;

  _hasMediaType: boolean;

  /**
   * Enables compatibility with Anypoint components.
   */
  compatibility: boolean;
  /**
   * @deprecated Use `compatibility` instead
   */
  legacy: boolean;
  /**
   * When enabled it renders external types as links and dispatches
   * `api-navigation-selection-changed` when clicked.
   */
  graph: boolean;

  /**
   * Computes type from a `http://raml.org/vocabularies/shapes#range` object
   *
   * @param range AMF property range object
   * @returns Data type of the property.
   */
  _computeRangeDataType(range: Object): String|undefined;

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
  _computeArrayProperties(range: Object): ArrayPropertyItem[]|undefined;

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
  _computeArrayUnionLabel(items: object|object[]): string|undefined;

  /**
   * Computes name label for the shape.
   *
   * @param range Range object of current shape.
   * @param shape The shape of the property.
   * @returns Display name of the property
   */
  _computeDisplayName(range: Object, shape: Object): string|undefined;

  _computeHasMediaType(mediaType: string): boolean;

  _evaluateGraph(): void;
}
export {PropertyDocumentMixinConstructor};
export {PropertyDocumentMixin};
