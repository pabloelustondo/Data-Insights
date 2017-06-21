"use strict";
const fs = require('fs');
const config = require('../config.json');
const AWS = require('aws-sdk');
let accessKeyIdFile = fs.readFileSync(config['aws-accessKeyFileLocation'], 'utf8');
let secretAccessKeyFile = fs.readFileSync(config['aws-secretKeyFileLocation'], 'utf8');
const options = ({
    accessKeyId: accessKeyIdFile,
    secretAccessKey: secretAccessKeyFile
});
const creds = new AWS.Credentials(options);
const firehose = new AWS.Firehose({
    region: config['aws-region'],
    credentials: creds
});
const dStreamName = 'da_firehose';
function createRecordParam(data) {
    const recordParams = {
        Record: {
            Data: JSON.stringify(data)
        },
        DeliveryStreamName: dStreamName
    };
    return recordParams;
}
function createBatchRecordParam(data) {
    let dataMapping = [];
    let dataLength = data.length;
    let index;
    for (index = 0; index < dataLength; index++) {
        let awsStat = { Data: JSON.stringify(data[index]) };
        dataMapping.push(awsStat);
    }
    const recordParams = {
        Records: dataMapping,
        DeliveryStreamName: dStreamName
    };
    return recordParams;
}
function putRecord(data) {
    let recordInput = createRecordParam(data);
    firehose.putRecord(recordInput, function (err, data1) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        }
    });
}
function putRecordBatch(data) {
    let recordInput = createBatchRecordParam(data.stats);
    console.time('putRecordBatch: aws call');
    firehose.putRecordBatch(recordInput, function (err, data1) {
        if (err) {
            console.log(err, err.message); // an error occurred
        }
    });
    console.timeEnd('putRecordBatch: aws call');
}
module.exports = {
    putRecord: putRecord,
    putRecordBatch: putRecordBatch
};
/**
 * Created by vdave on 12/8/2016.
 */
//# sourceMappingURL=awsPush.js.map