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
var JobManagementService = require('./Services/JobManagementService');

var config = require('./appconfig.json');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var connectionString = "127.0.0.1:27017/api_schedule";
var agenda = new Agenda({db: { address: connectionString, collection: 'jobs' }});



ScheduleService = {
    AddEventSchedule: function(req,  next){
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

ApiService = {
    log: function(data, callback) {
        console.log('data received = ' + data);
        callback();
    }
};



// define job processor
agenda.define('say hello', function (job) {
    ApiService.log(job.attrs.data.url, function(err, result) {
        if(err) {
            done(err);
        } else {
            done();
        }
    });
});


agenda.define(config['api_service_job_name'], function (job) {
    ApiCallService.log(job, function () {
        console.log('done');
    })
});

function testJob (jobProperties, next) {

    var req = {
        url: jobProperties.url,
        method: jobProperties.method
    };
    console.log( 'will send: ' + JSON.stringify(req));
    next();
    /*
    ApiCallService.send(req, function (result) {
        console.log( (new Date().toISOString()) +':' + jobProperties.url );
        console.log(result);
        next();
    })*/
}

function defineJob(name, next) {
    agenda.define('randomJob: ' + name, testJob({
        url: name,
        method : 'get'
    }, next));
}
/*
setInterval(function() {
    var jobData = {
        url: 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
        method: 'GET',
        dataSourceId: 'varun dave test data source',
        interval: 10
    };

    JobManagementService.addJob(jobData, function(err, response){
        console.log('check db');
    })




}, 15000);

setInterval(function() {

    /*
    var jobid = Math.random().toString();
    // create job data
    var job = agenda.create('say hello', {
        url: jobid,
        method: 'get'
    });
    var interval = Math.floor(Math.random() * (15 - 5 + 1) + 5).toString();
    job.repeatEvery(interval + ' seconds');
    job.enable();
    job.save(function (err) {
        console.log('saved job :' + jobid);
    });
    */
//    agenda.every();
    // save job

    // run job


/*
    var jobid = Math.random().toString();

    defineJob(jobid,  function () {
        console.log('registered job : ' + jobid );
        var interval = Math.floor(Math.random() * (60 - 30 + 1) + 30).toString();
        console.log(interval);
        var job = agenda.create(jobid, {'x' : 'y'});

        agenda.every(interval + ' seconds', jobid  );
        job.save();
    });

   /* var req = {
        url:  'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
        method: 'GET'
    };
    ApiCallService.send(req, function(result) {
        console.log('6');
        console.log(result);
      //  done();
    });

}, 15000);*/

agenda.on('ready', function () {
    agenda.start();
    agenda.processEvery('1 second');
  /*  agenda.on('start', function(job) {
        console.log("Job %s starting", job.attrs.name);
    }); */
});

function graceful() {
    agenda.stop(function() {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);