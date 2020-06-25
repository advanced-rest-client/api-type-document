/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

/* eslint-disable class-methods-use-this */

/**
 * @typedef {Object} ArrayPropertyItem
 * @property {boolean} isShape
 * @property {boolean} isType
 */

/**
 * @param {typeof HTMLElement} base
 * @mixes MultiSelectableMixin
 */
const mxFunction = (base) => {
  class PropertyDocumentMixinImpl extends AmfHelperMixin(base) {
    static get properties() {
      return {
        /**
         * A property shape definition of AMF.
         */
        shape: { type: Object },
        /**
         * Computes value of shape's http://raml.org/vocabularies/shapes#range
         */
        range: { type: Object },
        /**
         * Type's current media type.
         * This is used to select/generate examples according to current body
         * media type. When not set it only renders examples that were defined
         * in API specfile in a form as they were written.
         */
        mediaType: { type: String },
        /**
         * When set it removes actions bar from the examples render.
         */
        noExamplesActions: { type: Boolean },

        _hasMediaType: { type: Boolean },

        /**
         * Enables compatibility with Anypoint components.
         */
        compatibility: { type: Boolean },
        /**
         * @deprecated Use `compatibility` instead
         */
        legacy: { type: Boolean },
        /**
         * When enabled it renders external types as links and dispatches
         * `api-navigation-selection-changed` when clicked.
         */
        graph: { type: Boolean },
      };
    }

    get legacy() {
      return this.compatibility;
    }

    set legacy(value) {
      this.compatibility = value;
    }

    get mediaType() {
      return this._mediaType;
    }

    set mediaType(value) {
      const old = this._mediaType;
      if (old === value) {
        return;
      }
      this._mediaType = value;
      this._hasMediaType = this._computeHasMediaType(value);
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('mediaType', old);
      }
    }

    get graph() {
      return this._graph;
    }

    set graph(value) {
      const old = this._graph;
      if (old === value) {
        return;
      }
      this._graph = value;
      this._evaluateGraph();
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('graph', old);
      }
    }

    constructor() {
      super();
      this._hasMediaType = false;
    }

    /**
     * Computes type from a `http://raml.org/vocabularies/shapes#range` object
     *
     * @param {Object} range AMF property range object
     * @return {String|undefined} Data type of the property.
     */
    _computeRangeDataType(range) {
      if (!range) {
        return undefined;
      }
      const rs = this.ns.aml.vocabularies.shapes;
      if (this._hasType(range, rs.ScalarShape)) {
        return this._computeScalarDataType(range);
      }
      if (this._hasType(range, rs.UnionShape)) {
        return 'Union';
      }
      if (this._hasType(range, rs.ArrayShape)) {
        return 'Array';
      }
      if (this._hasType(range, this.ns.w3.shacl.NodeShape)) {
        return 'Object';
      }
      if (this._hasType(range, rs.FileShape)) {
        return 'File';
      }
      if (this._hasType(range, rs.NilShape)) {
        return 'Null';
      }
      if (this._hasType(range, rs.AnyShape)) {
        return 'Any';
      }
      if (this._hasType(range, rs.MatrixShape)) {
        return 'Matrix';
      }
      if (this._hasType(range, rs.TupleShape)) {
        return 'Tuple';
      }
      if (this._hasType(range, rs.UnionShape)) {
        return 'Union';
      }
      if (this._hasType(range, rs.RecursiveShape)) {
        return 'Recursive';
      }
      return 'Unknown type';
    }

    /**
     * Computes type from a scalar shape.
     *
     * @param {Object} range AMF property range object
     * @return {String} Data type of the property.
     */
    _computeScalarDataType(range) {
      const rs = this.ns.aml.vocabularies.shapes;
      const sc = this.ns.w3.xmlSchema;
      const key = this._getAmfKey(this.ns.w3.shacl.datatype);
      const data = this._ensureArray(range[key]);
      const id = data && data[0] ? data[0]['@id'] : '';
      switch (id) {
        case this._getAmfKey(sc.string):
        case sc.string:
          return 'String';
        case this._getAmfKey(sc.integer):
        case sc.integer:
          return 'Integer';
        case this._getAmfKey(sc.long):
        case sc.long:
          return 'Long';
        case this._getAmfKey(sc.float):
        case sc.float:
          return 'Float';
        case this._getAmfKey(sc.double):
        case sc.double:
          return 'Double';
        case this._getAmfKey(rs.number):
        case rs.number:
          return 'Number';
        case this._getAmfKey(sc.boolean):
        case sc.boolean:
          return 'Boolean';
        case this._getAmfKey(sc.dateTime):
        case sc.dateTime:
          return 'DateTime';
        case this._getAmfKey(rs.dateTimeOnly):
        case rs.dateTimeOnly:
          return 'Time';
        case this._getAmfKey(sc.time):
        case sc.time:
          return 'Time';
        case this._getAmfKey(sc.date):
        case sc.date:
          return 'Date';
        case this._getAmfKey(sc.base64Binary):
        case sc.base64Binary:
          return 'Base64 binary';
        case this._getAmfKey(rs.password):
        case rs.password:
          return 'Password';
        default:
          return 'Unknown type';
      }
    }

    /**
     * Computes value for `range` property.
     * @param {Object} shape Current shape object.
     * @return {Object} Range object
     */
    _computeRange(shape) {
      if (!shape) {
        return undefined;
      }
      let data;
      if (this._hasType(shape, this.ns.aml.vocabularies.shapes.ScalarShape)) {
        data = shape;
      } else if (
        this._hasType(shape, this.ns.aml.vocabularies.apiContract.Parameter)
      ) {
        const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.schema);
        data = this._ensureArray(shape[key]);
        data = data && data.length ? data[0] : undefined;
      } else {
        const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.range);
        data = this._ensureArray(shape[key]);
        data = data && data.length ? data[0] : undefined;
      }
      return data;
    }

    /**
     * Computes properties to render Array items documentation.
     *
     * @param {object} range Range object of current shape.
     * @return {ArrayPropertyItem[]|undefined} List of Array items.
     */
    _computeArrayProperties(range) {
      if (!range) {
        return undefined;
      }
      const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
      let item = range[key];
      if (!item) {
        return undefined;
      }
      if (Array.isArray(item)) {
        [item] = item;
      }
      item = this._resolve(item);
      if (!item) {
        return undefined;
      }
      switch (true) {
        case this._hasType(item, this.ns.aml.vocabularies.shapes.ScalarShape):
          item.isShape = true;
          return this._ensureArray(item);
        case this._hasType(item, this.ns.aml.vocabularies.shapes.UnionShape):
        case this._hasType(item, this.ns.aml.vocabularies.shapes.ArrayShape):
          item.isType = true;
          return [item];
        default: {
          const pkey = this._getAmfKey(this.ns.w3.shacl.property);
          const items = this._ensureArray(item[pkey]);
          if (items) {
            /* eslint-disable-next-line no-param-reassign */
            items.forEach((i) => {
              i.isShape = true;
            });
          }
          return items;
        }
      }
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
      return this._hasType(range, this.ns.aml.vocabularies.shapes.UnionShape);
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
      return this._hasType(range, this.ns.w3.shacl.NodeShape);
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
      return this._hasType(range, this.ns.aml.vocabularies.shapes.ArrayShape);
    }

    /**
     * Computes list of union type labels to render.
     *
     * @param {Boolean} isUnion
     * @param {Object} range
     * @return {Array<Object>}
     */
    _computeUnionTypes(isUnion, range) {
      if (!isUnion || !range) {
        return undefined;
      }
      const key = this._getAmfKey(this.ns.aml.vocabularies.shapes.anyOf);
      const list = this._ensureArray(range[key]);
      if (!list) {
        return undefined;
      }
      return list.map((obj) => {
        let item = obj;
        if (item instanceof Array) {
          [item] = item;
        }
        item = this._resolve(item);
        let isScalar = this._hasType(
          item,
          this.ns.aml.vocabularies.shapes.ScalarShape
        );
        const isNil = this._hasType(
          item,
          this.ns.aml.vocabularies.shapes.NilShape
        );
        if (!isScalar && isNil) {
          isScalar = true;
        }
        const isArray = this._hasType(
          item,
          this.ns.aml.vocabularies.shapes.ArrayShape
        );
        const isType = !isScalar && !isArray;
        let label;
        if (isArray) {
          label = this._getValue(item, this.ns.w3.shacl.name);
          if (!label) {
            const k = this._getAmfKey(this.ns.aml.vocabularies.shapes.items);
            label = this._computeArrayUnionLabel(item[k]);
          }
        } else if (isNil) {
          label = 'Null';
        } else {
          label = this._getValue(item, this.ns.aml.vocabularies.core.name);
          if (!label) {
            label = this._getValue(item, this.ns.w3.shacl.name);
          }
          if (
            !label &&
            this._hasType(item, this.ns.aml.vocabularies.shapes.ScalarShape)
          ) {
            label = this._computeRangeDataType(item);
          }
        }
        if (!label) {
          label = 'Unnamed type';
        }
        return {
          isScalar,
          isArray,
          isType,
          label,
        };
      });
    }

    /**
     * Computes union type label when the union is in Array.
     *
     * @param {Array|Object} items Array's items property or a single property
     * @return {String|undefined} Label for the union type.
     */
    _computeArrayUnionLabel(items) {
      if (!items) {
        return undefined;
      }
      let list = items;
      if (Array.isArray(list)) {
        [list] = list;
      }
      list = this._resolve(list);
      if (this._hasType(list, this.ns.aml.vocabularies.shapes.ScalarShape)) {
        return this._computeRangeDataType(list);
      }
      return this._computeDisplayName(list, list);
    }

    /**
     * Computes name label for the shape.
     *
     * @param {Object} range Range object of current shape.
     * @param {Object} shape The shape of the property.
     * @return {String|undefined} Display name of the property
     */
    _computeDisplayName(range, shape) {
      if (!shape || !range) {
        return undefined;
      }
      // let name;
      if (
        this._hasType(shape, this.ns.aml.vocabularies.apiContract.Parameter)
      ) {
        return /** @type string */ (this._getValue(
          range,
          this.ns.aml.vocabularies.core.name
        ));
      }
      if (this._hasType(range, this.ns.w3.shacl.NodeShape)) {
        return /** @type string */ (this._getValue(
          shape,
          this.ns.w3.shacl.name
        ));
      }
      return /** @type string */ (this._getValue(
        range,
        this.ns.aml.vocabularies.core.name
      ));
    }

    _computeHasMediaType(mediaType) {
      return !!mediaType;
    }

    _evaluateGraph() {}

    _isPropertyReadOnly(property) {
      if (Array.isArray(property)) {
        property = property[0]
      }
      const rKey = this._getAmfKey(this.ns.aml.vocabularies.shapes.range)
      const range = property[rKey]
      return this._isReadOnly(range)
    }

    _isReadOnly(node) {
      if (Array.isArray(node)) {
        node = node[0]
      }
      if (!node) {
        return false
      }
      const roKey = this._getAmfKey(this.ns.aml.vocabularies.shapes.readOnly)
      return this._getValue(node, roKey);
    }
  }
  return PropertyDocumentMixinImpl;
};
/**
 * A mixin that contains common function for `property-*-document` elements.
 * @mixin
 */
export const PropertyDocumentMixin = dedupeMixin(mxFunction);
