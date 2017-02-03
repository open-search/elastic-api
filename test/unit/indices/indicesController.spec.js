'use strict';

const test = require('tape').test;
const rewire = require('rewire');

let indicesController = rewire('../../../site/indices/indicesController');

test('indicesController with client error', assert => {
  assert.plan(1);
  let errorMessage = 'some error';
  let invalidClient = {
    cat: {
      indices: (format, callback) => {
        callback(errorMessage);
      },
    },
  };
  indicesController.__set__('client', invalidClient);
  indicesController.getIndices()
    .catch(error => {
      assert.equals(error, errorMessage, 'should reject error message');
    });
});

test('indicesController with valid client', assert => {
  assert.plan(1);
  let validResult = {
    a: 1, b: 2,
  };
  let invalidClient = {
    cat: {
      indices: (format, callback) => {
        callback(null, validResult);
      },
    },
  };
  indicesController.__set__('client', invalidClient);
  indicesController.getIndices()
    .then(result => {
      assert.deepEquals(result, validResult, 'should return valid result');
    });
});
