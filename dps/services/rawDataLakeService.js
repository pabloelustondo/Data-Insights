"use strict";
var rp = require('request-promise');
var config = require('../config.json');
var appconfig = require('../appconfig.json');
var globalConfig = require('../globalconfig.json');
var testResponses = require('../testing/testResponses.json');
function uploadRawData(tenantId, dataSourceId, clientData) {
    if (appconfig.testingmode) {
        return new Promise(function (resolve) { resolve(testResponses.awsSampleResponse + tenantId); });
    }
    else {
        var endpoint = globalConfig['cdl_url'] + '/transactionLog/' + tenantId + '/data';
        var headerOptions = {
            'x-access-token': config['access_token']
        };
        var body = {
            tenantId: tenantId,
            dataSourceId: dataSourceId,
            clientData: clientData
        };
        var options = {
            json: true,
            method: 'POST',
            headers: headerOptions,
            url: endpoint,
            body: body
        };
        return rp(options);
    }
}
exports.uploadRawData = uploadRawData;
function uploadModifiedData(tenantId, collectionName, clientData) {
    if (appconfig.testingMode) {
        return {
            n: '1',
            ok: '1'
        };
    }
    else {
        var endpoint = globalConfig['cdl_url'] + '/ds/' + tenantId + config['cdl_put_endpoint'];
        var headerOptions = {
            'x-access-token': config['access_token']
        };
        var body = {
            tenantId: tenantId,
            dsId: collectionName,
            data: clientData
        };
        var options = {
            json: true,
            method: 'POST',
            headers: headerOptions,
            url: endpoint,
            body: body
        };
        return rp(options);
    }
}
exports.uploadModifiedData = uploadModifiedData;
//# sourceMappingURL=rawDataLakeService.js.map