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

let s3instance = new AWS.S3({
    region : config['aws_region'] ,
    credentials : creds,
    bucket: config['aws_s3bucket']
});

export function uploadRawData(tenantId: string, dataSourceId: string, clientData: ClientData) {


    let endpoint = appconfig['cdl_transLog_address'] + tenantId + '/data' ;

    const headerOptions = {
        'x-access-token' : config['access_token']
    };

    let body = {
        tenantId: tenantId,
        dataSourceId: dataSourceId,
        clientData: clientData
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

export function uploadModifiedData(tenantId: string, collectionName: string, clientData: any) {

    let endpoint = appconfig['cdl_ds_address'] + tenantId + config['cdl_put_endpoint'] ;

    const headerOptions = {
        'x-access-token' : config['access_token']
    };

    let body = {
        tenantId: tenantId,
        collectionName: collectionName,
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





