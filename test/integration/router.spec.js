const test = require('tape').test;
const request = require('supertest');
const app = require('../../api/app');

test('404', (assert) => {
  assert.plan(2);

  request(app)
    .get('/thisdoesnotexist')
    .expect(404)
    .end((error, res) => {
      assert.ok(res.body.message, 'should return an error object');
      assert.equals(res.body.message, 'Not Found', 'should have a message');
    });
});
