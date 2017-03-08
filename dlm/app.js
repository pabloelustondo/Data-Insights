var express  = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var dbUrl = 'mongodb://127.0.0.1:27017/';
var path = require('path');
var Agenda = require('agenda');
var request = require('request');
var querystring = require('querystring');

var ApiCallService = require('./Services/ApiCallService');

var config = require('./appconfig.json');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var connectionString = "127.0.0.1:27017/api_schedule";
var agenda = new Agenda({db: { address: connectionString, collection: 'jobs' }});

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
            console.log('enter ida call');
            if (!_error ) {
                console.log(_body);
                next();
            }
            else{
                console.log('yes error');
                next(new Error('error with IDA response', _error));
            }
        });
    }
};

ApiCallService2 = {
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


/*


agenda.define('sm1', function(job, done) {
    var req = {
        url:  'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
        method: 'GET'
    };
    ApiCallService.send(req, function(err,result) {
        if(err) {
            console.log('error from: ' + 1);
            done(err);
        } else {
            console.log('1');
            done();
        }
    });
});


agenda.define('sm2', function(job, done) {
    var req = {
        url:  'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
        method: 'GET'
    };
    ApiCallService.send(req,  function(err,result) {
        if(err) {
            console.log('error from: ' + 2);
            done(err);
        } else {
            console.log('2');
            done();
        }
    });
});


agenda.define('sm4', function(job, done) {
    var req = {
        url:  'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
        method: 'GET'
    };
    ApiCallService.send(req,  function(err,result) {
        if(err) {
            console.log('error from: ' + 4);
            done(err);
        } else {
            console.log('4');
            done();
        }
    });
});

agenda.define('sm3', function(job, done) {
    var req = {
        url:  'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
        method: 'GET'
    };
    ApiCallService.send(req,  function(err,result) {
        if(err) {
            console.log('error from: ' + 3);
            done(err);
        } else {
            console.log('3');
            done();
        }
    });
});

agenda.define('sm6', function(job, done) {
    console.log('enter sm6');
    var req = {
        url:  'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
        method: 'GET'
    };
    ApiCallService.send(req, function(result) {
            console.log('6');
            console.log(result);
            done();
    });
});



agenda.on('ready',function() {

    agenda.stop();
    console.log('start');
    agenda.every('3 seconds', 'sm6');
    agenda.start();
});

agenda.on('error', function () {
    console.log('mongo connection process has thrown an error');
});

function graceful() {
    agenda.stop(function() {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);
agenda.processEvery('1 seconds');

*/

setInterval(function() {

    console.log('enter sm6');
    var req = {
        url:  'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
        method: 'GET'
    };
    ApiCallService.send(req, function(result) {
        console.log('6');
        console.log(result);
      //  done();
    });

}, 10000);
