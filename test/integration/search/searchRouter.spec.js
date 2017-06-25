const nock = require('nock');
const test = require('tape').test;
const request = require('supertest');
const app = require('../../../api/app');

const exampleUrl = 'http://example:9200';

test('Search Router: return error message when invalid elasticsearch client', (assert) => {
  const invalid = nock(exampleUrl)
    .post('/testindex/all/_search')
    .replyWithError({ error: { message: 'some terrible error' } });

  assert.plan(2);

  request(app)
    .get('/search?q=test&index=testindex&type=testtype')
    .expect(500)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      assert.equals(typeof res.body.error, 'object', 'should return an error object');
      assert.equals(typeof res.body.error.message, 'string', 'error object should have a message');
      invalid.done();
      return assert.end();
    });
});

test('Search Router: return default search with no query', (assert) => {
  const standard = nock(exampleUrl)
    .post('/_search?type=all')
    .reply(200, {
      hits: {
        hits: [1, 2, 3],
      },
    });

  assert.plan(1);

  request(app)
    .get('/search')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      standard.done();
      assert.deepEqual(res.body, { hits: { hits: [1, 2, 3] } }, 'should return expected value');
      return assert.end();
    });
});

test('Search Router: return 200 with query, defaults to search all', (assert) => {
  const standard = nock(exampleUrl)
    .post('/_search?type=all')
    .reply(200, {
      hits: {
        hits: [1, 2, 3],
      },
    });

  assert.plan(1);

  request(app)
    .get('/search?q=test')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      standard.done();
      assert.deepEqual(res.body, { hits: { hits: [1, 2, 3] } }, 'should return expected value');
      return assert.end();
    });
});

test('Search with query params should return results', (assert) => {
  const query = nock(exampleUrl)
    .post('/_search?type=all&from=10&size=10')
    .reply(200, {
      hits: {
        hits: [1, 2, 3],
      },
    });

  assert.plan(1);

  request(app)
    .get('/search?q=test&filter=myfilter&lte=10&gte=0&size=10&field=test&order=asc&from=10')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      assert.deepEqual(res.body, { hits: { hits: [1, 2, 3] } }, 'should return expected value');
      query.done();
      return assert.end();
    });
});

test('Search with size greater than default should return default', (assert) => {
  const query = nock(exampleUrl)
    .post('/_search?type=all&from=10&size=50')
    .reply(200, {
      hits: {
        hits: [1, 2, 3],
      },
    });

  assert.plan(1);

  request(app)
    .get('/search?q=test&filter=myfilter&lte=10&gte=0&size=100&field=test&order=asc&from=10')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      assert.deepEqual(res.body, { hits: { hits: [1, 2, 3] } }, 'should return expected value');
      query.done();
      return assert.end();
    });
});

test('Get by id returns 200 when valid params', (assert) => {
  const id = nock(exampleUrl)
    .get('/test/documents/123')
    .reply(200, {
      hits: {
        hits: [1],
      },
    });

  assert.plan(1);

  request(app)
    .get('/search/test/documents/123')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      id.done();
      assert.deepEqual(res.body, { hits: { hits: [1] } });
      return assert.end();
    });
});

test('Get by id with invalid elasticsearch client', (assert) => {
  const invalid = nock(exampleUrl)
    .get('/test/documents/123')
    .replyWithError({ error: { message: 'some terrible error' } });

  assert.plan(2);

  request(app)
    .get('/search/test/documents/123')
    .expect(500)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      invalid.done();
      assert.equals(typeof res.body.error, 'object', 'should have an error object');
      assert.equals(typeof res.body.error.message, 'object', 'should contain elastic error object');
      return assert.end();
    });
});

test('More like this: return 200 when valid params', (assert) => {
  const valid = nock(exampleUrl)
    .post('/test/documents/_search?_source=title')
    .reply(200, {
      hits: {
        hits: [1],
      },
    });

  assert.plan(1);

  request(app)
    .get('/more?index=test&type=all&q=test')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      valid.done();
      assert.deepEqual(res.body, { hits: { hits: [1] } });
      return assert.end();
    });
});

test('More like this error message when invalid elasticsearch client', (assert) => {
  const mlt = nock(exampleUrl)
    .post('/test/documents/_search?_source=title')
    .replyWithError({ error: { message: 'some terrible error' } });

  assert.plan(2);

  request(app)
    .get('/more?index=test&type=all&q=test')
    .expect(500)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      mlt.done();
      assert.equals(typeof res.body.error, 'object');
      assert.equals(typeof res.body.error.message, 'string');
      return assert.end();
    });
});
