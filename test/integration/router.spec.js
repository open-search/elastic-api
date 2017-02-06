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

test('500', { skip: true }, assert => {

  assert.plan(2);

  app.get('/error', (req, res, next) => {
    next(new Error('Something broked'));
  });

  request(app)
    .get('/error')
    .expect(500)
    .end((error, res) => {
      assert.ok(res.body.message, 'should return an error object');
      assert.equals(res.body.message, 'Something broked', 'should have a message');
    });

});

test('teardown', function (assert) {
  process.env = Object.assign({}, env);
  assert.end();
});
