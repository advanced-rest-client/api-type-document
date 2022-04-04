import { assert, fixture, nextFrame } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import './test-document-mixin.js';

/* eslint-disable prefer-destructuring */

describe('PropertyDocumentMixin', () => {
  async function basicFixture() {
    return fixture(`<test-document-mixin></test-document-mixin>`);
  }

  describe('_computeRangeDataType()', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element;
        let model;
        before(async () => {
          const data = await AmfLoader.loadType('ScalarType', item[1]);
          model = data[0];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = model;
        });

        it('Computes UnionShape', () => {
          const type = element._getAmfKey(
            'http://a.ml/vocabularies/shapes#UnionShape'
          );
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'Union');
        });

        it('Computes ArrayShape', () => {
          const type = element._getAmfKey(
            'http://a.ml/vocabularies/shapes#ArrayShape'
          );
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'Array');
        });

        it('Computes NodeShape', () => {
          const type = element._getAmfKey(
            'http://www.w3.org/ns/shacl#NodeShape'
          );
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'Object');
        });

        it('Computes FileShape', () => {
          const type = element._getAmfKey(
            'http://a.ml/vocabularies/shapes#FileShape'
          );
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'File');
        });

        it('Computes NilShape', () => {
          const type = element._getAmfKey(
            'http://a.ml/vocabularies/shapes#NilShape'
          );
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'Null');
        });

        it('Computes AnyShape', () => {
          const type = element._getAmfKey(
            'http://a.ml/vocabularies/shapes#AnyShape'
          );
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'Any');
        });

        it('Computes MatrixShape', () => {
          const type = element._getAmfKey(
            'http://a.ml/vocabularies/shapes#MatrixShape'
          );
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'Matrix');
        });

        it('Computes TupleShape', () => {
          const type = element._getAmfKey(
            'http://a.ml/vocabularies/shapes#TupleShape'
          );
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'Tuple');
        });

        it('Computes RecursiveShape', () => {
          const type = element._getAmfKey(
            'http://a.ml/vocabularies/shapes#RecursiveShape'
          );
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'Recursive');
        });

        it('Computes Unknown type', () => {
          const type = 'unknown';
          const result = element._computeRangeDataType({
            '@type': [type],
          });
          assert.equal(result, 'Unknown type');
        });

        it('Returns undefined when no argument', () => {
          const result = element._computeRangeDataType();
          assert.isUndefined(result);
        });
      });
    });
  });

  describe('_computeRangeDataType() - ScalarShape', () => {
    let element;
    const shape = {
      '@type': ['http://a.ml/vocabularies/shapes#ScalarShape'],
      'http://www.w3.org/ns/shacl#datatype': [
        {
          '@id': '',
        },
      ],
    };
    before(async () => {
      element = await basicFixture();
    });

    function setType(type) {
      shape['http://www.w3.org/ns/shacl#datatype'][0]['@id'] = type;
    }

    [
      ['http://a.ml/vocabularies/shapes#number', 'Number'],
      ['http://www.w3.org/2001/XMLSchema#integer', 'Integer'],
      ['http://www.w3.org/2001/XMLSchema#string', 'String'],
      ['http://www.w3.org/2001/XMLSchema#boolean', 'Boolean'],
      ['http://www.w3.org/2001/XMLSchema#date', 'Date'],
      ['http://www.w3.org/2001/XMLSchema#time', 'Time'],
      ['http://www.w3.org/2001/XMLSchema#dateTime', 'DateTime'],
      ['http://a.ml/vocabularies/shapes#dateTimeOnly', 'DateTime'],
      ['http://www.w3.org/2001/XMLSchema#float', 'Float'],
      ['http://www.w3.org/2001/XMLSchema#long', 'Long'],
      ['http://www.w3.org/2001/XMLSchema#double', 'Double'],
      ['http://www.w3.org/2001/XMLSchema#base64Binary', 'Base64 binary'],
      ['http://a.ml/vocabularies/shapes#password', 'Password'],
      ['UNKNOWN', 'Unknown type'],
    ].forEach((item) => {
      it(`Computes ${item[0]}`, () => {
        setType(item[0]);
        const result = element._computeRangeDataType(shape);
        assert.equal(result, item[1]);
      });
    });
  });

  describe('_computeRangeDataType() - ScalarShape - compact model', () => {
    let element;
    const shape = {
      '@type': ['raml-shapes:ScalarShape'],
      'shacl:datatype': [
        {
          '@id': '',
        },
      ],
    };

    before(async () => {
      const model = await AmfLoader.load(true);
      element = await basicFixture();
      element.amf = model;
    });

    function setType(type) {
      shape['shacl:datatype'][0]['@id'] = type;
    }

    [
      ['http://a.ml/vocabularies/shapes#number', 'Number'],
      ['http://www.w3.org/2001/XMLSchema#integer', 'Integer'],
      ['http://www.w3.org/2001/XMLSchema#string', 'String'],
      ['http://www.w3.org/2001/XMLSchema#boolean', 'Boolean'],
      ['http://www.w3.org/2001/XMLSchema#date', 'Date'],
      ['http://www.w3.org/2001/XMLSchema#time', 'Time'],
      ['http://www.w3.org/2001/XMLSchema#dateTime', 'DateTime'],
      ['http://a.ml/vocabularies/shapes#dateTimeOnly', 'DateTime'],
      ['http://www.w3.org/2001/XMLSchema#float', 'Float'],
      ['http://www.w3.org/2001/XMLSchema#long', 'Long'],
      ['http://www.w3.org/2001/XMLSchema#double', 'Double'],
      ['http://www.w3.org/2001/XMLSchema#base64Binary', 'Base64 binary'],
      ['http://a.ml/vocabularies/shapes#password', 'Password'],
      ['UNKNOWN', 'Unknown type'],
    ].forEach((item) => {
      it(`Computes ${item[0]}`, () => {
        setType(item[0]);
        const result = element._computeRangeDataType(shape);
        assert.equal(result, item[1]);
      });
    });
  });

  describe('_computeRange()', () => {
    let element;
    const ScalarShape = {
      '@type': ['http://a.ml/vocabularies/shapes#ScalarShape'],
      'http://www.w3.org/ns/shacl#datatype': [
        {
          '@id': 'http://a.ml/vocabularies/shapes#number',
        },
      ],
    };
    const ParameterShape = {
      '@type': ['http://a.ml/vocabularies/apiContract#Parameter'],
      'http://a.ml/vocabularies/shapes#schema': ['TEST-PARAMETER'],
    };
    const NodeShape = {
      '@type': ['http://a.ml/vocabularies/apiContract#NodeShape'],
      'http://a.ml/vocabularies/shapes#range': ['TEST-RANGE'],
    };

    before(async () => {
      element = await basicFixture();
    });

    it('Computes range for scalar shape', () => {
      const result = element._computeRange(ScalarShape);
      assert.isTrue(result === ScalarShape);
    });

    it('Computes range for parameter shape', () => {
      const result = element._computeRange(ParameterShape);
      assert.equal(result, 'TEST-PARAMETER');
    });

    it('Computes range for node shape', () => {
      const result = element._computeRange(NodeShape);
      assert.equal(result, 'TEST-RANGE');
    });
  });

  describe('_computeArrayProperties()', () => {
    [
      ['Regulat model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(item[0], () => {
        let element;
        let model;
        before(async () => {
          const data = AmfLoader.loadType('ScalarType', item[1]);
          model = data[0];
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = model;
        });

        it('Returnms undefined when no argument', () => {
          const result = element._computeArrayProperties();
          assert.isUndefined(result);
        });

        it('Returnms undefined when no "items" in shape', () => {
          const result = element._computeArrayProperties({});
          assert.isUndefined(result);
        });

        it('Returnms undefined when "items" is empty array', () => {
          const iKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.items
          );
          model = {};
          model[iKey] = [];
          const result = element._computeArrayProperties(model);
          assert.isUndefined(result);
        });

        it('Handles scalar shape', () => {
          const iKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.items
          );
          const sKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.ScalarShape
          );
          model = {};
          const modelItem = {
            '@type': [sKey],
          };
          model[iKey] = [modelItem];
          const result = element._computeArrayProperties(model);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 1);
          assert.isTrue(result[0].isShape);
        });

        it('Handles UnionShape shape', () => {
          const iKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.items
          );
          const sKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.UnionShape
          );
          model = {};
          const modelItem = {
            '@type': [sKey],
          };
          model[iKey] = [modelItem];
          const result = element._computeArrayProperties(model);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 1);
          assert.isTrue(result[0].isType);
        });

        it('Handles ArrayShape shape', () => {
          const iKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.items
          );
          const sKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.ArrayShape
          );
          model = {};
          const modelItem = {
            '@type': [sKey],
          };
          model[iKey] = [modelItem];
          const result = element._computeArrayProperties(model);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 1);
          assert.isTrue(result[0].isType);
        });

        it('Handles NodeShape shape', () => {
          const iKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.items
          );
          const sKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.NodeShape
          );
          const pKey = element._getAmfKey(element.ns.w3.shacl.property);
          model = {};
          const modelItem = {
            '@type': [sKey],
          };
          const properties = [{}];
          modelItem[pKey] = properties;
          model[iKey] = [modelItem];
          const result = element._computeArrayProperties(model);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 1);
          assert.isTrue(result[0].isShape);
        });

        it('Handles Schemas in shape', () => {
          const iKey = element._getAmfKey(
            element.ns.aml.vocabularies.shapes.items
          );
          const rkey = element._getAmfKey(element.ns.w3.rdfSchema.Seq);
          const skey = element._getAmfKey(element.ns.w3.rdfSchema.key);
          const pKey = element._getAmfKey(element.ns.w3.shacl.property);

          model = {};
          const modelItem = {};
          modelItem[pKey] = [{}];

          model[iKey] = [
            {
              '@type': rkey,
              [`${skey}_1`]: [modelItem],
              [`${skey}_2`]: [modelItem],
              [`${skey}:_1`]: [modelItem],
            },
          ];

          const result = element._computeArrayProperties(model);
          assert.typeOf(result, 'array');
          assert.lengthOf(result, 3);
        });
      });
    });
  });

  describe('_computeIsAnyOf()', () => {
    [
      ['Regular model', false],
      ['Compact model', true],
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let element;
        let amf;

        before(async () => {
          amf = AmfLoader.load(item[1]);
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          await nextFrame();
        });

        it('should return true if range has `or` property', () => {
          const orKey = element._getAmfKey(element.ns.w3.shacl.or);
          const range = { [orKey]: [] };
          assert.isTrue(element._computeIsAnyOf(range));
        });

        it('should return false if range does not have or property', () => {
          const range = {};
          assert.isFalse(element._computeIsAnyOf(range));
        });
      });
    });
  });
});
