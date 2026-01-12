import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@api-components/api-resource-example-document/api-resource-example-document.js';
import '../property-shape-document.js';
import '../property-range-document.js';
import { PropertyDocumentMixin } from './PropertyDocumentMixin.js';
import typeStyles from './TypeStyles.js';

/** @typedef {import('@anypoint-web-components/anypoint-button').AnypointButton} AnypointButton */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */

/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

/**
 * `api-type-document`
 *
 * An element that recursively renders a documentation for a data type
 * using from model.
 *
 * Pass AMF's shape type `property` array to render the documentation.
 */
export class ApiTypeDocument extends PropertyDocumentMixin(LitElement) {
  get styles() {
    return typeStyles;
  }

  static get properties() {
    return {
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
      type: { type: Object },
      /**
       * Media type to use to render examples.
       * If not set a "raw" version of the example from API spec file is used.
       */
      mediaType: { type: String },
      /**
       * A list of supported media types for the type.
       * This is used by `api-resource-example-document` to compute examples.
       * In practice it should be value of RAML's `mediaType`.
       *
       * Each item in the array is just a name of thr media type.
       *
       * Example:
       *
       * ```json
       * ["application/json", "application/xml"]
       * ```
       */
      mediaTypes: { type: Array },
      /**
       * Currently selected media type.
       * It is an index of a media type in `mediaTypes` array.
       * It is set to `0` each time the body changes.
       */
      selectedMediaType: { type: Number },
      // The type after it has been resolved.
      _resolvedType: { type: Object },
      /**
       * Computed properties from the resolved type
       */
      _computedProperties: { type: Array },
      /**
       * Resolved type for examples with all link-target references resolved
       */
      _resolvedExampleType: { type: Object },
      /**
       * Whether to show the examples section
       */
      _showExamples: { type: Boolean },
      /**
       * Effective media type for examples
       */
      _exampleMediaType: { type: String },
      /**
       * Should be set if described properties has a parent type.
       * This is used when recursively iterating over properties.
       */
      parentTypeName: { type: String },
      /**
       * Computed value, true if the shape has parent type.
       */
      hasParentType: { type: Boolean },
      /**
       * True if given `type` is a scalar property
       */
      isScalar: { type: Boolean },
      /**
       * True if given `type` is an array property
       */
      isArray: { type: Boolean },
      /**
       * True if given `type` is an object property
       */
      isObject: { type: Boolean },
      /**
       * True if given `type` is an union property
       */
      isUnion: { type: Boolean },
      /**
       * True if given `type` is OAS "and" type.
       */
      isAnd: { type: Boolean },
      /**
       * True if given `type` is OAS "oneOf" type.
       */
      isOneOf: { type: Boolean },
      /**
       * True if given `type` is OAS "anyOf" type.
       */
      isAnyOf: { type: Boolean },
      /**
       * Computed list of union type types to render in union type
       * selector.
       * Each item has `label` and `isScalar` property.
       */
      unionTypes: { type: Array },
      /**
       * Computed list of oneOf type types to render in oneOf type
       * selector.
       * Each item has `label` and `isScalar` property.
       */
      oneOfTypes: { type: Array },
      /**
       * Computed list of anyOf type types to render in anyOf type
       * selector.
       * Each item has `label` and `isScalar` property.
       */
      anyOfTypes: { type: Array },
      /**
       * List of types definition and name for OAS' "and" type
       */
      andTypes: { type: Array },
      /**
       * Selected index of union type in `unionTypes` array.
       */
      selectedUnion: { type: Number },
      /**
       * Selected index of oneOf type in `oneOfTypes` array.
       */
      selectedOneOf: { type: Number },
      /**
       * Selected index of anyOf type in `anyOfTypes` array.
       */
      selectedAnyOf: { type: Number },
      /**
       * A property to set when the component is rendered in the narrow
       * view. To be used with mobile rendering or when the
       * components occupies only small part of the screen.
       */
      narrow: { type: Boolean },
      /**
       * When set an example in this `type` object won't be rendered even if set.
       */
      noMainExample: { type: Boolean },
      /**
       * When rendering schema for a payload set this to the payload ID
       * so the examples can be correctly rendered.
       */
      selectedBodyId: { type: String },

      _hasExamples: { type: Boolean },

      _renderMainExample: { type: Boolean },

      renderReadOnly: { type: Boolean },

      /**
       * When enabled, media selector will not be rendered.
       * Should be used in cases where media types are not
       * applicable.
       */
      noMediaSelector: { type: Boolean },

      noArrayInfo: { type: Boolean },
    };
  }

