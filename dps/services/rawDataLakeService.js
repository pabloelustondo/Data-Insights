"use strict";
/**
 * Created by vdave on 5/8/2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var AWS = require('aws-sdk');
var config = require('../config.json');
var appconfig = require('../appconfig.json');
var accessKeyIdFile = fs.readFileSync(config['aws_accessKeyFileLocation'], 'utf8');
var secretAccessKeyFile = fs.readFileSync(config['aws_secretKeyFileLocation'], 'utf8');
var options = ({
    accessKeyId: accessKeyIdFile,
    secretAccessKey: secretAccessKeyFile
});
var creds = new AWS.Credentials(options);
var s3instance = new AWS.S3({
    region: config['aws_region'],
    credentials: creds,
    bucket: config['aws_s3bucket']
});
function uploadDataToLake(tenantId, dataSourceId, clientData) {
    var uploadParams = { Bucket: config['aws_s3bucket'] + '/' + tenantId, Key: '', Body: '' };
    uploadParams.Body = JSON.stringify(clientData);
    uploadParams.Key = path.basename(tenantId + '.' + dataSourceId + '.' + (new Date()).toISOString() + '.json');
    console.time('awsCallLarge');
    var promise = new Promise(function (resolve, reject) {
        s3instance.upload(uploadParams, function (err, data) {
            if (err) {
                err.code = 'External Error, contact SOTI support with code 0001';
                reject(err.code);
            }
            if (data) {
                resolve(data);
            }
        });
    });
    console.timeEnd('awsCallLarge');
    return promise;
}
exports.uploadDataToLake = uploadDataToLake;
