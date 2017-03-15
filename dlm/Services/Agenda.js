var config = require('../appconfig.json');
var Agenda = require('agenda');
var connectionString = "127.0.0.1:27017/api_schedule";

var agenda = new Agenda({db: { address: connectionString, collection: 'jobs' }});

agenda.define(config['api_service_job_name'], function (job) {
    ApiCallService.send(job, function (err, result) {
         console.log('done' + JSON.stringify(result));
    })
});

module.exports = agenda;