  get type() {
    return this._type;
  }

  set type(value) {
    const old = this._type;
    if (old === value) {
      return;
    }
    this._type = value;
    this.requestUpdate('type', old);
    this._resolvedType = /** @type any[] */ (this._resolve(value));
    this.__typeChanged();
  }

  /**
   * @returns {string[]|undefined}
   */
  get mediaTypes() {
    return this._mediaTypes;
  }

  /**
   * @param {string[]} value
   */
  set mediaTypes(value) {
    const old = this._mediaTypes;
    if (old === value) {
      return;
    }
    this._mediaTypes = value;
    this.requestUpdate('mediaTypes', old);
    this._mediaTypesChanged(value);
  }

  get parentTypeName() {
    return this._parentTypeName;
  }

  set parentTypeName(value) {
    const old = this._parentTypeName;
    if (old === value) {
      return;
    }
    this._parentTypeName = value;
    this.requestUpdate('parentTypeName', old);
    this.hasParentType = !!value;
  }

  get unionTypes() {
    return this._unionTypes;
  }

  set unionTypes(value) {
    const old = this._unionTypes;
    if (old === value) {
      return;
    }
    this._unionTypes = value;
    this.requestUpdate('unionTypes', old);
    this._multiTypesChanged('selectedUnion', value);
  }

  get oneOfTypes() {
    return this._oneOfTypes;
  }

  set oneOfTypes(value) {
    const old = this._oneOfTypes;
    if (old === value) {
      return;
    }
    this._oneOfTypes = value;
    this.requestUpdate('oneOfTypes', old);
    this._multiTypesChanged('selectedOneOf', value);
  }

  get anyOfTypes() {
    return this._anyOfTypes;
  }

  set anyOfTypes(value) {
    const old = this._anyOfTypes;
    if (old === value) {
      return;
    }
    this._anyOfTypes = value;
    this.requestUpdate('anyOfTypes', old);
    this._multiTypesChanged('selectedAnyOf', value);
  }

  get noMainExample() {
    return this._noMainExample;
  }

  set noMainExample(value) {
    const old = this._noMainExample;
    if (old === value) {
      return;
    }
    this._noMainExample = value;
    this.requestUpdate('noMainExample', old);
    this._renderMainExample = this._computeRenderMainExample(
      value,
      this._hasExamples
    );
  }

  get _hasExamples() {
    return this.__hasExamples;
  }

  set _hasExamples(value) {
    const old = this.__hasExamples;
    if (old === value) {
      return;
    }
    this.__hasExamples = value;
    this.requestUpdate('_hasExamples', old);
    const scalarType = this._hasType(this.type, this.ns.aml.vocabularies.shapes.ScalarShape);
    this._renderMainExample = this._computeRenderMainExample(
      this.noMainExample,
      value,
      scalarType
    );
  }

  get shouldRenderMediaSelector() {
    const { renderMediaSelector, noMediaSelector } = this;
    if (noMediaSelector) {
      return false;
    }
    return renderMediaSelector;
  }

