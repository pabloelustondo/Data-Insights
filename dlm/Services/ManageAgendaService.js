var config = require('../appconfig.json');
var request = require('request');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var agenda = require('./Agenda');
var ManageApiConfigurations = require('./ManageApiConfigurations');

ManageAgendaService = {
    // ensure job is defined. If not defined, define it
    startAgenda: function (timeInterval, callback) {
        //TODO: Provide a wrapper that allows a user to start agenda/scheduler service

        agenda.on('ready', function () {
            console.log(timeInterval);
            agenda.processEvery(timeInterval + ' seconds');
            agenda.start();
            callback();
        });
    },

    stopAgenda: function () {
        agenda.stop(function() {
            process.exit(0);
        });
    },

    createLocalCache : function () {
        JobManagementService.findJob(config['api_service_job_name'], function (err, result) {
            if(!err){
                console.log(config['api_service_job_name'] + " " + "is not found");
            }else{
                console.log(config['api_service_job_name'] + ":" + result);
            }
            for (var configIdx in result){
                ManageApiConfigurations.addApiConfig(result[configIdx].attrs.data, function (err, result){
                    if (err) {
                        throw new Error ('could not load local cache');
                    } else {
                        console.log( 'localconfigs length = ' + result);
                    }
                });
            }
            console.log(JSON.stringify(result));
        });

    },

    retrieveConfigurations: function () {

        request({
            json: true,
            url : config['ddbUrlGetDataSources'] ,
            qs: {
                'dataSourceType' : config['nextBusSourceType']
            },
            method : 'Get'
        }, function (error, response, body) {
            if (error) {
                next(new Error('error with api response', error));
            }
            if (body) {
                // work with all the enrolled nextbus apis

                // make it ready to be consumed into the job database
                for (var idx in body) {
                    var config = body[idx];
                    var name = config.dataSourceData[0].inputValue; //get the name
                    var url = config.dataSourceData[1].inputValue; // get the url
                    var interval = config.dataSourceData[2].inputValue; // get the interval

                    var configData = {
                        dataSourceId: config.agentId,
                        tenantId: config.tenantId,
                        apiUrl: url,
                        interval: interval,
                        permToken: config.activationKey,
                        expiringToken: ''
                    };

                    var x = configData;

                    // call add config function in ManageJobs to add new ones to the service
                }

                console.log(body.length);
            }
        });
    }

};

function findValueInArray(key, value) {
    return key == value;
}


module.exports = ManageAgendaService;