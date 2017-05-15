/**
 * Created by vdave on 2/9/2017.
 */
import {Route, Get, Post, Delete, Patch, Example, Request} from 'tsoa';

let jwt  = require('jsonwebtoken');
import * as express from '@types/express';

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
const firehose = new AWS.Firehose(
    {
        region : config['aws-region'],
        credentials : creds
    });


@Route('Security')
export class GetAuthorizationToken {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */

    @Get('getAuthorizationToken')
    @Example<any>({
        headers: {
            'x-access-token': 'Certificate from admin console',
            'Accept': 'application/json'
        },
        json: true,
        url: 'https://localhost:3010/security/getAuthorizationToken'
    })
    public async Get(@Request() express: express.Request): Promise<JsonWebKey> {


        let req = express;
        let token = req.headers['x-access-token'];

        if (token) {

            /*
             * call DSS to verify the agent has credentials
             * and provide a token retireved from DSS
             *
             */
            let verifyToken = function () {
                let promise = new Promise(function (resolve, reject) {
                    resolve(jwt.verify(token, config['mcdp-secret']));
                });
                return promise;
            };


            let callDss = function (decodedToken: any) {
                let promise = new Promise(function (resolve, reject) {

                    if (decodedToken) {
                        const dssEndpoint = config['dss-address'] + '/getAgentToken';

                        const optionsTest: rp.OptionsWithUrl = {
                            json: true,
                            method: 'GET',
                            url: dssEndpoint,
                            headers: {
                                'x-access-token': token
                            }
                        };
                        resolve(rp(optionsTest));
                    } else {
                        reject('Invalid token');
                    }
                });
                return promise;
            };

            let responseData = function (dssResponse: any) {
                let promise = new Promise(function (resolve, reject) {
                    if (dssResponse) {
                        resolve(dssResponse);
                    } else {
                        reject('Dss error response');
                    }

                });
                return promise;
            };
            let p: any = await verifyToken().then(callDss).then(responseData, function(error) {
                const user: any = {
                    createdAt: new Date(),
                    metadata: 'ERROR',
                    data: 'Could not verify token ' + error
                };
                return user;
            });

            console.log( JSON.stringify(p));
            return p;
        } else {
            const user: any = {
                createdAt: new Date(),
                metadata: 'ERROR',
                data: 'Invalid Token or missing token'
            };
            return user;
           // throw new Error('invalid auth token');
        }
    }
}

