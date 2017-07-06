var request = require('request');
var config = require('./../appconfig.json');
var _ = require('underscore');
var jwt = require('jsonwebtoken');


var localConfigs = [];

ManageApiConfigurations = {


    loadApis: function (callback) {

        JobManagementService.findJob(config['api_service_job_name'], function (err, result) {
            for (var configIdx in result){
               this.addApiConfig(result[configIdx].attrs.data, function (err, result){
                    if (err) {
                        throw new Error ('could not load local cache');
                    } else {
                        console.log( 'localconfigs length = ' + result);
                        callback(localConfigs.length);
                    }
                });
            }

        });
    },

    addApiConfig: function  (data, callback){
        var sourceConfig = {
            agentId : data.dataSourceId,
            tenantId : data.tenantId,
            url : data.url,
            interval : data.interval,
            permToken : data.permToken,
            expiringToken : data.expiringToken,

            //TODO: introduce data.dataSetId
            dataSetId: "nextBusId" + data.url
        };

        var localConfig = _.find(localConfigs, {
            agentId : data.dataSourceId
        });

        if (!localConfig){
            localConfigs.push(sourceConfig);
            callback(null,localConfigs.length);
         } else {
            callback(localConfig, null);
        }
    },

    clearAllConfigs: function( callback) {
        localConfigs.length = 0;
        callback(null, localConfigs.length);
    },

    printConfigs: function () {
        console.log(JSON.stringify(localConfigs));
    },

    retrieveNewExpToken: function(dataSourceId, callback) {
        var sourceConfig = _.find(localConfigs, {
            agentId : dataSourceId
        });

        if (sourceConfig) {
            var tokenPayload = {
                tenantid : sourceConfig.tenantId,
                agentid : sourceConfig.agentId
            };

            var token = jwt.sign(tokenPayload, config.secret, {expiresIn: config.tempTokenExpiryTime});
            sourceConfig.expiringToken = token;

            callback(null, token);
        } else {
            callback(new Error('data source not found for data id : ' + dataSourceId ), null);
        }
    },

    getToken: function (dataSourceId, callback) {
        var sourceConfig = _.find(localConfigs, {
            agentId : dataSourceId
        });
        if (sourceConfig) {

            //verify if token is expired
            var token = sourceConfig.expiringToken;

            jwt.verify(token, config.secret, function (err, decoded){
                if (err) {
                    if (err.name == 'TokenExpiredError'){
                        var tokenPayload = {
                            tenantid : sourceConfig.tenantId,
                            agentid : sourceConfig.agentId
                        };

                        var token = jwt.sign(tokenPayload, config.secret, {expiresIn: config.tempTokenExpiryTime});
                        sourceConfig.expiringToken = token;
                        console.log ('Updated token for \n\t '+ JSON.stringify(sourceConfig));
                        callback(null, sourceConfig);
                    }
                } else {
                    callback(null, sourceConfig);
                }

            });

        } else {
            callback(new Error('no such source'), null);
        }
    }

};

module.exports = ManageApiConfigurations;