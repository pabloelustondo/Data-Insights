/**
 * Created by vdave on 5/8/2017.
 */

import * as path from "path";
import * as fs from "fs";
import * as rp from 'request-promise';
import * as express from '@types/express';
import {User} from '../models/user';
import {ClientData} from '../models/clientData';
const AWS = require('aws-sdk');

let config = require('../config.json');
let appconfig = require('../appconfig.json');



let accessKeyIdFile = fs.readFileSync(config['aws_accessKeyFileLocation'], 'utf8');
let secretAccessKeyFile = fs.readFileSync(config['aws_secretKeyFileLocation'], 'utf8');

const options = ({
    accessKeyId: accessKeyIdFile,
    secretAccessKey: secretAccessKeyFile
});

const creds = new AWS.Credentials(options);


const s3instance = new AWS.S3({
    region : config['aws_region'] ,
    credentials : creds,
    bucket: config['aws_s3bucket']
});

export function uploadRawData(tenantId: string, dataSourceId: string, clientData: ClientData) {
    let uploadParams = {Bucket: config['aws_s3bucket']  + '/' + tenantId, Key: '', Body: ''};
    uploadParams.Body = JSON.stringify(clientData);
    uploadParams.Key = path.basename(tenantId + '.' + dataSourceId + '.' + (new Date()).toISOString() + '.json');


    console.time('awsCallLarge');
    let promise = new Promise(function (resolve, reject) {
        s3instance.upload(uploadParams, function (err: any, data: any) {
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

export function uploadModifiedData(tenantId: string, dataSetName: string, clientData: any) {

    let endpoint = appconfig['cdl_address'] + tenantId + config['cdl_put_endpoint'] ;

    const headerOptions = {
        'x-access-token' : config['access_token']
    };

    let body = {
        tenantId: tenantId,
        collectionName: dataSetName,
        data: clientData
    };

    const options: rp.OptionsWithUrl = {
        json: true,
        method: 'POST',
        headers: headerOptions,
        url: endpoint,
        body: body
    };
    return rp(options);
}





