const test = require('tape').test;

const errorClient = {
  cat: {
    indices: (format, callback) => {
      callback('some error');
    },
  },
};

const invalidClient = {
  cat: {
    indices: (format, callback) => {
      callback(null, { a: 1, b: 2 });
    },
  },
};

const errorIndicesController = require('../../../site/indices/indicesController')(errorClient);
const invalidIndicesController = require('../../../site/indices/indicesController')(invalidClient);

test('indicesController with client error', (assert) => {
  assert.plan(1);
  errorIndicesController.getIndices()
    .catch((error) => {
      assert.equals(error, 'some error', 'should reject error message');
    });
});

test('indicesController with valid client', (assert) => {
  assert.plan(1);
  const validResult = {
    a: 1, b: 2,
  };

  invalidIndicesController.getIndices()
    .then((result) => {
      assert.deepEquals(result, validResult, 'should return valid result');
    });
});
