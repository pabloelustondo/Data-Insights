/**
 * Created by vdave on 3/7/2017.
 */

var request = require('request');
var config = require('./../appconfig.json');

IdaCallService  = {
    makeIdaCall:  function(data,  next) {
        request({
            json: true,
            url : config['ida_url'],
            method :  config['ida_url_method'],
            body : data,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZ2VudGlkIjoiMjEzIiwidGVuYW50aWQiOiJ4eXphMTIiLCJpYXQiOjE0ODc4Nzk1NTcsImV4cCI6MTQ5NTA3OTU1N30.TnX4J-xSBGxvgSd2CO5CCMZvQ4TBHJX5Ne4Ioy6A2Kk'
            } }, function(_error, _response, _body) {

            if (!_error ) {
                // console.log( _body);
                next(_body);
            }
            else{
                console.log('yes error');
                next(new Error('error with IDA response', _error));
            }
        });
    }
};


module.exports = IdaCallService;