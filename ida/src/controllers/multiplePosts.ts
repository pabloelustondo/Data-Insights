import {Route, Get, Post, Delete, Patch, Example, Request} from 'tsoa';
import {SDS} from '../models/user';
import {ListBatteryStats} from '../models/listBatteryStats';
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


@Route('Devices/MultipleStats')
export class MultiplePostsController {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */

    @Post('MultiplePosts')
    @Example<any>({
        headers: {
            'x-access-token': 'Future Private Access Key',
            'Accept': 'application/json'
        },
        json: true,
        url: 'https://localhost:3010/data',
        data: {
            dev_id: '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
            server_time_stamp: '2016-12-08T19:12:15.235Z',
            int_value: 123456789123,
            stat_type: 1234,
            time_stamp: '2016-12-08T19:13:15.235Z'
        }
    })
    public async Create(request: ListBatteryStats, @Request() express: express.Request): Promise<SDS> {




        let req = express;
        let token = req.headers['x-access-token'];
        let dataTable= req.headers['table-name'];

        if (request.stats.length > 500) {
            throw new Error('Maximum Record input Length Exceeded: ' + request.stats.length);
        }
        if (request.stats.length < 1) {
            throw new Error('Minimum Record input Length of 1 not met: ' + request.stats.length);
        }

        if (token) {

            let getCustomerID = function () {
                let promise = new Promise(function (resolve, reject) {
                    resolve(jwt.verify(token, config['expiring-secret']));
                });
                return promise;
            };

            let convertToAwsParams = function () {
                let promise = new Promise(function (resolve, reject) {

                    let dataMapping: any[] = [];
                    let dataLength: number = request.stats.length;
                    let index: number;
                    for (index = 0; index < dataLength; index++) {
                        let awsStat = { Data: JSON.stringify(request.stats[index])};
                        dataMapping.push(awsStat);
                    }
                    let recordParams = {
                        Records: dataMapping,
                        DeliveryStreamName: 'da_firehose'
                    };
                    resolve(recordParams);
                });
                return promise;
            };

            let awsResponseCall = function (awsP: any) {
                let promise = new Promise(function (resolve) {
                    let x = firehose.putRecordBatch (awsP, function (resp: any) {
                        x = resp;
                        resolve(x);
                    });
                  });
                return promise;
            };
            let firstMethod = function (awsParams: any) {
                let promise = new Promise(function (resolve, reject) {

                    let responseA = awsParams;
                    resolve (responseA);
                });
                return promise;
            };

            let responseData = function (awsRes: any) {
                let promise = new Promise(function (resolve, reject) {

                    let mData = ['countOfDevices: int',
                        'percentage: int'];

                    const user: any = {
                        createdAt: new Date(),
                        metadata: mData,
                        data: awsRes
                    };

                    resolve(user);
                });
                return promise;
            };

            let p: any = await getCustomerID().then(convertToAwsParams).then(awsResponseCall).then(firstMethod).then(responseData);

            return p;
        } else {
            throw new Error('invalid auth token');
        }



    }

}
/**
 * Created by vdave on 12/6/2016.
 */
