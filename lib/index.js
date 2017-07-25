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
          && req.method === mock.method
          && matchPattern(mock.url, req.originalUrl)) {
        result = mock.responseData || {};

        if (mock.additionalValidator) {
          shouldWait = true;
          mock.additionalValidator(req, res, (overrideResult, updatedRes) => {
            return overrideResult ? updatedRes : res.status(200).json(result);
          });
          break;
        }
        return res.status(200).json(result);
      }
    }
    if (!shouldWait) next();
  }
}
