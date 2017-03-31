/**
 * Created by vdave on 2/15/2017.
 */
import {Route, Get, Post, Delete, Patch, Example, Request} from 'tsoa';
import {SDS} from '../models/user';
import * as express from '@types/express';
import * as rp from 'request-promise';
const config = require('../../appconfig.json');
let jwt  = require('jsonwebtoken');

@Route('Devices')
export class NumberOfApplicationInstalls {

    /**
     * This api is used to provide a snapshot of number of application installs across all devices
     *
     * To use:
     * Provide the access token in the header parameter that contains the registered tenant
     *
     */

    @Get('Application/numberOfInstallations')

    public async Get( @Request() request: express.Request): Promise<SDS> {

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

                    const xurl = 'https://' + config['aws-hostname'] + config['aws-numberOfAppInstallations'];

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
                        url: xurl
                    };


                    resolve(rp(options));
                });
                return promise;
            };

            let thirdMethod = function (awsData: string) {
                let promise = new Promise(function (resolve, reject) {
                    console.log(JSON.stringify(awsData));

                    let mData = ['NumberOfInstallations: int',
                        'AppId: string'];

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