  constructor() {
    super();
    this.hasParentType = false;
    this.narrow = false;
    this.selectedBodyId = undefined;
    /** 
     * @type {number}
     */
    this.selectedUnion = undefined;
    /** 
     * @type {number}
     */
    this.selectedOneOf = undefined;
    /** 
     * @type {number}
     */
    this.selectedAnyOf = undefined;
    this.renderReadOnly = false;
    this.noMainExample = false;
    this._hasExamples = false;
    this._renderMainExample = false;
    this._cachedDeepResolvedType = undefined;

    this._isPropertyReadOnly = this._isPropertyReadOnly.bind(this);
    this.noMediaSelector = false;
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

  _computeRenderMainExample(noMainExample, hasExamples, isScalar = false) {
    return isScalar ? false : !!(!noMainExample && hasExamples);
  }

  /**
   * Called when properties change
   * @param {Map} changedProperties Changed properties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    
    // If amf changed and we have a type, recalculate properties synchronously
    if (changedProperties.has('amf') && this._resolvedType && this.amf) {
      // Cancel any pending debounced calls and recalculate
      this.__typeChangeDebouncer = false;
      this._typeChanged(this._resolvedType);
      // _typeChanged will update _computedProperties, _isGrpcApi, and _deepResolvedType
    }
    
    // If renderReadOnly changed and we have an object, recalculate properties
    // This is needed because _filterReadOnlyProperties depends on this.renderReadOnly
    if (changedProperties.has('renderReadOnly') && this._resolvedType && this.isObject) {
      this._computedProperties = this._computeProperties(this._resolvedType);
    }
    
    // If noMainExample changed, recalculate whether to render examples
    if (changedProperties.has('noMainExample') && this._resolvedType) {
      this._showExamples = !this.noMainExample && (
        this.renderMediaSelector ||
        this.isObject ||
        this._renderMainExample
      );
    }
  }

  /**
   * Called when resolved type or amf changed.
   * Creates a debouncer to compute UI values so it's independent of
   * order of assigning properties.
   */
  __typeChanged() {
    if (this.__typeChangeDebouncer) {
      return;
    }
    this.__typeChangeDebouncer = true;
    setTimeout(() => {
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
    let isOneOf = false;
    let isAnyOf = false;
    let key = ''
    const shapesKey = this.ns.aml.vocabularies.shapes
    if (type instanceof Array) {
      isObject = true;
    } else if (this._hasType(type, shapesKey.ScalarShape) || this._hasType(type, shapesKey.NilShape)) {
      isScalar = true;
      if (this._hasProperty(type, this.ns.w3.shacl.xone)) {
        isScalar = false;
        isOneOf = true;
        key = this._getAmfKey(this.ns.w3.shacl.xone);
        this.oneOfTypes = this._computeTypes(type, key);
      } else if (this._hasProperty(type, this.ns.w3.shacl.or)) {
        isScalar = false;
        isAnyOf = true;
        key = this._getAmfKey(this.ns.w3.shacl.or);
        this.anyOfTypes = this._computeTypes(type, key);
      }
    } else if (
      this._hasType(type, shapesKey.UnionShape)
    ) {
      // Check if this is a nullable union (type | null) which should be rendered as scalar
      const nullableCheck = this._checkNullableUnion(type);
      if (nullableCheck && nullableCheck.isNullable) {
        // Treat nullable types as scalar for cleaner rendering
        isScalar = true;
      } else {
        isUnion = true;
        key = this._getAmfKey(shapesKey.anyOf);
        this.unionTypes = this._computeTypes(type, key);
      }
    } else if (this._hasProperty(type, this.ns.w3.shacl.xone)) {
      isOneOf = true;
      key = this._getAmfKey(this.ns.w3.shacl.xone);
      this.oneOfTypes = this._computeTypes(type, key);
    } else if (this._hasProperty(type, this.ns.w3.shacl.or)) {
      isAnyOf = true;
      key = this._getAmfKey(this.ns.w3.shacl.or);
      this.anyOfTypes = this._computeTypes(type, key);
    } else if (
      this._hasType(type, shapesKey.ArrayShape)
    ) {
      isArray = true;
      const iKey = this._getAmfKey(shapesKey.items);
      let items = this._ensureArray(type[iKey]);
      if (items) {
        items = items[0];
        const andKey = this._getAmfKey(this.ns.w3.shacl.and);
        const orKey = this._getAmfKey(this.ns.w3.shacl.or);
        if (andKey in items) {
          isArray = false;
          isAnd = true;
          this.andTypes = this._computeAndTypes(items[andKey]);
        } else if (orKey in items) {
          isArray = false;
          isAnyOf = true;
          this.anyOfTypes = this._computeAndTypes(items[orKey]);
        }
      }
    } else if (this._hasType(type, this.ns.w3.shacl.NodeShape)) {
      isObject = true;
      const andKey = this._getAmfKey(this.ns.w3.shacl.and);
      if (andKey in type) {
        const propertyKey = this._getAmfKey(this.ns.w3.shacl.property);
        if (!(propertyKey in type)) {
          isObject = false;
        }
        isAnd = true;
        this.andTypes = this._computeAndTypes(type[andKey]);
      }
    } else if (this._hasType(type, shapesKey.AnyShape)) {
      const andKey = this._getAmfKey(this.ns.w3.shacl.and);
      if (andKey in type) {
        isAnd = true;
        this.andTypes = this._computeAndTypes(type[andKey]);
      } else {
        isScalar = true;
      }
    }
    this.isScalar = isScalar;
    this.isArray = isArray;
    this.isObject = isObject;
    this.isUnion = isUnion;
    this.isAnd = isAnd;
    this.isOneOf = isOneOf;
    this.isAnyOf = isAnyOf;
    
    // Compute properties for objects - this needs to be reactive
    if (isObject) {
      this._computedProperties = this._computeProperties(type);
    } else {
      this._computedProperties = undefined;
    }
    
    // Always deep resolve for examples (resolves link-target references for gRPC and similar)
    // This is cheap if there are no link-targets
    if (type) {
      this._resolvedExampleType = this._deepResolveType(type);
    } else {
      this._resolvedExampleType = type;
    }
    
    // Determine if we should show the examples section
    // Priority: noMainExample (hide) > renderMediaSelector (show) > isObject (show) > _renderMainExample
    this._showExamples = !this.noMainExample && (
      this.renderMediaSelector || // Need to show the section for the media type selector
      isObject ||                 // Objects can generate examples automatically
      this._renderMainExample     // Has explicit examples
    );
    
    // Effective media type - use 'application/json' as default for objects without mediaType
    this._exampleMediaType = this.mediaType || (isObject ? 'application/json' : undefined);
  }

  /**
   * Computes parent name for the array type table.
   *
   * @param {string=} parent `parentTypeName` if available
   * @return {string} Parent type name of default value for array type.
   */
  _computeArrayParentName(parent) {
    return parent || '';
  }

  /**
   * Resets type selection for property.
   * @param {string} property Name of the property to be reset
   * @param {any[]=} types List of current anyOf types.
   * @private
   */
  _multiTypesChanged(property, types) {
    if (!types) {
      return;
    }
    this[property] = 0;
  }

  /**
   * Handler for button click when changing selected type
   * in multi type template.
   * Sets given property to the index returned from button.
   *
   * @param {string} property Property name where selected index is kept
   * @param {MouseEvent} e
   * @private
   */
  _selectType(property, e) {
    const node = /** @type AnypointButton */ (e.target);
    const index = Number(node.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    if (this[property] === index) {
      node.active = true;
    } else {
      this[property] = index;
    }
  }

  /**
   * Computes properties for type
   *
   * @param {any} type Type object
   * @param {string} key Key of property to search in the `type` object
   * @param {number} selected Index of the currently selected type
   * @returns {object|undefined} Properties for type
   * @private
   */
  _computeProperty(type, key, selected) {
    if (!type) {
      return undefined;
    }
    const data = type[key];
    if (!data) {
      return undefined;
    }
    let item = /** @type object */ (data[selected]);
    if (!item) {
      return undefined;
    }
    if (Array.isArray(item)) {
      [item] = item;
    }
    // For array types in unions, return the array itself instead of unwrapping to items
    // This preserves the "array of" indicator in the UI
    if (this._hasType(item, this.ns.aml.vocabularies.shapes.ArrayShape)) {
      item = this._resolve(item);
      return item;
    }
    if (Array.isArray(item)) {
      [item] = item;
    }
    // @ts-ignore
    return this._resolve(item);
  }


  /**
   * Deeply resolves link-target references in a type for example generation.
   * This ensures that nested objects show their full structure in examples.
   * This is needed for APIs like gRPC where nested types use link-target references.
   * 
   * @param {Object} type The type to resolve
   * @return {Object} The deeply resolved type
   */
  _deepResolveType(type) {
    if (!type || !this.amf) {
      return type;
    }

    const resolved = this._resolve(type);
    if (!resolved) {
      return type;
    }

    // Get properties
    const propertyKey = this._getAmfKey(this.ns.w3.shacl.property);
    const properties = this._ensureArray(resolved[propertyKey]);
    
    if (!properties || !properties.length) {
      return resolved;
    }

    // Create a new type object with deeply resolved properties
    const deepResolved = { ...resolved };
    const linkTargetKey = this._getAmfKey(this.ns.aml.vocabularies.document.linkTarget);
    const rangeKey = this._getAmfKey(this.ns.raml.vocabularies.shapes.range);
    
    // Resolve each property's range
    const resolvedProperties = properties.map(prop => {
      const resolvedProp = this._resolve(prop);
      if (!resolvedProp) {
        return prop;
      }

      const range = this._ensureArray(resolvedProp[rangeKey])[0];
      if (!range) {
        return resolvedProp;
      }

      // If the range has a link-target, resolve it
      if (range[linkTargetKey]) {
        const linkTargetId = this._ensureArray(range[linkTargetKey])[0];
        if (linkTargetId && linkTargetId['@id']) {
          const targetId = linkTargetId['@id'];
          
          // Find the target
          const declares = this._computeDeclares(this.amf);
          let target = declares ? this._findById(declares, targetId) : undefined;
          
          if (!target) {
            const references = this._computeReferences(this.amf);
            if (references && references.length) {
              for (let i = 0; i < references.length && !target; i++) {
                const refDeclares = this._computeDeclares(references[i]);
                if (refDeclares) {
                  target = this._findById(refDeclares, targetId);
                }
              }
            }
          }

          // If target found, replace the range with the resolved target
          if (target) {
            const resolvedTarget = this._resolve(target);
            if (resolvedTarget) {
              const newProp = { ...resolvedProp };
              newProp[rangeKey] = [resolvedTarget];
              return newProp;
            }
          }
        }
      }

      return resolvedProp;
    });

    deepResolved[propertyKey] = resolvedProperties;
    return deepResolved;
  }

  /**
   * Helper function for the view. Extracts `http://www.w3.org/ns/shacl#property`
   * from the shape model
   *
   * @param {Object} item Range object
   * @return {Object[]|undefined} Shape object
   */
  _computeProperties(item) {
    if (!item) {
      return undefined;
    }
    if (Array.isArray(item)) {
      return item;
    }
    
    // For objects with link-target, we need to find the actual target with properties
    const linkTargetKey = this._getAmfKey(this.ns.aml.vocabularies.document.linkTarget);
    let resolvedItem = item;
    
    if (item[linkTargetKey] && this.amf) {
      const linkTargetId = this._ensureArray(item[linkTargetKey])[0];
      if (linkTargetId && linkTargetId['@id']) {
        const targetId = linkTargetId['@id'];
        // Try to find the target in declares
        const declares = this._computeDeclares(this.amf);
        let target = declares ? this._findById(declares, targetId) : undefined;
        
        // If not found in declares, search in references
        if (!target) {
          const references = this._computeReferences(this.amf);
          if (references && references.length) {
            for (let i = 0; i < references.length && !target; i++) {
              const refDeclares = this._computeDeclares(references[i]);
              if (refDeclares) {
                target = this._findById(refDeclares, targetId);
              }
            }
          }
        }
        
        // If we found the target and it has properties, use it
        // Don't use the target directly to avoid caching issues
        const propertyKey = this._getAmfKey(this.ns.w3.shacl.property);
        if (target && target[propertyKey]) {
          // Use the target's properties but keep the original item structure
          // This prevents issues with cached __apicResolved flags
          resolvedItem = this._resolve(target);
          // If resolve returned the same object or failed, fallback to standard resolve
          if (!resolvedItem || !resolvedItem[propertyKey]) {
            resolvedItem = this._resolve(item);
          }
        }
      }
    }
    
    // Fallback to standard resolve if no link-target or target not found
    if (resolvedItem === item) {
      resolvedItem = this._resolve(item);
    }
    
    if (!resolvedItem) {
      return undefined;
    }
    
    const propertyKey = this._getAmfKey(this.ns.w3.shacl.property);
    const itemProperties = this._ensureArray(resolvedItem[propertyKey]||[])
    const additionalPropertiesKey = this._getAmfKey(this.ns.w3.shacl.additionalPropertiesSchema);

    // If the item doesn't have additional properties, filter the read-only properties and return
    if (!resolvedItem[additionalPropertiesKey]) {
      return this._filterReadOnlyProperties(itemProperties)
    }

    const additionalPropertiesSchema = this._ensureArray(resolvedItem[additionalPropertiesKey])
    
    // If the item does have additional properties, ensure they are in an array
    const additionalProperties = this._ensureArray(additionalPropertiesSchema[0][propertyKey] || additionalPropertiesSchema[0])

    // Combine the item's properties and additional properties
    const combinedProperties = [...itemProperties, ...additionalProperties]

    // Filter the read-only properties and return
    return this._filterReadOnlyProperties(combinedProperties);
  }

  /**
   * Computes list values for `andTypes` property.
   * @param {Object[]} items List of OAS' "and" properties
   * @return {Object[]|undefined} An array of type definitions and label to render
   */
  _computeAndTypes(items) {
    if (!items || !items.length) {
      return undefined;
    }
    return items.map((item) => {
      if (Array.isArray(item)) {
        [item] = item;
      }
      item = this._resolve(item);
      let label = /** @type string */ (this._getValue(
        item,
        this.ns.aml.vocabularies.core.name
      ));
      if (!label) {
        label = /** @type string */ (this._getValue(
          item,
          this.ns.w3.shacl.name
        ));
      }
      if (label && label.indexOf('item') === 0) {
        label = undefined;
      }
      return {
        label,
        type: item,
      };
    });
  }

  /**
   * Observer for `mediaTypes` property.
   * Controls media type selected depending on the value.
   *
   * @param {string[]} types List of media types that are supported by the API.
   */
  _mediaTypesChanged(types) {
    if (!types || !(types instanceof Array) || !types.length) {
      this.renderMediaSelector = false;
    } else if (types.length === 1) {
      this.renderMediaSelector = false;
      this.mediaType = types[0];
    } else {
      this.renderMediaSelector = true;
      this.mediaType = types[0];
      this.selectedMediaType = 0;
    }
  }

  /**
   * Computes if `selected` equals current item index.
   *
   * @param {number} selected
   * @param {number} index
   * @return {boolean}
   */
  _mediaTypeActive(selected, index) {
    return selected === index;
  }

  /**
   * Handler for media type type button click.
   * Sets `selected` property.
   *
   * @param {MouseEvent} e
   */
  _selectMediaType(e) {
    const button = /** @type AnypointButton */ (e.target);
    const index = Number(button.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    if (index !== this.selectedMediaType) {
      this.selectedMediaType = index;
      this.mediaType = this.mediaTypes[index];
    } else {
      button.active = true;
    }
  }

  _hasExamplesHandler(e) {
    const { value } = e.detail;
    this._hasExamples = value;
  }

  /**
   * Return the type mappings
   */
  _typesMappings(item) {
    const itemName = this._getValue(item, this._getAmfKey(this.ns.w3.shacl.name));
    const typeTarget = this._getValue(this.type, this._getAmfKey(this.ns.aml.vocabularies.shapes.discriminator));
    let type;
    if (itemName && typeTarget && itemName === typeTarget) {
      type = this.type;
    }
    return type;
  }

  /**
   * @return {TemplateResult[]|string} Templates for object properties
   */
  _objectTemplate() {
    const items = this._computedProperties;
    if (!items || !items.length) {
      return '';
    }
    return items.map(
      (item) => html`<property-shape-document
        class="object-document"
        .shape="${this._resolve(item)}"
        .amf="${this.amf}"
        .parentTypeName="${this.parentTypeName}"
        ?narrow="${this.narrow}"
        ?noExamplesActions="${this.noExamplesActions}"
        ?compatibility="${this.compatibility}"
        ?graph="${this.graph}"
        .mediaType="${this.mediaType}"
        ?renderReadOnly="${this.renderReadOnly}"
        .discriminatorMapping="${this._typesMappings(item)}"
      ></property-shape-document>`
    );
  }

  _arrayPropertyTemplate(label, value, title) {
    return html`
        <div class="property-attribute" part="property-attribute">
          <span class="attribute-label" part="attribute-label">${label}</span>
          <span class="attribute-value" part="attribute-value" title=${title}>${value}</span>
        </div>
        `
  }

  _arrayPropertiesTemplate() {
    if (!this.noArrayInfo) {
      const minCount = this._getValue(this._resolvedType, this.ns.w3.shacl.minCount)
      const maxCount = this._getValue(this._resolvedType, this.ns.w3.shacl.maxCount)

      return html`
          ${minCount !== undefined ? this._arrayPropertyTemplate('Minimum array length:', minCount, 'Minimum amount of items in array') : ''}
          ${maxCount !== undefined ? this._arrayPropertyTemplate('Maximum array length:', maxCount, 'Maximum amount of items in array') : ''}
      `
    }
    return html``
  }

  /**
   * @return {TemplateResult} Templates for object properties
   */
  _arrayTemplate() {
    const items = this._computeArrayProperties(this._resolvedType) || [];
    const documents = items.map(
      (item) => html`
        ${item.isShape
          ? html`<property-shape-document
              class="array-document"
              .amf="${this.amf}"
              .shape="${item}"
              parentTypeName="${this._computeArrayParentName(this.parentTypeName)}"
              ?narrow="${this.narrow}"
              ?noExamplesActions="${this.noExamplesActions}"
              ?compatibility="${this.compatibility}"
              .mediaType="${this.mediaType}"
              ?graph="${this.graph}"
            ></property-shape-document>`
          : ''}
        ${item.isType
          ? html`<api-type-document
              class="union-document"
              .amf="${this.amf}"
              .parentTypeName="${this.parentTypeName}"
              .type="${item}"
              ?narrow="${this.narrow}"
              ?noExamplesActions="${this.noExamplesActions}"
              ?noMainExample="${this._renderMainExample}"
              ?compatibility="${this.compatibility}"
              .mediaType="${this.mediaType}"
              ?graph="${this.graph}"
            ></api-type-document>`
          : ''}
      `
    );

    return html`
      ${!this.hasParentType ?
        html`
        <span>Array of:</span>
        <div class="array-children">
          ${documents}
        </div>`
        : html`${documents}`
      }
    
      ${this._arrayPropertiesTemplate()}
    `;
  }

  /**
   * @return {TemplateResult} Template for an union type
   */
  _unionTemplate() {
    const items = this.unionTypes || [];
    const selected = this.selectedUnion;
    const selectTypeCallback = this._selectType.bind(this, 'selectedUnion');
    const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.anyOf);
    const type = this._computeProperty(this._resolvedType, key, selected);
    const typeName = 'union'
    const label = 'Any of'
    return this._multiTypeTemplate({ label, items, typeName, selected, selectTypeCallback, type });
  }

  /**
   * @return {TemplateResult} Template for a oneOf type
   * @private
   */
  _oneOfTemplate() {
    const items = this.oneOfTypes;
    const label = 'One of';
    const typeName = 'one-of';
    const selected = this.selectedOneOf;
    const selectTypeCallback = this._selectType.bind(this, 'selectedOneOf');
    const key = this._getAmfKey(this.ns.w3.shacl.xone);
    const type = this._computeProperty(this._resolvedType, key, selected);
    return this._multiTypeTemplate({ label, items, typeName, selected, selectTypeCallback, type });
  }

  /**
   * @return {TemplateResult} Template for an anyOf type
   * @private
   */
  _anyOfTemplate() {
    const items = this.anyOfTypes;
    const label = 'Any of';
    const typeName = 'any-of';
    const selected = this.selectedAnyOf;
    const selectTypeCallback = this._selectType.bind(this, 'selectedAnyOf');
    const key = this._getAmfKey(this.ns.w3.shacl.or);
    let type = this._computeProperty(this._resolvedType, key, selected);
    if (!type) {
      const itemsKey = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
      const items = this._ensureArray(this._resolvedType[itemsKey]);
      if (items.length > 0) {
        type = this._computeProperty(items[0], key, selected);
      }
    }
    return this._multiTypeTemplate({ label, items, typeName, selected, selectTypeCallback, type });
  }

  _getItemLabel(item){
    if(item.label==='Unknown type' && item.avroValue){
      return item.avroValue 
    }
    return item.label

  }

  /**
   *
   * @param {Object} args
   * @param args.label
   * @param args.items
   * @param args.typeName
   * @param args.selected
   * @param args.selectTypeCallback
   * @param args.type
   * @return {TemplateResult} Template for a type which hosts multiple types
   * @private
   */
  _multiTypeTemplate({ label, items, typeName, selected, selectTypeCallback, type }) {
    return html`
      <div class="union-type-selector">
        <span>${label}:</span>
        ${items.map(
      (item, index) => html`<anypoint-button
            class="${typeName}-toggle"
            data-index="${index}"
            ?activated="${selected === index}"
            aria-pressed="${selected === index ? 'true' : 'false'}"
            @click="${selectTypeCallback}"
            ?compatibility="${this.compatibility}"
            title="Select ${this._getItemLabel(item)} type"
            >${this._getItemLabel(item)}</anypoint-button
          >`
    )}
      </div>
      <api-type-document
        class="${typeName}-document"
        .amf="${this.amf}"
        .parentTypeName="${this.parentTypeName}"
        .type="${type}"
        ?narrow="${this.narrow}"
        ?noExamplesActions="${this.noExamplesActions}"
        ?noMainExample="${this._renderMainExample}"
        ?compatibility="${this.compatibility}"
        .mediaType="${this.mediaType}"
        ?graph="${this.graph}"
      ></api-type-document>
    `;
  }

  /**
   * @return {TemplateResult|string} Template for Any type
   */
  _anyTemplate() {
    const items = this.andTypes;
    if (!items || !items.length) {
      return '';
    }
    return html` ${items.map(
      (item) => html` ${item.label
        ? html`<p class="inheritance-label">
              Properties inherited from <b>${item.label}</b>.
            </p>`
        : html`<p class="inheritance-label">Properties defined inline.</p>`}
        <api-type-document
          class="and-document"
          .amf="${this.amf}"
          .type="${item.type}"
          ?narrow="${this.narrow}"
          ?noExamplesActions="${this.noExamplesActions}"
          ?noMainExample="${this._renderMainExample}"
          ?compatibility="${this.compatibility}"
          .mediaType="${this.mediaType}"
          ?graph="${this.graph}"
        ></api-type-document>`
    )}`;
  }

  /**
   * @return {TemplateResult} Template for the element
   */
  render() {
    let parts =
      'content-action-button, code-content-action-button, content-action-button-disabled, ';
    parts +=
      'code-content-action-button-disabled content-action-button-active, ';
    parts +=
      'code-content-action-button-active, code-wrapper, example-code-wrapper, markdown-html';
    const mediaTypes = (this.mediaTypes || []);
    // Use cached values if available, otherwise fallback to computed values
    const shouldRenderExamples = this._showExamples !== undefined 
      ? this._showExamples 
      : this._renderMainExample;
    const exampleMediaType = this._exampleMediaType !== undefined
      ? this._exampleMediaType
      : (this.mediaType || (this.isObject ? 'application/json' : undefined));
    
    return html`<style>${this.styles}</style>
      ${shouldRenderExamples ? html`<section class="examples">
        ${this.shouldRenderMediaSelector
        ? html`<div class="media-type-selector">
              <span>Media type:</span>
              ${mediaTypes.map((item, index) => {
          const selected = this.selectedMediaType === index;
          const pressed = selected ? 'true' : 'false';
          return html`<anypoint-button
                  part="content-action-button"
                  class="media-toggle"
                  data-index="${index}"
                  ?activated="${selected}"
                  aria-pressed="${pressed}"
                  @click="${this._selectMediaType}"
                  ?compatibility="${this.compatibility}"
                  title="Select ${item} media type"
                  >${item}</anypoint-button
                >`;
        })}
            </div>`
        : ''}

        <api-resource-example-document
          .amf="${this.amf}"
          .payloadId="${this.selectedBodyId}"
          .examples="${this._resolvedExampleType || this._resolvedType}"
          .mediaType="${exampleMediaType}"
          .typeName="${this.parentTypeName}"
          @has-examples-changed="${this._hasExamplesHandler}"
          ?noauto="${!!this.isScalar}"
          ?noactions="${this.noExamplesActions}"
          ?rawOnly="${!exampleMediaType}"
          ?compatibility="${this.compatibility}"
          exportParts="${parts}"
          ?renderReadOnly="${this.renderReadOnly}"
        ></api-resource-example-document>
      </section>` : ''}

      ${this.isObject ? this._objectTemplate() : ''}
      ${this.isArray ? this._arrayTemplate() : ''}
      ${this.isScalar
        ? html`<property-shape-document
            class="shape-document"
            .amf="${this.amf}"
            .shape="${this._resolvedType}"
            .parentTypeName="${this.parentTypeName}"
            ?narrow="${this.narrow}"
            ?noExamplesActions="${this.noExamplesActions}"
            ?compatibility="${this.compatibility}"
            .mediaType="${this.mediaType}"
            ?graph="${this.graph}"
          ></property-shape-document>`
        : ''}
      ${this.isUnion ? this._unionTemplate() : ''}
      ${this.isAnd ? this._anyTemplate() : ''}
      ${this.isAnyOf ? this._anyOfTemplate() : ''}
      ${this.isOneOf ? this._oneOfTemplate() : ''}`;
  }

  _filterReadOnlyProperties(properties) {
    if (this.renderReadOnly) {
      return properties;
    }
    if (!properties) {
      return undefined;
    }
    return properties.filter((p) => !this._isPropertyReadOnly(p));
  }
}
