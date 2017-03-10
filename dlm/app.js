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
var ManageAgendaService = require('./Services/ManageAgendaService');
var ManageApiConfigurations = require('./Services/ManageApiConfigurations');

var config = require('./appconfig.json');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// var connectionString = "127.0.0.1:27017/api_schedule";
//var agenda = new Agenda({db: { address: connectionString, collection: 'jobs' }});
var agenda = require('./Services/Agenda');



// define job processor
/*
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

*/
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




}, 15000); */

/*
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

}, 15000);

 */
/*
var config1 = {
    dataSourceId : 'varun dave test data source',
    tenantId : 'external_test_user',
    apiUrl : 'varun',
    interval : 5,
    permToken : '',
    expiringToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6ImV4dGVybmFsX3Rlc3RfdXNlciIsImFnZW50aWQiOiJ2YXJ1biB0ZXN0IGRhdGEwLjA1OTc1MDc1MzMyNzQ4NTkyIiwiaWF0IjoxNDg5MTU4MjIwLCJleHAiOjE0ODkxNTk3MjB9.KBh9xzRHG2BpYQUYwcSb2Haxrag4hu8YXuVoSNf9D1U'
};
var config2 = {
    dataSourceId : 'varun test data' + Math.random(),
    tenantId : 'external_test_user',
    apiUrl : 'varun',
    interval : 5,
    permToken : '',
    expiringToken : ''
};
var config3 = {
    dataSourceId : 'varun test data' + Math.random(),
    tenantId : 'external_test_user',
    apiUrl : 'varun',
    interval : 5,
    permToken : '',
    expiringToken : ''
};
ManageApiConfigurations.addApiConfig(config1, function (){
    ManageApiConfigurations.printConfigs();
});

ManageApiConfigurations.addApiConfig(config2, function (){
    ManageApiConfigurations.printConfigs();
});

ManageApiConfigurations.addApiConfig(config3, function (){
    ManageApiConfigurations.printConfigs();
});

ManageApiConfigurations.retrieveNewExpToken(config1.dataSourceId, function () {
    ManageApiConfigurations.printConfigs();
});
*/

ManageAgendaService.startAgenda(0.1); //process agenda request every second

process.on('SIGTERM', function () {
    agenda.stop(function() {
        process.exit(0);
    });
});
process.on('SIGINT' , function () {
    agenda.stop(function() {
        process.exit(0);
    });
});

//app.listen(config['port']);