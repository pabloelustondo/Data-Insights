/**
 * Created by vdave on 5/25/2017.
 */
import {Route, Get, Post, Delete, Patch, Request,  Example} from 'tsoa';
import {SDS} from '../models/user';
import {QueryModel} from '../models/queryModel';
import * as rp from 'request-promise';
import * as express from '@types/express';
let jwt  = require('jsonwebtoken');
import * as https from 'https';
const config = require('../../config.json');
let server = require('../server');

@Route('Query')
export class QueryController {

    /**
     * This api can be used to post a query that will use the stored metadata in the system to generate
     * and return a dataSet.
     *
     */

    @Post('')
    @Example<any>({
        dataSetId : 'myCustomQueryID',
        from : ['sourceMetadataId']
    })
    public async Create(request: QueryModel,@Request() express: express.Request ): Promise<SDS> {

        let server = require('../../globalconfig.json');

        let appConfig =  require('../../globalconfig.json');
    //    if (request.from[0] === 'vehicleInfo') {
        let req = express;
        let token = req.headers['x-access-token'];

        let verifyAndDecodeJwt = function () {
            let promise = new Promise(function (resolve, reject) {
                try {
                    resolve(jwt.verify(token, config['expiring-secret']));
                } catch (err) {
                    console.log('could not verify token');

                    reject(err);
                }
            });
            return promise;
        };


        let backendCall = function (jwtDecodedToken: any) {
            let promise = new Promise( function( resolve, reject) {
                const options: rp.OptionsWithUrl = {
                    headers: {
                        'x-api-key': config['aws-x-api-key']
                    },
                    json: true,
                    method: 'POST',
                    body: {
                        metadata : {
                            'tenantId' : jwtDecodedToken.tenantid,
                            'dataSetId' : request.from[0]
                        }
                    },
                    url: appConfig['dps_url'] + '/data/outGoingRequest'
                };
                resolve(rp(options));
            });
            return promise;
        };


        let p: any = verifyAndDecodeJwt().then(backendCall).then(function (data: any) {
            return data;
        }, function (err: any) {
            return Promise.reject( {
                message : err.message,
                status : '400'
            });
        });
        return p;

    }



}