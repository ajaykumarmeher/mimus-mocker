/**
 * Created by ajay.meher on 28/06/17.
 */
'use strict';

const matchPattern = require('url-matcher').matchPattern;

module.exports = function (options) {

  return function _mimusMocker (req, res, next) {
    if (!options
        || !options.isEligible
        || (options.mocks && !Array.isArray(options.mocks)))
      next();

    let shouldWait = false;
    for (let i = 0; i < options.mocks.length; i++) {
      let result;
      const mock = options.mocks[i];

      if (mock && mock.isEligible
          && req.method === mock.method) {

        let matchedResult = matchPattern(mock.url, req.originalUrl);

        if(matchedResult){
          if(matchedResult.paramNames && matchedResult.paramNames.length > 0){
            _embedParams(req, matchedResult);
          }

          result = mock.responseData || {};

          if (mock.additionalValidator) {
            shouldWait = true;
            mock.additionalValidator(req, res, function(overrideResult, updatedRes){
              return overrideResult ? updatedRes : res.status(200).json(result);
            });
            break;
          }else{
            return res.status(200).json(result);
          }
        }
      }
    }
    if (!shouldWait) next();
  }
};

// embed params as user might have applied Mimus directly.
function _embedParams(req, matchedResult){
  if(matchedResult){
    if(matchedResult.paramNames && matchedResult.paramNames.length > 0){
      for (let i = 0; i < matchedResult.paramNames.length; i++) {
          req.params[matchedResult.paramNames[i]+""] = matchedResult.paramValues[i];
      }
    }

    if(matchedResult.remainingPathname){
      req.remainingPath = matchedResult.remainingPathname;
    }
  }
}
