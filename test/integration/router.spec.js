'use strict';

const nock = require('nock');
const test = require('tape').test;
const request = require('supertest');

let env = Object.assign({}, process.env);
let app;

test('setup', function (t) {
  app = require('../../index');
  t.end();
});

test('404', t => {

  t.plan(1);

  request(app)
    .get('/thisdoesnotexist')
    .expect(404)
    .end((error, res) => {
      t.equals(typeof error, 'object',
        'should return an error object');
      t.end();
    });

});

test('teardown', function (t) {
  process.env = Object.assign({}, env);
  t.end();
});
