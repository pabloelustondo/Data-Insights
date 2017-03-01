/**
 * Created by vdave on 2/23/2017.
 */
import {Route, Get, Post, Delete, Patch, Example, Request} from 'tsoa';
import {SDS} from '../models/user';
import {ListBatteryStats} from '../models/listBatteryStats';
let jwt  = require('jsonwebtoken');
import * as express from '@types/express';
const path = require('path');
const config = require('../../appconfig.json');
const AWS      = require('aws-sdk');
import * as fs from 'fs';
import * as querystring from 'querystring';
import * as rp from 'request-promise';

import {SDSBattery} from '../models/batteryData';
const awsPush = require('../awsPush');

let accessKeyIdFile = fs.readFileSync(config['aws-accessKeyFileLocation'], 'utf8');
let secretAccessKeyFile = fs.readFileSync(config['aws-secretKeyFileLocation'], 'utf8');

const options = ({
    accessKeyId: accessKeyIdFile,
    secretAccessKey: secretAccessKeyFile
});

const creds = new AWS.Credentials(options);


const s3instance = new AWS.S3({
    region : config['aws-region'] ,
    credentials : creds,
    bucket: config['aws-s3bucket']
});



@Route('Data')
export class UploadLargeDataSetController {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */

    @Post('LargeDataSets')
    @Example<any>({
        headers: {
            'x-access-token': 'Future Private Access Key',
            'Accept': 'application/json'
        },
        json: true,
        url: 'https://localhost:3010/data/LargeDataSets',
        data: {
            dev_id: '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
            server_time_stamp: '2016-12-08T19:12:15.235Z',
            int_value: 123456789123,
            stat_type: 1234,
            time_stamp: '2016-12-08T19:13:15.235Z'
        }
    })
    public async Create( @Request() express: express.Request): Promise<SDS> {


        let req = express;
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
        req.socket.remoteAddress ;
        let token = req.headers['x-access-token'];
        let contentType = req.headers['content-type'];

        if (contentType !== 'application/json') {
            throw new Error('Content-type must be Application/JSON');
        }

        let data = JSON.stringify(req.body);

        try {
            JSON.parse(data);
        } catch (e) {
             throw new Error('Body must be json type');
        }

        if (token) {

            let getCustomerID = function () {
                let promise = new Promise(function (resolve, reject) {
                    resolve(jwt.verify(token, config['expiring-secret']));
                });
                return promise;
            };


            let awsResponseCall = function (awsP: any) {
                let promise = new Promise(function (resolve, reject) {
                    let uploadParams = {Bucket: config['aws-s3bucket'], Key: '', Body: ''};
                    let xyz = {
                        idaMetadata : {
                            referer: 'sampleData',
                            agentId: 'test-id',
                            timeStamp: (new Date()).toISOString,
                        },
                        clientData : express.body
                    };

                    xyz.clientData = express.body;
                    uploadParams.Body = JSON.stringify(xyz);
                    uploadParams.Key = path.basename(awsP.tenantid + '.' + awsP.agentid + '.' + (new Date()).toISOString() + '.json');
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
                return promise;
            };
            let responseData = function (awsRes: any) {
                let promise = new Promise(function (resolve, reject) {

                    console.log('upload success', awsRes.Location);
                    let mData = ['awsResponse : boolean'];

                    const user: any = {
                        createdAt: new Date(),
                        metadata: mData,
                        data: 'true'
                    };

                    resolve(user);

                });
                return promise;
            };

            let p: any = await getCustomerID().then(awsResponseCall).then(responseData);

            return p;
        } else {
            throw new Error('invalid auth token');
        }

    }

}