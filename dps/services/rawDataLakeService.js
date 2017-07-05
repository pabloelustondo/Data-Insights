"use strict";
const rp = require('request-promise');
let config = require('../config.json');
let appconfig = require('../appconfig.json');
let globalConfig = require('../globalconfig.json');
let testResponses = require('../testing/testResponses.json');
function uploadRawData(tenantId, dataSourceId, clientData) {
    if (appconfig.testingmode) {
        return new Promise((resolve) => { resolve(testResponses.awsSampleResponse + tenantId); });
    }
    else {
        let endpoint = globalConfig['cdl_url'] + '/transactionLog/' + tenantId + '/data';
        const headerOptions = {
            'x-access-token': config['access_token']
        };
        let body = {
            tenantId: tenantId,
            dataSourceId: dataSourceId,
            clientData: clientData
        };
        const options = {
            json: true,
            method: 'POST',
            headers: headerOptions,
            url: endpoint,
            body: body
        };
        return new Promise((resolve) => {
            resolve(rp(options));
        });
    }
}
exports.uploadRawData = uploadRawData;
function uploadModifiedData(tenantId, collectionName, clientData) {
    if (appconfig.testingMode) {
        return new Promise((resolve) => {
            resolve({
                n: '1',
                ok: '1'
            });
        });
    }
    else {
        let endpoint = globalConfig['cdl_url'] + '/ds/' + tenantId + config['cdl_put_endpoint'];
        const headerOptions = {
            'x-access-token': config['access_token']
        };
        let body = {
            tenantId: tenantId,
            dsId: collectionName,
            data: clientData
        };
        const options = {
            json: true,
            method: 'POST',
            headers: headerOptions,
            url: endpoint,
            body: body
        };
        return new Promise((resolve) => {
            resolve(rp(options));
        });
    }
}
exports.uploadModifiedData = uploadModifiedData;
//# sourceMappingURL=rawDataLakeService.js.map