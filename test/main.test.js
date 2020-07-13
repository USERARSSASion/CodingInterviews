const request = require('supertest');

describe('#test server', function() {
  it('#test GET /', async () => {
    let res = await request('http://localhost')
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200, 'success');
  });
  
  it('#test POST /', async () => {
    let res = await request('http://localhost')
      .post('/loadShortUrl')
      .send({originalUrl:'http://baidu.com'})
      .expect('Content-Type', /json/)
      .expect(200, {code: 200, "shortUrl": "BcDlR1"});
  });
  
  it('#test get /', async () => {
    let res = await request('http://localhost')
      .get('/BcDlR1')
      .expect('Content-Type', /json/)
      .expect(200, {code: 200, "originalUrl": "http://baidu.com"});
  });
});
