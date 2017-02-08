'use strict';

const test = require('tape').test;
const request = require('supertest');

let env = Object.assign({}, process.env);
let app;

test('setup', function (assert) {
  app = require('../../index');
  assert.end();
});

test('404', assert => {

  assert.plan(2);

  request(app)
    .get('/thisdoesnotexist')
    .expect(404)
    .end((error, res) => {
      assert.ok(res.body.message, 'should return an error object');
      assert.equals(res.body.message, 'Not Found', 'should have a message');
    });

});

test('teardown', function (assert) {
  process.env = Object.assign({}, env);
  assert.end();
});
