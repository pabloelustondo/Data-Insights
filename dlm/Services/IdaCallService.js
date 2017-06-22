/**
 * Created by vdave on 3/7/2017.
 */

var request = require('request');
var config = require('./../appconfig.json');

IdaCallService  = {
    makeIdaCall:  function(req,  next) {
        request({
            json: true,
            url : config['ida_url'],
            method :  config['ida_url_method'],
            body : req.body,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token' : req.expiringToken
            } }, function(_error, _response, _body) {

            if (!_error ) {
                // console.log( _body);
                if (_response.statusCode === 500) {
                    next (new Error('Token has expired'), null);
                } else {
                    next(null, _body);
                }
            }
            else{
                console.log('yes error');
                next(new Error('error with IDA response', _error));
            }
        });
    }
};


module.exports = IdaCallService;