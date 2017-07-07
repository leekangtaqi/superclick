import 'babel-polyfill'
import request from 'supertest';
import assert from 'assert';

import app from '../../src/app/app.js';

let mockServer = app.listen(3000)

describe('GET /api/user', () => {
  it('should return 200', done => {
    request(mockServer)
      .get('/api/user/111')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(done)
  })
})