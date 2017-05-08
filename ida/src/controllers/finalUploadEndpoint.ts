/**
 * Created by vdave on 5/2/2017.
 */
import {Route, Get, Post, Delete, Patch, Example, Request} from 'tsoa';
import {SDS} from '../models/user';
import {InputDataModel} from '../models/inputDataModel';
import {ResponseModel} from '../models/responseModel';
import {ListBatteryStats} from '../models/listBatteryStats';
let jwt  = require('jsonwebtoken');
import * as express from '@types/express';
const path = require('path');
const config = require('../../appconfig.json');
const AWS = require('aws-sdk');

import {verifyToken} from '../services/jwtService';
import {uploadDataToS3} from '../services/awsService';

import * as fs from 'fs';
import * as rp from 'request-promise';

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



@Route('data')
export class UploadDataSetController {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */

    @Post('input')
    @Example<any>({
        headers: {
            'x-access-token': 'Future Private Access Key',
            'Accept': 'application/json'
        },
        json: true,
        url: 'https://localhost:3010/data/input',
        data: {
            dev_id: '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
            server_time_stamp: '2016-12-08T19:12:15.235Z',
            int_value: 123456789123,
            stat_type: 1234,
            time_stamp: '2016-12-08T19:13:15.235Z'
        }
    })
    public async Create( @Request() express: express.Request): Promise<ResponseModel> {


        let req = express;
        let ip = req.headers['x-forwarded-for'] ;
        let token = req.headers['x-access-token'];
        let contentType = req.headers['content-type'];


        if (!token) {
            let error: ResponseModel = {
                error : {
                    errorCode: '1',
                    errorMessage: 'missing token'
                }
            };
            return error;
        }

        if (contentType !== 'application/json') {

            let error: ResponseModel = {
                error : {
                    errorCode: '2',
                    errorMessage: 'Content-Type incorrect. Content-type must be Application/JSON'
                }
            };
            return error;
        }

        let data = JSON.stringify(req.body);
        try {
            JSON.parse(data);
        } catch (e) {

            let error: ResponseModel = {
                error : {
                    errorCode: '3',
                    errorMessage: 'Content-Type incorrect. Body must be json type'
                }
            };
            return error;
        }

        let customerData: InputDataModel = express.body;
        if (!((customerData.metadata) && (customerData.metadata.dataSetId) && (customerData.data))) {

            let error: ResponseModel = {
                error : {
                    errorCode: '4',
                    errorMessage: 'wrong input model'
                }
            };
            return error;

        }




        let getCustomerID = function () {
            let promise = new Promise(function (resolve, reject) {
                resolve(jwt.verify(token, config['expiring-secret']));
            });
            return promise;
        };


        let sendToQueue = function (jwtDecodedToken: any) {
           // let promise = new Promise(function (resolve, reject) {
                let data = {
                    idaMetadata: {
                        referer: 'sampleRequestOriginInfo',
                        dataSourceId: jwtDecodedToken.dataSourceId,
                        tenantId: jwtDecodedToken.tenantId,
                        timeStamp: (new Date()).toISOString()
                    },
                    clientData: express.body
                };
                const headersOptions = {
                    'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
                };

                const options: rp.OptionsWithUrl = {
                    json: true,
                    method: 'POST',
                    headers: headersOptions,
                    url: config['queue_address'],
                    body: data
                };
                return rp(options);
        };

        let responseData = function (dpsResponse: any) {
            let promise = new Promise(function (resolve, reject) {

                if (dpsResponse['status'] === 200) {
                    let mData = ['awsResponse : boolean'];

                    const user: any = {
                        createdAt: new Date(),
                        metadata: mData,
                        data: dpsResponse.response
                    };
                    resolve(user);

                } else {
                    reject('rejected');
                }
            });
            return promise;
        };


        let finalResponse: any = await getCustomerID().then(sendToQueue).then(responseData);
        return finalResponse;

    }
}