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
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
 * Created by vdave on 5/2/2017.
 */
var tsoa_1 = require('tsoa');
var jwt = require('jsonwebtoken');
var path = require('path');
var config = require('../../appconfig.json');
var AWS = require('aws-sdk');
var fs = require('fs');
var rp = require('request-promise');
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
var UploadDataSetController = (function () {
    function UploadDataSetController() {
    }
    /**
     * Post a unit of data to be stored in the cloud analytics database
     */
    UploadDataSetController.prototype.Create = function (express) {
        return __awaiter(this, void 0, Promise, function* () {
            var req = express;
            var ip = req.headers['x-forwarded-for'];
            var token = req.headers['x-access-token'];
            var contentType = req.headers['content-type'];
            if (!token) {
                var error = {
                    error: {
                        errorCode: '1',
                        errorMessage: 'missing token'
                    }
                };
                return error;
            }
            if (contentType !== 'application/json') {
                var error = {
                    error: {
                        errorCode: '2',
                        errorMessage: 'Content-Type incorrect. Content-type must be Application/JSON'
                    }
                };
                return error;
            }
            var data = JSON.stringify(req.body);
            try {
                JSON.parse(data);
            }
            catch (e) {
                var error = {
                    error: {
                        errorCode: '3',
                        errorMessage: 'Content-Type incorrect. Body must be json type'
                    }
                };
                return error;
            }
            var customerData = express.body;
            if (!((customerData.metadata) && (customerData.metadata.dataSetId) && (customerData.data))) {
                var error = {
                    error: {
                        errorCode: '4',
                        errorMessage: 'wrong input model'
                    }
                };
                return error;
            }
            var getCustomerID = function () {
                var promise = new Promise(function (resolve, reject) {
                    resolve(jwt.verify(token, config['expiring-secret']));
                });
                return promise;
            };
            var sendToQueue = function (jwtDecodedToken) {
                var addedMetadata = {
                    idaMetadata: {
                        referer: 'sampleRequestOriginInfo',
                        agentId: jwtDecodedToken.agentid,
                        tenantId: jwtDecodedToken.tenantid,
                        timeStamp: (new Date()).toISOString(),
                    },
                    clientData: express.body
                };
                var headersOptions = {
                    'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
                };
                var options = {
                    json: true,
                    method: 'POST',
                    headers: headersOptions,
                    url: config['queue-address'],
                    body: addedMetadata
                };
                rp(options);
            };
            var responseData = function (awsRes) {
                var promise = new Promise(function (resolve, reject) {
                    var mData = ['awsResponse : boolean'];
                    var user = {
                        createdAt: new Date(),
                        metadata: mData,
                        data: awsRes.Location
                    };
                    resolve(user);
                });
                return promise;
            };
            var finalFunction = function (response) {
                return response;
            };
            var finalResponse = yield getCustomerID().then(sendToQueue).then(responseData);
            return finalResponse;
        });
    };
    __decorate([
        tsoa_1.Post('input'),
        tsoa_1.Example({
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
        }),
        __param(0, tsoa_1.Request())
    ], UploadDataSetController.prototype, "Create", null);
    UploadDataSetController = __decorate([
        tsoa_1.Route('data')
    ], UploadDataSetController);
    return UploadDataSetController;
}());
exports.UploadDataSetController = UploadDataSetController;
