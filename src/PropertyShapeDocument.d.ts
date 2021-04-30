import { LitElement, CSSResult, TemplateResult } from 'lit-element';
import { PropertyDocumentMixin } from './PropertyDocumentMixin.js';

/**
 * Renders a documentation for a shape property of AMF model.
 */
export class PropertyShapeDocument extends  PropertyDocumentMixin(LitElement) {
  readonly styles: CSSResult[];
  range: any;
  /**
   * Computed value of "display name" of the property
   * @attribute
   */
  displayName: string;
  /**
   * A type property name.
   * This may be different from `displayName` property if
   * `displayName` was specified in the API spec for this property.
   * @attribute
   */
  propertyName: string;
  /**
   * Computed value, true if `displayName` has been defined for this
   * property.
   * @attribute
   */
  hasDisplayName: boolean;
  /**
   * Computed value, true if current property is an union.
   * @attribute
   */
  isUnion: boolean;
  /**
   * Computed value, true if current property is an object.
   * @attribute
   */
  isObject: boolean;
  /**
   * Computed value, true if current property is an array.
   * @attribute
   */
  isArray: boolean;
  /**
   * Computed value from the shape. True if the property is an anyOf
   */
  isAnyOf: boolean;
  /**
   * Computed value, true if current property is an array and the item
   * is a scalar.
   * @attribute
   */
  isScalarArray: boolean;
  /**
   * Computed value, true if this property contains a complex
   * structure. It is computed when the property is and array,
   * object, or union.
   * @attribute
   */
  isComplex: boolean;
  /**
   * Should be set if described properties has a parent type.
   * This is used when recursively iterating over properties.
   * @attribute
   */
  parentTypeName: string;
  /**
   * Computed value, true if `parentTypeName` has a value.
   * @attribute
   */
  hasParentTypeName: boolean;
  /**
   * Computed value of shape data type
   * @attribute
   */
  propertyDataType: string;
  /**
   * Computed value form the shape. True if the property is required.
   * @attribute
   */
  isRequired: boolean;
  /**
   * Computed value form the shape. True if the property is ENUM.
   * @attribute
   */
  isEnum: boolean;
  /**
   * Computed value form the shape. True if the property is read only.
   * @attribute
   */
  isReadOnly: boolean;
  /**
   * A description of the property to render.
   * @attribute
   */
  propertyDescription: string;
  /**
   * A description of the shape to render.
   * @attribute
   */
  shapeDescription: string;
  /**
   * Computed value, true if description is set.
   * @attribute
   */
  hasPropertyDescription: boolean;
  /**
   * Computed value, true if description is set.
   * @attribute
   */
  hasShapeDescription: boolean;
  /**
   * A property to set when the component is rendered in the narrow
   * view. To be used with mobile rendering or when the
   * components occupies only small part of the screen.
   * @attribute
   */
  narrow: boolean;
  /**
   * When set it removes actions bar from the examples render.
   * @attribute
   */
  noExamplesActions: boolean;

  _targetTypeId: string;
  _targetTypeName: string;
  /**
   * When `isComplex` is true this determines if the complex structure
   * is currently rendered.
   * @attribute
   */
  opened: boolean;
  /**
   * @attribute
   */
  renderReadOnly: boolean;

  get complexToggleLabel(): string;

  get _renderToggleButton(): boolean;

  get arrayScalarTypeName(): string;

  constructor();

  connectedCallback(): void;

  __amfChanged(): void;

  _shapeChanged(shape: object): void;

  _rangeChanged(range: object): void;

  _shapeRangeChanged(shape: object, range: object): void;

  _computeObjectDataType(range: object, shape: object): string;

  /**
   * Computes name of the property. This may be different from the
   * `displayName` if `displayName` is set in API spec.
   *
   * @param range Range object of current shape.
   * @param shape The shape object
   * @returns Display name of the property
   */
  _computePropertyName(range: object, shape: object): string|undefined;

  /**
   * Computes value for `hasDisplayName` property.
   * Indicates that `displayName` has been defined in the API specification.
   */
  _computeHasDisplayName(displayName: string, propertyName: string): boolean;

  /**
   * Computes value for `hasParentTypeName`.
   */
  _computeHasParentTypeName(parentTypeName: string): boolean;

  /**
   * Computes value for `isRequired` property.
   * In AMF model a property is required when `http://www.w3.org/ns/shacl#minCount`
   * does not equal `0`.
   *
   * @param shape Current shape object
   */
  _computeIsRequired(shape: object): boolean;

  /**
   * Computes value `isEnum` property.
   * @param range Current `range` object
   */
  _computeIsEnum(range: object, isArray: boolean): boolean;

  /**
   * @param range Current `range` object
   */
  _computeIsEnumArray(range: object): boolean;

  /**
   * Computes value for `propertyDescription`.
   * @param range Range model
   * @returns Description to render.
   */
  _computeDescription(range: object): string|undefined;

  /**
   * Computes value for `isComplex` property.
   */
  _computeIsComplex(isUnion: boolean, isObject: boolean, isArray: boolean): boolean;

  _evaluateGraph(): void;

  _getType(amf: object, id: string): Object;

  _navigateType(): void;

  _linkKeydown(e: KeyboardEvent): void;

  toggle(): void;

  /**
   * @param range The range definition.
   * @returns True when the property type is Array and the items on the
   * array are scalars only.
   */
  _computeIsScalarArray(range: object): boolean;

  /**
   * @returns Template for a complex shape (object/array/union)
   */
  _complexTemplate(): TemplateResult|string;

  /**
   * @returns Template for a type name label
   */
  _getTypeNameTemplate(): TemplateResult;

  /**
   * @returns Template for the description
   */
  _descriptionTemplate(): TemplateResult|string;

  /**
   * @returns Template for type name header
   */
  _headerTemplate(): TemplateResult;

  /**
   * @returns Template for a type name label
   */
  _headerNameTemplate(): TemplateResult;

  /**
   * @returns Main render function.
   */
  render(): TemplateResult;
}
