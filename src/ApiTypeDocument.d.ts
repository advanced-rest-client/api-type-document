import { LitElement, CSSResult, TemplateResult } from 'lit-element';
import { PropertyDocumentMixin } from './PropertyDocumentMixin';

/**
 * `api-type-document`
 *
 * An element that recursively renders a documentation for a data type
 * using from model.
 *
 * Pass AMF's shape type `property` array to render the documentation.
 */
export class ApiTypeDocument extends PropertyDocumentMixin(LitElement) {
  get styles(): CSSResult;

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
   * @attribute
   */
  mediaType: string;
  /**
   * A list of supported media types for the type.
   * This is used by `api-resource-example-document` to compute examples.
   * In practice it should be value of raml's `mediaType`.
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
   * @attribute
   */
  selectedMediaType: number;
  // The type after it has been resolved.
  _resolvedType: Object;
  /**
   * Computed properties for object types.
   * This is a reactive property that is recalculated when type, amf, or renderReadOnly changes.
   */
  _computedProperties: any[] | undefined;
  /**
   * Resolved type for examples with all link-target references resolved
   */
  _resolvedExampleType: Object | undefined;
  /**
   * Whether to show the examples section
   */
  _showExamples: boolean | undefined;
  /**
   * Effective media type for examples
   */
  _exampleMediaType: string | undefined;
  /**
   * Should be set if described properties has a parent type.
   * This is used when recursively iterating over properties.
   * @attribute
   */
  parentTypeName: string;
  /**
   * Computed value, true if the shape has parent type.
   * @attribute
   */
  hasParentType: boolean;
  /**
   * True if given `type` is a scalar property
   * @attribute
   */
  isScalar: boolean;
  /**
   * True if given `type` is an array property
   * @attribute
   */
  isArray: boolean;
  /**
   * True if given `type` is an object property
   * @attribute
   */
  isObject: boolean;
  /**
   * True if given `type` is an union property
   * @attribute
   */
  isUnion: boolean;
  /**
   * True if given `type` is OAS "and" type.
   * @attribute
   */
  isAnd: boolean;
  /**
   * True if given `type` is OAS "oneOf" type.
   * @attribute
   */
  isOneOf: boolean;
  /**
   * True if given `type` is OAS "anyOf" type.
   * @attribute
   */
  isAnyOf: boolean;
  /**
   * Computed list of union type types to render in union type
   * selector.
   * Each item has `label` and `isScalar` property.
   */
  unionTypes: object[];
  /**
   * Computed list of oneOf type types to render in oneOf type
   * selector.
   * Each item has `label` and `isScalar` property.
   */
  oneOfTypes: object[];
  /**
   * Computed list of anyOf type types to render in anyOf type
   * selector.
   * Each item has `label` and `isScalar` property.
   */
  anyOfTypes: object[];
  /**
   * List of types definition and name for OAS' "and" type
   */
  andTypes: Object[];
  /**
   * Selected index of union type in `unionTypes` array.
   * @attribute
   */
  selectedUnion: number;
  /**
   * Selected index of oneOf type in `oneOfTypes` array.
   * @attribute
   */
  selectedOneOf: number;
  /**
   * Selected index of anyOf type in `anyOfTypes` array.
   * @attribute
   */
  selectedAnyOf: number;
  /**
   * A property to set when the component is rendered in the narrow
   * view. To be used with mobile rendering or when the
   * components occupies only small part of the screen.
   * @attribute
   */
  narrow: boolean;
  /**
   * When set an example in this `type` object won't be rendered even if set.
   * @attribute
   */
  noMainExample: boolean;
  /**
   * When rendering schema for a payload set this to the payload ID
   * so the examples can be correctly rendered.
   * @attribute
   */
  selectedBodyId: string;

  _hasExamples: boolean;

  _renderMainExample: boolean;
  renderMediaSelector: boolean;

  /**
   * @attribute
   */
  renderReadOnly?: boolean;

  /**
   * When enabled, media selector will not be rendered.
   * Should be used in cases where media types are not
   * applicable.
   * @attribute
   */
  noMediaSelector: boolean;

  noArrayInfo: boolean;

  get shouldRenderMediaSelector(): boolean;

  constructor();

  connectedCallback(): void;

  _computeRenderMainExample(noMainExample: boolean, hasExamples: boolean, isScalar: boolean): boolean;

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
   * @returns Parent type name of default value for array type.
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
   * Handler for button click when changing selected type
   * in multi type template.
   * Sets given property to the index returned from button.
   *
   * @param property Property name where selected index is kept
   */
  _selectType(property: string, e: MouseEvent): void;

  /**
   * Computes properties for union type.
   *
   * @param type Current `type` value.
   * @param selected Selected union index from `unionTypes` array
   * @param key Key of the property to look in
   * @returns Properties for union type.
   */
  _computeProperty(type: any, key: string, selected: number): any|undefined;

  /**
   * Helper function for the view. Extracts `http://www.w3.org/ns/shacl#property`
   * from the shape model
   *
   * @param item Range object
   * @returns Shape object
   */
  _computeProperties(item: any): any[]|undefined;

  /**
   * Deeply resolves link-target references in a type and its nested properties.
   * This is essential for rendering complete examples with nested objects.
   *
   * @param type The type to resolve
   * @returns The type with all link-target references resolved
   */
  _deepResolveType(type: any): any|undefined;

  /**
   * Computes list values for `andTypes` property.
   * @param items List of OAS' "and" properties
   * @returns An array of type definitions and label to render
   */
  _computeAndTypes(items: any[]): any[]|undefined;

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
   */
  _selectMediaType(e: MouseEvent): void;

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
   * @return The template for a oneOf type
   */
  _oneOfTemplate(): TemplateResult;

  /**
   * @return Template for an anyOf type
   */
  _anyOfTemplate(): TemplateResult;

  /**
  * @returns Template for Any type
  */
 _anyTemplate(): TemplateResult|string;

  /**
   * @returns Template for the element
   */
  render(): TemplateResult;

  _filterReadOnlyProperties(properties: any[]): any[]|undefined;
}
