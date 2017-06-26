const test = require('tape').test;
const request = require('supertest');
const app = require('../../app');

test('swagger', (assert) => {
  assert.plan(1);

  request(app)
    .get('/swagger')
    .expect(200)
    .expect('content-type', 'text/html; charset=UTF-8')
    .end((error, res) => {
      assert.ok(res.text);
    });
});
