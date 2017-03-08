/**
 * Created by vdave on 3/7/2017.
 */
var IdaCallService = require ('./IdaCallService');
var request = require('request');
var config = require('./../appconfig.json');

ApiCallService = {
    send: function(req,  next){
        request({
            json: true,
            url : req.url,
            method : req.method
        }, function (error, response, body) {
            if (error) {
                next(new Error('error with api response', error));
            }
            if (body) {
                // success pass it back to runner which should call api
                IdaCallService.makeIdaCall(body, next)
            }
        });
    }

};


module.exports = ApiCallService;