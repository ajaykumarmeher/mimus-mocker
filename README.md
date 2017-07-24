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

```
let mimusMocker = require(mimus-mocker);



let mocks = {
    "mocks": [{
        "url": "/api/v1/testapp/api1",
        "method":"GET",
        "responseData": require('path/to/your/mock/file/for/api1.json'),
        "additionalValidator":api1Validator /*optional*/,
        "isEligible": true 
    },{
        "url": "/api/v1/testapp/settings",
        "method":"PUT",
        "responseData": require('path/to/your/mock/file/for/settings.json'),
        "isEligible": false
    }],
    "isEligible": process.env.NODE_ENV === undefined || process.env.NODE_ENV === "staging"
};

// additional validator is useful for adding custom validations before returning the default responseData. You can also override the default response based on request data for same url.

function api1Validator(req,res, callback) {
    // check additional request like
    let queryParams =request.query;
    
    if(queryParams.test1 === true){
        // override the default response as per your requirement.
        // let customResponseData = require('your/conditional/based/mock/response.json');
        // you can also use the above.
        res.status(200).json({
                    message: 'custom response.'
                });
                
        return callback(true/*overide*/,res);
    }else{
        return callback(false, null);
    }
}

// must register before registering any specific routers.
app.use(mimusMocker(mocks));
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

