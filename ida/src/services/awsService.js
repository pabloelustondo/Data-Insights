"use strict";
var path = require('path');
var config = require('../../appconfig.json');
var AWS = require('aws-sdk');
var jwtSerivce = require('../services/jwtService');
var fs = require('fs');
var awsPush = require('../awsPush');
var accessKeyIdFile = fs.readFileSync(config['aws-accessKeyFileLocation'], 'utf8');
var secretAccessKeyFile = fs.readFileSync(config['aws-secretKeyFileLocation'], 'utf8');
var options = ({
    accessKeyId: accessKeyIdFile,
    secretAccessKey: secretAccessKeyFile
});
var creds = new AWS.Credentials(options);
var s3instance = new AWS.S3({
    region: config['aws-region'],
    credentials: creds,
    bucket: config['aws-s3bucket']
});
function uploadDataToS3(jwtDecodedToken, clientData) {
    var promise = new Promise(function (resolve, reject) {
        var uploadParams = { Bucket: config['aws-s3bucket'] + jwtDecodedToken.tenantid, Key: '', Body: '' };
        var uploadData = {
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
