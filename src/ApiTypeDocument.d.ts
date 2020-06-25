import { LitElement, CSSResult, TemplateResult } from 'lit-element';
import { PropertyDocumentMixin } from './PropertyDocumentMixin';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

/**
 * `api-type-document`
 *
 * An element that recuresively renders a documentation for a data type
 * using from model.
 *
 * Pass AMF's shape type `property` array to render the documentation.
 */
export class ApiTypeDocument extends PropertyDocumentMixin(LitElement) {
  readonly styles: CSSResult;

  /**
   * `raml-aware` scope property to use.
   */
  aware: string;
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
  type: Object;
  /**
   * Media type to use to render examples.
   * If not set a "raw" version of the example from API spec file is used.
   */
  mediaType: string;
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
  mediaTypes: string[];
  /**
   * Currently selected media type.
   * It is an index of a media type in `mediaTypes` array.
   * It is set to `0` each time the body changes.
   */
  selectedMediaType: number;
  // The type after it has been resolved.
  _resolvedType: Object;
  /**
   * Should be set if described properties has a parent type.
   * This is used when recursively iterating over properties.
   */
  parentTypeName: string;
  /**
   * Computed value, true if the shape has parent type.
   */
  hasParentType: boolean;
  /**
   * True if given `type` is a scalar property
   */
  isScalar: boolean;
  /**
   * True if given `type` is an array property
   */
  isArray: boolean;
  /**
   * True if given `type` is an object property
   */
  isObject: boolean;
  /**
   * True if given `type` is an union property
   */
  isUnion: boolean;
  /**
   * True if given `type` is OAS "and" type.
   */
  isAnd: boolean;
  /**
   * Computed list of union type types to render in union type
   * selector.
   * Each item has `label` and `isScalar` property.
   */
  unionTypes: Object[];
  /**
   * List of types definition and name for OAS' "and" type
   */
  andTypes: Object[];
  /**
   * Selected index of union type in `unionTypes` array.
   */
  selectedUnion: number;
  /**
   * A property to set when the component is rendered in the narrow
   * view. To be used with mobile rendering or when the
   * components occupies only small part of the screen.
   */
  narrow: boolean;
  /**
   * When set an example in this `type` object won't be rendered even if set.
   */
  noMainExample: boolean;
  /**
   * When rendering schema for a payload set this to the payload ID
   * so the examples can be correctly rendered.
   */
  selectedBodyId: string;

  _hasExamples: boolean;

  _renderMainExample: boolean;


  constructor();

  connectedCallback(): void;

  _computeRenderMainExample(noMainExample: boolean, hasExamples: boolean): boolean;

  /**
   * Called when resolved type or amf changed.
   * Creates a debouncer to compute UI values so it's independent of
   * order of assigning properties.
   */
  __typeChanged(): void;

  /**
   * Handles type change. Sets basic view control properties.
   *
   * @param type Passed type
   */
  _typeChanged(type: object): void;

  /**
   * Computes parent name for the array type table.
   *
   * @param parent `parentTypeName` if available
   * @returns Parent type name of refault value for array type.
   */
  _computeArrayParentName(parent?: string): string;

  /**
   * Resets union selection when union types list changes.
   *
   * @param types List of current union types.
   * @param property Name of field to change
   */
  _multiTypesChanged(property: string, types: object[]): void;

  /**
   * Handler for union type button click.
   * Sets `selectedUnion` property.
   */
  _selectUnion(e: MouseEvent): void;

  /**
   * Computes properties for union type.
   *
   * @param type Current `type` value.
   * @param selected Selected union index from `unionTypes` array
   * @param key Key of the property to look in
   * @returns Properties for union type.
   */
  _computeProperty(type: Object, key: string, selected: number): Object[]|undefined;

  /**
   * Helper function for the view. Extracts `http://www.w3.org/ns/shacl#property`
   * from the shape model
   *
   * @param item Range object
   * @returns Shape object
   */
  _computeProperties(item: Object): Object[]|undefined;

  /**
   * Computes list values for `andTypes` property.
   * @param items List of OAS' "and" properties
   * @returns An array of type definitions and label to render
   */
  _computeAndTypes(items: Object[]): Object[]|undefined;

  /**
   * Observer for `mediaTypes` property.
   * Controls media type selected depending on the value.
   *
   * @param types List of media types that are supported by the API.
   */
  _mediaTypesChanged(types: string[]): void;

  /**
   * Computes if `selected` equals current item index.
   */
  _mediaTypeActive(selected: number, index: number): boolean;

  /**
   * Handler for media type type button click.
   * Sets `selected` property.
   *
   * @param {MouseEvent} e
   */
  _selectMediaType(e: MouseEvent): void;

  _apiChangedHandler(e: CustomEvent): void;

  _hasExamplesHandler(e: CustomEvent): void;

  /**
   * @returns Templates for object properties
   */
  _objectTemplate(): TemplateResult[]|string;

  /**
   * @returns Templates for object properties
   */
  _arrayTemplate(): TemplateResult;

  /**
   * @returns Template for an union type
   */
  _unionTemplate(): TemplateResult;

  /**
   * @returns Template for Any type
   */
  _anyTemplate(): TemplateResult|string;

  /**
   * @returns Template for the element
   */
  render(): TemplateResult;
}
export interface ApiTypeDocument extends PropertyDocumentMixin, AmfHelperMixin, LitElement {
}
