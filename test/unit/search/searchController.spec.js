'use strict';

const test = require('tape').test;
const rewire = require('rewire');
let searchController = rewire('../../../site/search/searchController');
let validSearchModel = {
  getById: (index, type, id) => Promise.resolve({ index: index, type: type, id: id }),
  search: searchObject => Promise.resolve(searchObject),
};
let invalidSearchModel = {
  getById: () => (Promise.reject('error message')),
  search: () => (Promise.reject('error message')),
};
let queryRequest = {
  query: {
    q: '',
    index: 'index',
  },
  params: {
    type: 'documents',
  },
};

test('searchController getById method with no index, type, or id', assert => {
  searchController.__set__('searchModel', invalidSearchModel);
  assert.plan(1);
  searchController
    .getById()
    .catch(error => {
      assert.equals(error, 'error message', 'should reject');
    });
});

test('searchController getById method with invalid index, type, or id', assert => {
  assert.plan(2);
  searchController.__set__('searchModel', invalidSearchModel);
  let erroneous = searchController.getById('index', 'type');
  erroneous.catch(error => {
    assert.equals(typeof error, 'string', 'error is a string');
    assert.equals(error,
      'error message',
      'should return error message');
  });
});

test('searchController getById method with valid index, type, and id', assert => {
  assert.plan(1);
  searchController.__set__('searchModel', validSearchModel);
  let valid = searchController.getById('index', 'type', 'id');
  valid.then(result => {
    assert.same(result, { index: 'index', type: 'type', id: 'id' },
      'should return an object with expected attributes');
  });
});

test('searchController moreLikeThis with invalid results', assert => {
  assert.plan(2);
  searchController.__set__('searchModel', invalidSearchModel);
  searchController
    .moreLikeThis()
    .catch(error => {
      assert.equals(typeof error, 'string', 'error is a string');
      assert.equals(error, 'error message', 'should return error message');
    });
});

test('searchController moreLikeThis method with index and documents', assert => {
  assert.plan(3);
  searchController.__set__('searchModel', validSearchModel);

  searchController
    .moreLikeThis('index', 'documents')
    .then(result => {
      assert.equals(typeof result, 'object', 'response is an object');
      assert.equals(result.index, 'index', 'should have correct index');
      assert.equals(result.type, 'documents', 'should have correct type');
    });

});

test('searchController search method with no params', assert => {
  assert.plan(1);
  searchController.__set__('searchModel', invalidSearchModel);
  assert.throws(() => { searchController.search(); }, 'error message', 'should throw');
  assert.end();
});

test('searchController search method with empty query string', assert => {
  assert.plan(4);
  searchController.__set__('searchModel', validSearchModel);
  searchController
    .search('index', 'documents', queryRequest.query)
    .then(result => {
      assert.equals(typeof result, 'object', 'response is an object');
      assert.equals(result.index, 'index', 'should have correct index');
      assert.equals(result.type, 'documents', 'should have correct type');
      assert.same(result.body.query.bool.must.match_all, {}, 'should have match all object');
    });
});

test('searchController search method when client error', assert => {
  assert.plan(2);
  searchController.__set__('searchModel', invalidSearchModel);
  searchController
    .search('index', 'type', queryRequest.query)
    .catch(error => {
      assert.equals(typeof error, 'string', 'should return error message');
      assert.equals(error, 'error message', 'should equal "error message"');
    });
});

test('searchController search method with valid query', assert => {
  assert.plan(4);
  queryRequest.query.q = 'test query';
  searchController.__set__('searchModel', validSearchModel);
  searchController
    .search('index', 'documents', queryRequest.query)
    .then(result => {
      assert.equals(typeof result, 'object', 'response is an object');
      assert.equals(result.index, 'index', 'should have correct index');
      assert.equals(result.type, 'documents', 'should have correct type');
      assert.equals(result.body.query.bool.must.simple_query_string.query,
        'test query', 'should have correct query string');
    });
});

test('searchController search method with from', assert => {
  assert.plan(1);
  queryRequest.query.from = 99;
  searchController.__set__('searchModel', validSearchModel);
  searchController
    .search('index', 'documents', queryRequest.query)
    .then(result => {
      let from = result.from;
      assert.equals(from, 99, 'should set from to 99');
    });
});

test('searchController search method with size', assert => {
  assert.plan(1);
  queryRequest.query.size = 5;
  searchController.__set__('searchModel', validSearchModel);
  searchController
    .search('index', 'documents', queryRequest.query)
    .then(result => {
      let size = result.size;
      assert.equals(size, 5, 'should set size to 5');
    });
});

test('searchController search method with invalid size', assert => {
  assert.plan(1);
  queryRequest.query.size = 99999;
  searchController.__set__('searchModel', validSearchModel);
  searchController
    .search('index', 'documents', queryRequest.query)
    .then(result => {
      let size = result.size;
      assert.equals(size, 50, 'should set size to 50');
    });
});

test('searchController search method with invalid sort', assert => {
  assert.plan(1);
  queryRequest.query.sort = 'nonexistant';
  searchController.__set__('searchModel', validSearchModel);
  searchController
    .search('index', 'documents', queryRequest.query)
    .then(result => {
      assert.equals(result.sort, undefined, 'should not set sort attribute');
    });
});

test('searchController search method with valid sort', assert => {
  assert.plan(1);
  queryRequest.query.sort = 'asc';
  queryRequest.query.field = 'foobar';
  searchController.__set__('searchModel', validSearchModel);
  searchController
    .search('index', 'documents', queryRequest.query)
    .then(result => {
      let sort = result.body.sort;
      assert.same(sort, [{ foobar: 'asc' }], 'should set sort attribute to object');
    });
});

test('searchController search method with valid range', assert => {
  assert.plan(1);
  queryRequest.query.filter = 'beep';
  queryRequest.query.gte = 0;
  queryRequest.query.lte = 99;
  searchController.__set__('searchModel', validSearchModel);
  searchController
    .search('index', 'documents', queryRequest.query)
    .then(result => {
      let filter = result.body.query.bool.filter;
      assert.same(filter, [{ range: { beep: { gte: 0, lte: 99 } } }],
        'should set filter attribute to object');
    });
});
