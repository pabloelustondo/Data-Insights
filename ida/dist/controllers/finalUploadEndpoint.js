"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by vdave on 5/2/2017.
 */
const tsoa_1 = require("tsoa");
let jwt = require('jsonwebtoken');
const path = require('path');
const config = require('../../config.json');
let kafka = require('kafka-node');
let UploadDataSetController = class UploadDataSetController {
    /**
     * Post a unit of data to be stored in the cloud analytics database
     */
    Create(express) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = express;
            let ip = req.headers['x-forwarded-for'];
            let token = req.headers['x-access-token'];
            let contentType = req.headers['content-type'];
            if (!token) {
                return Promise.reject({
                    message: 'missing token',
                    status: '400'
                });
            }
            else {
                if (contentType !== 'application/json') {
                    return Promise.reject({
                        message: 'Content-Type incorrect. Content-type must be Application/JSON',
                        status: '400'
                    });
                }
                let data = JSON.stringify(req.body);
                try {
                    JSON.parse(data);
                }
                catch (e) {
                    return Promise.reject({
                        message: 'Content-Type incorrect. Body must be json type',
                        status: '400'
                    });
                }
                let customerData = express.body;
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
                        }
                        catch (err) {
                            console.log('could not verify token');
                            reject(err);
                        }
                    });
                    return promise;
                };
                let sendToQueue = function (jwtDecodedToken) {
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
                                producer.on('ready', function (message) {
                                    let payloads = [
                                        {
                                            topic: jwtDecodedToken.tenatid + '_' + data.clientMetadata.dataSetId,
                                            partition: 0,
                                            messages: JSON.stringify(data)
                                        }
                                    ];
                                    producer.send(payloads, function (err, data) {
                                        console.log('response from kafka' + data);
                                    });
                                    let transactionLogPayloads = [
                                        {
                                            topic: jwtDecodedToken.tenatid + '_' + 'transactionLogs',
                                            partition: 0,
                                            messages: JSON.stringify(data)
                                        }
                                    ];
                                    producer.send(transactionLogPayloads, function (err, data) {
                                        console.log(data);
                                        // return Promise.resolve(data);
                                        resolve(data);
                                    });
                                });
                                producer.on('error', function (error) {
                                    console.log(error);
                                });
                            }
                            catch (e) {
                                console.log('IDA could not communicate with kafka producer');
                            }
                        });
                        return promise;
                        // return rp(options);
                    }
                    else {
                        return new Promise(function (resolve, reject) {
                            reject({
                                statusCode: 404,
                                message: 'Invalid token'
                            });
                        });
                    }
                };
                let responseData = function (kafkaResponse) {
                    let promise = new Promise(function (resolve, reject) {
                        if (kafkaResponse) {
                            let mData = ['status : string'];
                            const user = {
                                createdAt: new Date(),
                                metadata: mData,
                                data: 'OK'
                            };
                            resolve(user);
                        }
                        else {
                            reject('Error with backend Service');
                        }
                    });
                    return promise;
                };
                let finalResponse = yield verifyAndDecodeJwt().then(sendToQueue).then(responseData, function (err) {
                    console.log(err);
                    return Promise.reject({
                        message: err.message,
                        status: '400'
                    });
                });
                return finalResponse;
            }
        });
    }
};
__decorate([
    tsoa_1.Response('200', 'Data Stored'),
    tsoa_1.Response('400', 'Missing Token'),
    tsoa_1.Response('400', 'Token verification Failed'),
    tsoa_1.Response('500', 'Internal Server Error. Please contact SOTI Support'),
    tsoa_1.Response('400', 'Content-Type incorrect. Content-type must be Application/JSON'),
    tsoa_1.Response('400', 'Wrong Input Model'),
    tsoa_1.Post(''),
    tsoa_1.Example({
        headers: {
            'x-access-token': 'Temporary JWT that was retrieved from getAuthorizationToken endpoint',
            'content-type': 'application/json'
        },
        json: true,
        url: 'https://localhost:3010/data',
        data: {
            metadata: {
                dataSetId: 'myCustomDataSetId',
                projections: ['device', 'application']
            },
            data: {
                device: {
                    id: 1234,
                    name: 'testName',
                    battery: 50,
                    status: 'ok'
                },
                application: {
                    id: 1234,
                    name: 'applicationName',
                    customApplicationData: {
                        version: '1.0',
                        size: '1M'
                    }
                },
                logs: [{
                        status: '200',
                        message: 'OK',
                        timeStamp: '2016-08-26T00:08:58.000Z'
                    }, {
                        status: '200',
                        message: 'OK',
                        timeStamp: '2016-08-26T00:08:59.000Z'
                    }, {
                        status: '400',
                        message: 'Error',
                        timeStamp: '2016-08-26T00:09:00.000Z',
                        error: {
                            trace: 'stackTrace'
                        }
                    }
                ]
            }
        }
    }),
    __param(0, tsoa_1.Request())
], UploadDataSetController.prototype, "Create", null);
UploadDataSetController = __decorate([
    tsoa_1.Route('data')
], UploadDataSetController);
exports.UploadDataSetController = UploadDataSetController;
//# sourceMappingURL=finalUploadEndpoint.js.map