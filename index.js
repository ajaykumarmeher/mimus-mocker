/**
 * Created by ajay.meher on 28/06/17.
 */
"use strict";


let matchPattern= require('url-matcher').matchPattern;


module.exports = mimusMocker;


function mimusMocker(options) {

    return function _mimusMocker(req, res, next) {
        let result = undefined;

        if (options && options.isEligible === true && options.mocks && Array.isArray(options.mocks)) {
            let shouldWait = false;

            for (let i = 0; i < options.mocks.length; i++) {
                if ((options.mocks[i] === undefined || options.mocks[i].isEligible === true) && req.method === options.mocks[i].method && matchPattern(options.mocks[i].url, req.originalUrl)) {
                    console.log("mimus matched for [Url] : " + options.mocks[i].url + " , with original url : " + req.originalUrl);
                    result = options.mocks[i].responseData;

                    if(options.mocks[i].additionalValidator){
                        shouldWait = true;

                        options.mocks[i].additionalValidator(req,res, (isOverrideResult, updatedRes)=>{
                            if(isOverrideResult === true){
                            return updatedRes;
                        } else{
                            return res.status(200).json(result);
                        }
                    });

                        break;
                    }else{
                        return res.status(200).json(result);
                    }
                }
            }

            if(!shouldWait){
                next();
            }

        }else{
            next();
        }
    }
}

