'use strict';

const nock = require('nock');
const test = require('tape').test;
const request = require('supertest');

let env = Object.assign({}, process.env);
let app;

test('setup', function (t) {
  process.env.PORT = 3000;
  process.env.ELASTICSEARCH_HOST = 'http://example';
  process.env.ELASTICSEARCH_PORT = 9200;
  app = require('../../../index');
  t.end();
});

test('Indices endpoint', assert => {

  assert.plan(2);

  nock('http://example:9200')
    .get('/_cat/indices?format=json')
    .replyWithError({ error: { message: 'some terrible error' } });

  request(app)
    .get('/indices')
    .expect(500)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      assert.equals(typeof res.body.error, 'object', 'should return error object');
      assert.equals(typeof res.body.error.message, 'object', 'should have error message object');
    });

});

test('Indices endpoint', assert => {

  assert.plan(1);

  let successArray = [{
      health: 'yellow',
      status: 'open',
      index: 'test',
      uuid: 'unique1',
      pri: '5',
      rep: '1',
      'docs.count': '24',
      'docs.deleted': '0',
      'store.size': '10.2mb',
      'pri.store.size': '10.2mb',
    },
    {
      health: 'green',
      status: 'open',
      index: 'test2',
      uuid: 'unique2',
      pri: '1',
      rep: '1',
      'docs.count': '3',
      'docs.deleted': '0',
      'store.size': '9.1kb',
      'pri.store.size': '9.1kb',
    },
  ];

  nock('http://example:9200')
    .get('/_cat/indices?format=json')
    .reply(200, successArray);

  request(app)
    .get('/indices')
    .expect(200)
    .end((error, res) => {
      if (error) {
        return assert.end(error);
      }

      assert.deepEquals(res.body, successArray, 'should return result array');
    });

});

test('teardown', function (t) {
  process.env = Object.assign({}, env);
  t.end();
});
