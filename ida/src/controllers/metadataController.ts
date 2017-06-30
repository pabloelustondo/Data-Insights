/**
 * Created by vdave on 6/27/2017.
 */
/**
 * Created by vdave on 6/23/2017.
 */
/**
 * Created by vdave on 5/2/2017.
 */
import {Route, Get, Example, Request, Response} from 'tsoa';
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


@Route('Metadata')
export class MetadataController {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */

    @Response<ResponseModel>('200', 'OK')
    @Response<ErrorResponseModel>('400', 'Missing Token')
    @Response<ErrorResponseModel>('401', 'Token verification Failed')
    @Response<ErrorResponseModel>('500', 'Internal Server Error. Please contact SOTI Support')
    @Response<ErrorResponseModel>('400', 'Content-Type incorrect. Content-type must be Application/JSON')
    @Response<ErrorResponseModel>('406', 'Wrong Input Model')
    @Get('')
    @Example<any>({
        headers: {
            'x-access-token': 'Temporary JWT that was retrieved from getAuthorizationToken endpoint',
            'content-type': 'application/json'
        },
        json: true,
        url: 'https://localhost:3010/metadata/:tenantId',

    })
    public async Create(@Request() express: express.Request): Promise<ResponseModel> {


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



            let verifyAndDecodeJwt = function () {
                let promise = new Promise(function (resolve, reject) {
                    try {
                        resolve(jwt.verify(token, config['expiring-secret']));
                    } catch (err) {
                        console.log('could not verify token');
                        reject( {
                            message: err.message,
                            statusCode: 401
                        });
                    }
                });
                return promise;
            };


            let sendToQueue = function (jwtDecodedToken: any) {

                if (jwtDecodedToken) {
                    let promise = new Promise(function (resolve, reject) {
                        let xqs = {tenantId: jwtDecodedToken.tenantid};
                        let server = require('../server');
                        let appConfig = server.appconfig;
                        const xurl = appConfig['dps_url'] + '/getMetadata/' + jwtDecodedToken.tenantid;

                        const options: rp.OptionsWithUrl = {
                            headers: {
                                'x-api-key': config['aws-x-api-key']
                            },
                            json: true,
                            method: 'GET',
                            qs: xqs,
                            url: xurl
                        };

                        resolve(rp(options));

                    });
                    return promise;

                } else {
                    return new Promise (function (resolve, reject) {
                        reject({
                            statusCode : 401,
                            message : 'Invalid token'
                        });
                    });
                }

            };

            let responseData = function (serverResonse: any) {
                let promise = new Promise(function (resolve, reject) {
                    if (serverResonse) {
                        let mData = ['tenant metadata'];
                        const user: any = {
                            createdAt: new Date(),
                            metadata: mData,
                            data: serverResonse
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