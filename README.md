# MimusMocker

MimusMocker is a unified API mocking middleware which can be used for providing API mocks quickly i.e even before writing a single line of actual api into your [Routers](https://expressjs.com/en/guide/routing.html).

## Installation

Install via npm.

```bash
$ npm install mimus-mocker
```

or

Install via git clone

```bash
$ git clone https://github.com/ajaykumarmeher/mimus-mocker.git
$ npm install
```
  
## Documentation
  - Supports configuration based mocking.
  - Allows multi-level controls for quick API testing.
  - Supports custom validations per API.


# In Node.js!

```js
const mimusMocker = require('mimus-mocker');

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

const app = require('express')();
const mimusMocker = require('../lib')(mocks);

app.get('/user/:id', mimusMocker, function (req, res) {
  res.status(200).json({ name: 'tobi' });
});

app.get('/posts/:id', mimusMocker, function (req, res) {
  res.status(200).json({ title: 'some-post' });
});

```

## How to define the mock configuration?

### url(Mandatory)
MimusMocker uses [url-matcher](https://www.npmjs.com/package/url-matcher) for matching urls.

### method(Mandatory)
All the methods like(GET, PUT, POST, DELETE etc.) currently getting supported by Express framework are eligible for validation.

### responseData(Mandatory)
The mock contract for the API.

### additionalValidator(Optional)
This will be a callback for additional validation. 
```anyFunction(req,res,callback)```
* **callback(isOverrideResult, newResponse)**
If `isOverrideResult = true` the `newResponse` will be sent. Else the default data defined in `responseData` will be sent. Use `res` for sending custom response and pass `res` Object as the `newResponse`. 

### isEligible (per mock control)
This is used to control each mock item during development. If `true`, the url will be matched against the api request.

### isEligible (master control)
This is used to control the complete mock feature. eg. the mock should only be enabled for **"staging/dev"** environment. But, should be disabled for **production** environments.

License
----

MIT


**Free Software, Hell Yeah!**

