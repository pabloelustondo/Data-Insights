

var config = require('../appconfig.json');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var agenda = require('./Agenda');

JobManagementService = {
    // ensure job is defined. If not defined, define it
    findJob: function(jobName, callback) {
        agenda.jobs({
            name: config['api_service_job_name']
        }, function (err, job) {
            if (err) {
                callback(err);
            } else {
                callback(null, job);
            }
        });
    },

    findJobByDataSource: function(dataSourceId, callback) {
        agenda.jobs({
            'data.dataSourceId' : dataSourceId
        }, function ( err, result) {
            callback(null, result);
        });
    },

    deleteJobsByDataSource: function(dataSourceId, callback) {
        agenda.cancel({
            'data.dataSourceId' : dataSourceId
        }, function (err, numRemoved) {
            if(err) {
                callback(err);
            } else {
                callback(null, numRemoved);
            }
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