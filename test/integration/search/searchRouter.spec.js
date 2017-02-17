'use strict';

const nock = require('nock');
const test = require('tape').test;
const request = require('supertest');

let env = Object.assign({}, process.env);
let app;
let exampleUrl = 'http://example:9200';

test('setup', function (t) {
  process.env.PORT = 3000;
  process.env.ELASTICSEARCH_HOST = 'http://example';
  process.env.ELASTICSEARCH_PORT = 9200;
  app = require('../../../index');
  t.end();
});

test('Search Router: return error message when invalid elasticsearch client', t => {

  nock(exampleUrl)
    .post('/testindex/_search')
    .replyWithError({ error: { message: 'some terrible error' } });

  t.plan(2);

  request(app)
    .get('/search?q=test&index=testindex&type=testtype')
    .expect(500)
    .end((error, res) => {
      if (error) {
        return t.end(error);
      }

      t.equals(typeof res.body.error, 'object');
      t.equals(typeof res.body.error.message, 'string');
      t.end();
    });

});

test('Search Router: return default search with no query', t => {

  nock(exampleUrl)
    .post('/_search?type=documents')
    .reply(200, {
      hits: {
        hits: [1, 2, 3],
      },
    });

  t.plan(1);

  request(app)
    .get('/search')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return t.end(error);
      }

      t.deepEqual(res.body, { hits: { hits: [1, 2, 3] } });
      t.end();
    });

});

test('Search Router: return 200 with query, defaults to search all', t => {

  nock(exampleUrl)
    .post('/_search?type=documents')
    .reply(200, {
      hits: {
        hits: [1, 2, 3],
      },
    });

  t.plan(1);

  request(app)
    .get('/search?q=test')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return t.end(error);
      }

      t.deepEqual(res.body, { hits: { hits: [1, 2, 3] } });
      t.end();
    });

});

test('Search with query params should return results', t => {

  nock(exampleUrl)
    .post('/_search?type=documents&from=10&size=10')
    .reply(200, {
      hits: {
        hits: [1, 2, 3],
      },
    });

  t.plan(1);

  request(app)
    .get('/search?q=test&filter=myfilter&lte=10&gte=0&size=10&field=test&order=asc&from=10')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return t.end(error);
      }

      t.deepEqual(res.body, { hits: { hits: [1, 2, 3] } });
      t.end();
    });

});

test('Get by id returns 200 when valid params', t => {

  nock(exampleUrl)
    .get('/test/documents/123')
    .reply(200, {
      hits: {
        hits: [1],
      },
    });

  t.plan(1);

  request(app)
    .get('/search/test/documents/123')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return t.end(error);
      }

      t.deepEqual(res.body, { hits: { hits: [1] } });
      t.end();
    });

});

test('Get by id with invalid elasticsearch client', t => {

  nock(exampleUrl)
    .get('/test/documents/123')
    .replyWithError({ error: { message: 'some terrible error' } });

  t.plan(2);

  request(app)
    .get('/search/test/documents/123')
    .expect(500)
    .end((error, res) => {
      if (error) {
        return t.end(error);
      }

      t.equals(typeof res.body.error, 'object', 'should have an error object');
      t.equals(typeof res.body.error.message, 'object', 'should contain elastic error object');
      t.end();
    });

});

test('More like this: return 200 when valid params', t => {

  nock(exampleUrl)
    .post('/test/documents/_search?_source=title')
    .reply(200, {
      hits: {
        hits: [1],
      },
    });

  t.plan(1);

  request(app)
    .get('/more?index=test&type=documents&q=test')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return t.end(error);
      }

      t.deepEqual(res.body, { hits: { hits: [1] } });
      t.end();
    });

});

test('More like this error message when invalid elasticsearch client', t => {

  nock(exampleUrl)
    .post('/test/documents/_search?_source=title')
    .replyWithError({ error: { message: 'some terrible error' } });

  t.plan(2);

  request(app)
    .get('/more?index=test&type=documents&q=test')
    .expect(500)
    .end((error, res) => {
      if (error) {
        return t.end(error);
      }

      t.equals(typeof res.body.error, 'object');
      t.equals(typeof res.body.error.message, 'string');
      t.end();
    });

});

test('teardown', function (t) {
  process.env = Object.assign({}, env);
  t.end();
});
