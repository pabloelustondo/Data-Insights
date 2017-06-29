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
var globalConfig = require('./globalconfig.json');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// var connectionString = "127.0.0.1:27017/api_schedule";
//var agenda = new Agenda({db: { address: connectionString, collection: 'jobs' }});
var agenda = require('./Services/Agenda');

ManageApiConfigurations.clearAllConfigs(function (err, length) {
   if (length === 0) {
       ManageAgendaService.startAgenda(0.1, function () {
           ManageAgendaService.createLocalCache(); // retrieve the local cache
          // setInterval(function(){
          //     ManageAgendaService.retrieveConfigurations(); //periodically get updates from mongodb
          // },6000);
       }); //process agenda request every 0.1 second
   } else {
       throw new Error('could not reset configs, server stopping ....');
   }
});

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

app.use(bodyParser.json());

app.post('/newUrlConfig', function (req, res) {

    var data = req.body;

    if (!data.dataSourceId) {
        res.status(500).send('missing dataSourceId');
    } else {

        JobManagementService.findJobByDataSource(data.dataSourceId, function (e, result) {

            if (result) {
                res.status(500).send('This data source has already been registered, please update or contact soti support');
            }
            if (!result) {
                JobManagementService.addJob(data, function (err, success) {
                    if (err) {
                        res.status(400).send('could not add api. Please contact SOTI support: ' + err.message);
                    }

                    if (success) {
                        ManageApiConfigurations.addApiConfig(data, function (_err, result) {
                            if (_err) {
                                res.status(500).send('could not update local cache');
                            }
                            if (result) {
                                res.status(200).send('job is successfully scheduled.');
                            }
                        });

                    }
                });
            }
        });
    }
});

app.post('/deleteDataSource', function (req, res) {
    // disable any active service first
        // get agent and job
        // call service to disable job
        JobManagementService.disableJob(req.query.agentId, function (err, _res) {
            if (_res){
                JobManagementService.removeJob(req.query.agentId, function (e, r) {
                    if (e) {
                        res.status(400).send("Error deleting this job");
                    } else {
                        res.status(200).send(r);
                    }
                })
            }
            if (err){
                res.status(500).send(err.message);
            }
        });
        console.log('hello');



    // delete data source after

        // remove the information from local storage
        // call the agenda to delete the job

    // call DDB to delete the configuration from overall all services
});

app.listen(config['port']);
