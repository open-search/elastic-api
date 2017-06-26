const test = require('tape').test;

const searchController = require('../searchController');

const validSearchModel = {
  get: searchObject => Promise.resolve(searchObject),
  getById: searchObject => Promise.resolve(searchObject),
  search: searchObject => Promise.resolve(searchObject),
};

const invalidSearchModel = {
  get: () => Promise.reject('error message'),
  getById: () => Promise.reject('error message'),
  search: () => Promise.reject('error message'),
};

const queryRequest = {
  query: {
    q: '',
    index: 'index',
    type: 'documents',
  },
};

test('searchController getById method with no index, type, or id', (assert) => {
  assert.plan(1);
  const controller = searchController(invalidSearchModel);
  controller
    .getById()
    .catch((error) => {
      assert.equals(error, 'error message', 'should reject');
    });
});

test('searchController getById method with invalid index, type, or id', (assert) => {
  assert.plan(2);
  const controller = searchController(invalidSearchModel);
  const erroneous = controller.getById('index', 'type');
  erroneous.catch((error) => {
    assert.equals(typeof error, 'string', 'error is a string');
    assert.equals(error,
      'error message',
      'should return error message');
  });
});

test('searchController getById method with valid index, type, and id', (assert) => {
  assert.plan(1);
  const controller = searchController(validSearchModel);
  controller.getById('index', 'type', 'id')
    .then((result) => {
      assert.same(result, { index: 'index', type: 'type', id: 'id' },
        'should return an object with expected attributes');
    });
});

// test('searchController moreLikeThis with invalid results', (assert) => {
//   assert.plan(2);
//   const controller = searchController(invalidSearchModel);
//   controller
//     .moreLikeThis()
//     .catch((error) => {
//       assert.equals(typeof error, 'string', 'error is a string');
//       assert.equals(error, 'error message', 'should return error message');
//     });
// });

test('searchController moreLikeThis method with index and documents', (assert) => {
  assert.plan(3);
  const controller = searchController(validSearchModel);
  controller
    .moreLikeThis('index', 'documents')
    .then((result) => {
      assert.equals(typeof result, 'object', 'response is an object');
      assert.equals(result.index, 'index', 'should have correct index');
      assert.equals(result.type, 'documents', 'should have correct type');
    });
});

test('searchController search method with no params', (assert) => {
  assert.plan(1);
  const controller = searchController(invalidSearchModel);
  assert.throws(() => { controller.search(); }, 'error message', 'should throw');
  assert.end();
});

test('searchController search method with empty query string', (assert) => {
  assert.plan(4);
  const controller = searchController(validSearchModel);
  controller
    .search(queryRequest.query)
    .then((result) => {
      assert.equals(typeof result, 'object', 'response is an object');
      assert.equals(result.index, 'index', 'should have correct index');
      assert.equals(result.type, 'documents', 'should have correct type');
      assert.same(result.body.query.bool.must.match_all, {}, 'should have match all object');
    });
});

// test('searchController search method when client error', (assert) => {
//   assert.plan(2);
//   const controller = searchController(invalidSearchModel);
//   controller
//     .search('index', 'type', queryRequest.query)
//     .catch((error) => {
//       assert.equals(typeof error, 'string', 'should return error message');
//       assert.equals(error, 'error message', 'should equal "error message"');
//     });
// });

test('searchController search method with valid query', (assert) => {
  assert.plan(4);
  const controller = searchController(validSearchModel);
  const query = Object.assign({}, queryRequest);
  query.query.q = 'test query';
  controller
    .search(query.query)
    .then((result) => {
      assert.equals(typeof result, 'object', 'response is an object');
      assert.equals(result.index, 'index', 'should have correct index');
      assert.equals(result.type, 'documents', 'should have correct type');
      assert.equals(result.body.query.bool.must.simple_query_string.query,
        'test query', 'should have correct query string');
    });
});

test('searchController search method with from', (assert) => {
  assert.plan(1);
  const query = Object.assign({}, queryRequest);
  query.query.from = 99;
  const controller = searchController(validSearchModel);
  controller
    .search(query.query)
    .then((result) => {
      const from = result.from;
      assert.equals(from, 99, 'should set from to 99');
    });
});

test('searchController search method with size', (assert) => {
  assert.plan(1);
  const query = Object.assign({}, queryRequest);
  query.query.size = 5;
  const controller = searchController(validSearchModel);
  controller
    .search(query.query)
    .then((result) => {
      const size = result.size;
      assert.equals(size, 5, 'should set size to 5');
    });
});

test('searchController search method with invalid size', (assert) => {
  assert.plan(1);
  const query = Object.assign({}, queryRequest);
  query.query.size = 99999;
  const controller = searchController(validSearchModel);
  controller
    .search(query.query)
    .then((result) => {
      const size = result.size;
      assert.equals(size, 50, 'should set size to 50');
    });
});

test('searchController search method with invalid sort', (assert) => {
  assert.plan(1);
  const query = Object.assign({}, queryRequest);
  query.query.sort = 'nonexistant';
  const controller = searchController(validSearchModel);
  controller
    .search(query.query)
    .then((result) => {
      assert.equals(result.sort, undefined, 'should not set sort attribute');
    });
});

test('searchController search method with valid sort', (assert) => {
  assert.plan(1);
  const query = Object.assign({}, queryRequest);
  query.query.sort = 'asc';
  query.query.field = 'foobar';
  const controller = searchController(validSearchModel);
  controller
    .search(query.query)
    .then((result) => {
      const sort = result.body.sort;
      assert.same(sort, [{ foobar: 'asc' }], 'should set sort attribute to object');
    });
});

test('searchController search method with valid range', (assert) => {
  assert.plan(1);
  const query = Object.assign({}, queryRequest);
  query.query.filter = 'beep';
  query.query.gte = 0;
  query.query.lte = 99;
  const controller = searchController(validSearchModel);
  controller
    .search(query.query)
    .then((result) => {
      const filter = result.body.query.bool.filter;
      assert.same(filter, [{ range: { beep: { gte: 0, lte: 99 } } }],
        'should set filter attribute to object');
    });
});
