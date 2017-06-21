"use strict";
const path = require('path');
const config = require('../../config.json');
const AWS = require('aws-sdk');
const jwtSerivce = require('../services/jwtService');
const fs = require('fs');
const awsPush = require('../awsPush');
let accessKeyIdFile = fs.readFileSync(config['aws-accessKeyFileLocation'], 'utf8');
let secretAccessKeyFile = fs.readFileSync(config['aws-secretKeyFileLocation'], 'utf8');
const options = ({
    accessKeyId: accessKeyIdFile,
    secretAccessKey: secretAccessKeyFile
});
const creds = new AWS.Credentials(options);
const s3instance = new AWS.S3({
    region: config['aws-region'],
    credentials: creds,
    bucket: config['aws-s3bucket']
});
function uploadDataToS3(jwtDecodedToken, clientData) {
    let promise = new Promise(function (resolve, reject) {
        let uploadParams = { Bucket: config['aws-s3bucket'] + jwtDecodedToken.tenantid, Key: '', Body: '' };
        let uploadData = {
            idaMetadata: {
                referer: 'sampleRequestOriginInfo',
                agentId: jwtDecodedToken.agentid,
                tenantId: jwtDecodedToken.tenantid,
                timeStamp: (new Date()).toISOString(),
            },
            clientData: clientData
        };
        uploadParams.Body = JSON.stringify(uploadData);
        uploadParams.Key = path.basename(jwtDecodedToken.tenantid + '.' + jwtDecodedToken.agentid + '.' + (new Date()).toISOString() + '.json');
        console.time('awsCallLarge');
        s3instance.upload(uploadParams, function (err, data) {
            if (err) {
                err.code = 'External Error, contact SOTI support with code 0001';
                reject(err.code);
            }
            if (data) {
                resolve(data);
            }
        });
        console.timeEnd('awsCallLarge');
    });
    return promise;
}
exports.uploadDataToS3 = uploadDataToS3;
;
//# sourceMappingURL=awsService.js.map