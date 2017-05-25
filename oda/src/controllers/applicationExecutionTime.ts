/**
 * Created by vdave on 2/10/2017.
 */
import {Route, Get, Post, Delete, Patch, Example, Request} from 'tsoa';
import {SDS} from '../models/user';
import * as express from '@types/express';
const config = require('../../appconfig.json');
let jwt  = require('jsonwebtoken');

import * as querystring from 'querystring';

import * as rp from 'request-promise';
@Route('Devices')
export class ApplicationExecutionTime {
    /**
     *
     * NOTE: THIS API IS DEPRECATED
     *
     * This API returns:
     *  a list of apps and the total time they were used for all devices for a given time range
     */

    @Get('Application/executionTime')
    @Example<any>({
        createdAt: '2016-11-29T20:30:21.385Z',
        metadata: [
            'ExecutionTimeMinutes: int',
            'AppId: string'
        ],
        data: [
            {
                'ExecutionTimeMinutes': 41628,
                'AppId' : 'android',
            },
            {
                'ExecutionTimeMinutes': 43,
                'AppId' : 'com.ebay.mobile'
            }

        ]
    })
    public async Get(dateFrom: Date, dateTo: Date, @Request() request: express.Request): Promise<SDS> {


        let req = request;
        let token = req.headers['x-access-token'];

        if (token) {

            let getCustomerID = function () {
                let promise = new Promise (function (resolve, reject) {
                    resolve (jwt.verify(token, 'Data Analytics Team Rocks!'));
                });
                return promise;
            };

            let firstMethod = function (decodedToken: any) {
                let promise = new Promise(function (resolve, reject) {

                    let minutes = (new Date).getTime();

                    const getDBURL = config['ddb'] + '/getDBAccess/' + decodedToken.tenantId;

                    const dboptions: rp.OptionsWithUrl = {
                        json: true,
                        method: 'GET',
                        url: getDBURL
                    };
                    resolve(rp(dboptions));
                });
                return promise;
            };

            let secondMethod = function (answer: any) {
                let promise = new Promise(function (resolve, reject) {
                    console.log('answer is : ' + JSON.stringify(answer));

                    const xqs = {
                        DateFrom : dateFrom.toISOString().substr(0, 19),
                        DateTo : dateTo.toISOString().substr(0, 19)
                    };
                    console.log(xqs);
                    const xurl = 'https://' + config['aws-hostname'] + config['aws-applicationExecutionTime'];

                    const options: rp.OptionsWithUrl = {
                        headers: {
                            'x-api-key': config['aws-x-api-key'],
                            'RedShiftConnectionString': answer.RedShiftConnectionString,
                            'Username': answer.accessUsername,
                            'Password': answer.accessPswd,
                            'DBName': answer.DBName
                        },
                        json: true,
                        method: 'GET',
                        qs: xqs,
                        url: xurl
                    };

                    resolve(rp(options));
                });
                return promise;
            };

            let thirdMethod = function (awsData: string) {
                let promise = new Promise(function (resolve, reject) {
                    console.log(JSON.stringify(awsData));

                    let mData = [
                        'ExecutionTimeMinutes: int',
                        'AppId: string'
                    ];

                    const user: any = {
                        createdAt: new Date(),
                        metadata: mData,
                        data: awsData
                    };

                    resolve(user);
                });
                return promise;
            };

            let p: any = await getCustomerID().then(firstMethod).then(secondMethod).then(thirdMethod);
            console.log('waiting on p and p is: ' + JSON.stringify(p));
            return p;
        } else {
            throw new Error('invalid auth token');
        }


    }
}