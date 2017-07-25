const request = require('supertest');
const express = require('express');

const userMockResponse = require('./mock/user-data.json');
const postMockResponse = require('./mock/user-posts.json');
const postV2MockResponse = require('./mock/user-posts-v2.json');

const mocks = {
  'mocks': [{
    'url': '/user/:id',
    'method': 'GET',
    'responseData': userMockResponse,
    'isEligible': true 
  }, {
    'url': '/posts/:id',
    'method': 'GET',
    'responseData': postMockResponse,
    'additionalValidator': customValidator /* optional */,
    'isEligible': true
  }],
  'isEligible': process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'staging'
};

function customValidator (req, res, next) {
  if (req.params.id) {
    res.status(200).json(postV2MockResponse);
    return next(true, res);
  }
  return next(false, null);
}

const mimusMocker = require('../lib')(mocks);
const app = express();
app.get('/user/:id', mimusMocker, function (req, res) {
  res.status(200).json({ name: 'tobi' });
});
app.get('/posts/:id', mimusMocker, function (req, res) {
  res.status(200).json({ title: 'some-post' });
});

describe('GET /user/:id', function () {
  it('respond with mock json', function (done) {
    request(app)
      .get('/user/10')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(userMockResponse, done);
  });
});

describe('GET /posts/:id', function () {
  it('respond with additionalValidator json', function (done) {
    request(app)
      .get('/posts/12')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(postV2MockResponse, done);
  });
});
