const test = require('tape').test;
const model = require('../searchModel');

const validClient = {
  search: () => Promise.resolve({
    hits: {
      hits: [1, 2, 3],
    },
  }),
  get: () => Promise.resolve({
    hits: {
      hits: [1, 2, 3],
    },
  }),
};

const invalidClient = {
  search: () => Promise.reject({ message: 'error message' }),
};

test('searchModel.search should reject an object with message attribute', (assert) => {
  const searchModel = model(invalidClient);

  assert.plan(1);

  searchModel
    .search('index', 'type', 'query', 0, 5)
    .catch((error) => {
      assert.equal(error, 'error message');
      assert.end();
    });
});

test('searchModel.search should return an object with hits', (assert) => {
  const searchModel = model(validClient);

  assert.plan(1);

  searchModel
    .search('index', 'type', 'query', 0, 5)
    .then((result) => {
      assert.deepEqual(result, { hits: { hits: [1, 2, 3] } });
      assert.end();
    });
});

test('searchModel.getById should return an object with hits', (assert) => {
  const searchModel = model(validClient);

  assert.plan(1);

  searchModel
    .getById('index', 'type', 'id')
    .then((result) => {
      assert.deepEqual(result, { hits: { hits: [1, 2, 3] } });
      assert.end();
    });
});
