
var Agenda = require('agenda');
var config = require('../appconfig.json');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var connectionString = "127.0.0.1:27017/api_schedule";
var agenda = new Agenda({db: { address: connectionString, collection: 'jobs' }});

JobManagementService = {
    // ensure job is defined. If not defined, define it
    startJob: function(jobName, callback) {
        agenda.db.jobs({
            name: config['api_service_job_name']
        }, function (err, job) {

        });
    },

    addJob: function(jobData, callback) {
        var job = agenda.create( config['api_service_job_name'], {
            url: jobData.url,
            method: jobData.method,
            dataSourceId: jobData.dataSourceId
        });
        job.repeatEvery(jobData.interval + ' seconds');
        job.enable();
        job.save(function (err) {
            if (err){
                callback(err);
            } else {
                callback();
            }
        });

    },

    removeJob: function(job, callback) {
        job.remove(function(err) {
            if(!err) {
                console.log('successfully removed job from collection');
                callback();
            }
        });
    },

    updateJob: function(job, callback) {
        //TODO: implement
    },

    enableJob: function(job, callback) {
        job.enable();
    },

    disableJob: function(job, callback) {
        job.disableJob();
    }
};

module.exports = JobManagementService;