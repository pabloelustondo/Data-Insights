/**
 * Created by vdave on 5/2/2017.
 */
import {Route, Get, Post, Delete, Patch, Example, Request, Response} from 'tsoa';
import {SDS} from '../models/user';
import {InputDataModel} from '../models/inputDataModel';
import {ResponseModel, ErrorResponseModel} from '../models/responseModel';
import {ListBatteryStats} from '../models/listBatteryStats';
let jwt  = require('jsonwebtoken');
import * as express from '@types/express';
const path = require('path');
const config = require('../../config.json');

let kafka = require('kafka-node');
import * as rp from 'request-promise';


@Route('data')
export class UploadDataSetController {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */

    @Response<ResponseModel>('200', 'Data Stored')
    @Response<ErrorResponseModel>('400', 'Missing Token')
    @Response<ErrorResponseModel>('400', 'Token verification Failed')
    @Response<ErrorResponseModel>('500', 'Internal Server Error. Please contact SOTI Support')
    @Response<ErrorResponseModel>('400', 'Content-Type incorrect. Content-type must be Application/JSON')
    @Response<ErrorResponseModel>('400', 'Wrong Input Model')
    @Post('')
    @Example<any>({
        headers: {
            'x-access-token': 'Temporary JWT that was retrieved from getAuthorizationToken endpoint',
            'content-type': 'application/json'
        },
        json: true,
        url: 'https://localhost:3010/data',
        data: {
            metadata: {
                dataSetId : 'myCustomDataSetId'
            },
            data : {
                device : {
                    id : 1234,
                    name : 'testName',
                    battery : 50,
                    status : 'ok'
                },
                application : {
                    id : 1234,
                    name : 'applicationName',
                    customApplicationData : {
                        version : '1.0',
                        size : '1M'
                    }
                },
                logs : [{
                    status : '200',
                    message : 'OK',
                    timeStamp : '2016-08-26T00:08:58.000Z'
                }, {
                    status : '200',
                    message : 'OK',
                    timeStamp : '2016-08-26T00:08:59.000Z'
                }, {
                        status : '400',
                        message : 'Error',
                        timeStamp : '2016-08-26T00:09:00.000Z',
                        error : {
                            trace : 'stackTrace'
                        }
                    }
                ]
            }
        }
    })
    public async Create( @Request() express: express.Request): Promise<ResponseModel> {


        let req = express;
        let ip = req.headers['x-forwarded-for'];
        let token = req.headers['x-access-token'];
        let contentType = req.headers['content-type'];


        if (!token) {

            return Promise.reject({
                message: 'missing token',
                status: '400'
            });


        } else {

            if (contentType !== 'application/json') {
                return Promise.reject({
                    message: 'Content-Type incorrect. Content-type must be Application/JSON',
                    status: '400'
                });
            }

            let data = JSON.stringify(req.body);
            try {
                JSON.parse(data);
            } catch (e) {


                return Promise.reject({
                    message: 'Content-Type incorrect. Body must be json type',
                    status: '400'
                });

            }

            let customerData: InputDataModel = express.body;
            if (!((customerData.metadata) && (customerData.metadata.dataSetId) && (customerData.data))) {

                return Promise.reject({
                    message: 'Wrong input model',
                    status: '400'
                });
            }

            let verifyAndDecodeJwt = function () {
                let promise = new Promise(function (resolve, reject) {
                    try {
                        resolve(jwt.verify(token, config['expiring-secret']));
                    } catch (err) {
                        console.log('could not verify token');
                        reject( {
                            message: err.message,
                            statusCode: 400
                        });
                    }
                });
                return promise;
            };


            let sendToQueue = function (jwtDecodedToken: any) {

                if (jwtDecodedToken) {
                    let server = require('../server');
                    let appConfig = server.appconfig;

                    let metadata = (!express.body.metadata) ? {} : express.body.metadata;
                    let data = {
                        idaMetadata: {
                            referer: 'sampleRequestOriginInfo',
                            dataSourceId: jwtDecodedToken.agentid,
                            tenantId: jwtDecodedToken.tenantid,
                            timeStamp: (new Date()).toISOString()
                        },
                        clientMetadata: metadata,
                        clientData: express.body.data
                    };

                    // create
                    let kafkaClient = new kafka.Client(appConfig['kafka_url']);

                    let promise = new Promise(function (resolve, reject) {
                        try {
                            let producer = new kafka.Producer(kafkaClient);
                            producer.on('ready', function (message: any) {
                                let payloads: any = [
                                    {
                                        topic: jwtDecodedToken.tenatid + '_' + data.clientMetadata.dataSetId,
                                        partition: 0,
                                        messages: JSON.stringify(data)
                                    }];
                                producer.send(payloads, function (err: any, data: any) {
                                    console.log('response from kafka' + data);

                                });
                                let transactionLogPayloads: any = [
                                    {
                                        topic: jwtDecodedToken.tenatid + '_' + 'transactionLogs',
                                        partition: 0,
                                        messages: JSON.stringify(data)
                                    }];
                                producer.send(transactionLogPayloads, function (err: any, data: any) {
                                    console.log(data);
                                    // return Promise.resolve(data);
                                    if (err) {
                                        reject ({
                                            message : err.message,
                                            statusCode : 500
                                        });
                                    }
                                    resolve(data);
                                });
                            });
                            producer.on('error', function (error: any) {
                                console.log(error);
                                reject ({
                                    message : error.message,
                                    statusCode : 500
                                });
                            });
                        } catch (e) {
                            console.log('IDA could not communicate with kafka producer');
                            reject ({
                                message : 'IDA could not communicate with Queue producer',
                                statusCode : 500
                            });
                        }
                    });

                    return promise;
                    // return rp(options);
                } else {
                    return new Promise (function (resolve, reject) {
                        reject({
                            statusCode : 404,
                            message : 'Invalid token'
                        });
                    });
                }

            };

            let responseData = function (kafkaResponse: any) {
                let promise = new Promise(function (resolve, reject) {
                    if (kafkaResponse) {
                        let mData = ['status : string'];
                        const user: any = {
                            createdAt: new Date(),
                            metadata: mData,
                            data: 'OK'
                        };
                        resolve(user);
                    } else {
                        reject( {
                            message : 'Error with backend Service',
                            statusCode : 504
                        });
                    }
                });
                return promise;
            };

            let finalResponse: any = await verifyAndDecodeJwt().then(sendToQueue).then(responseData, function (err) {
                console.log(err);

                return Promise.reject(
                    {
                        message: err.message,
                        status:  err.statusCode
                    }
                );
            });
            return finalResponse;
        }
    }
}