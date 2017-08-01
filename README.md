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


# In Node.js
## Example 1(with Router)
```js
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
const mimusMocker = require('mimus-mocker')(mocks);

app.get('/user/:id', mimusMocker, function (req, res) {
  res.status(200).json({ name: 'tobi' });
});

app.get('/posts/:id', mimusMocker, function (req, res) {
  res.status(200).json({ title: 'some-post' });
});
```

## Example 2 (with Middleware)
```js
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
const mimusMocker = require('mimus-mocker')(mocks);
app.use(mimusMocker);
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
```anyFunction(req,res,next)```
* **next(isOverrideResult, newResponse)**
The next function will allow you to process the required action based on your `additonalValidator`. If `isOverrideResult = true` then `newResponse` will be sent. Else the default data defined in `responseData` will be sent. Use `res` for sending custom response and pass `res` Object as the `newResponse`. For more info please check the [examples](#in-nodejs)) given above.
* **req**
If the filter specified with query params like `/test/:id` and the requested path is `api/test/1234/remainingPath` then Mimus will attach the remaining path to `req` and you can access it via `req.remainingPath` which will contain the additional path information if any.

### isEligible (per mock control)
This is used to control each mock item during development. If `true`, the url will be matched against the api request.

### isEligible (master control)
This is used to control the complete mock feature. eg. the mock should only be enabled for **"staging/dev"** environment. But, should be disabled for **production** environments.

License
----

MIT


**Free Software, Hell Yeah!**

