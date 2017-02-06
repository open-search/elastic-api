'use strict';

const test = require('tape').test;
const rewire = require('rewire');
let searchModel = rewire('../../../site/search/searchModel');

const validClient = {
  search: () => new Promise((resolve) => {
    resolve({
      hits: {
        hits: [1, 2, 3],
      },
    });
  }),
  get: () => new Promise((resolve) => {
    resolve({
      hits: {
        hits: [1, 2, 3],
      },
    });
  }),
};

const invalidClient = {
  search: () => new Promise((resolve, reject) => {
    reject({ message: 'error message' });
  }),
};

test('searchModel.search should reject an object with message attribute', t => {

  searchModel.__set__('client', invalidClient);

  t.plan(1);

  searchModel
    .search('index', 'type', 'query', 0, 5)
    .catch(error => {
      t.equal(error, 'error message');
      t.end();
    });

});

test('searchModel.search should return an object with hits', t => {

  searchModel.__set__('client', validClient);

  t.plan(1);

  searchModel
    .search('index', 'type', 'query', 0, 5)
    .then(result => {
      t.deepEqual(result, { hits: { hits: [1, 2, 3] } });
      t.end();
    });

});

test('searchModel.getById should return an object with hits', t => {

  searchModel.__set__('client', validClient);

  t.plan(1);

  searchModel
    .getById('index', 'type', 'id')
    .then(result => {
      t.deepEqual(result, { hits: { hits: [1, 2, 3] } });
      t.end();
    });

});
