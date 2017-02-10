/**
 * Created by vdave on 1/10/2017.
 */
import * as express from '@types/express';
import {Route, Get, Example, Request} from 'tsoa';
import {SDS} from '../models/user';

let jwt  = require('jsonwebtoken');

// import * as https from 'https';
const config = require('../../appconfig.json');
import * as querystring from 'querystring';

import * as rp from 'request-promise';

@Route('Devices')
export class AverageDischargeRateController {
    /**
     * The AverageDischargeRate represents how quickly the battery is losing the charge per hour over the specified
     * number of days.
     *
     * A date range specified by start date and end date is required to get the information.
     * Shift start date time is required, the date in this field must be the same as the start date.
     * Shift duration is also required to define the length of the shift.
     */

    @Get('Battery/Summary/AverageDischargeRate')
    @Example<any>({
        'createdAt': '2016-11-29T20:30:21.385Z',
        'data': [
            {
                'Percentage': 5,
                'Count': 30
            },
            {
                'Percentage': 10,
                'Count': 40
            },
            {
                'Percentage': 15,
                'Count': 25
            },
            {
                'Percentage': 20,
                'Count': 67
            },
            {
                'Percentage': 25,
                'Count': 87
            },
            {
                'Percentage': 30,
                'Count': 30
            },
            {
                'Percentage': 35,
                'Count': 10
            },
            {
                'Percentage': 40,
                'Count': 15
            },
            {
                'Percentage': 45,
                'Count': 11
            },
            {
                'Percentage': 50,
                'Count': 2
            },
            {
                'Percentage': 55,
                'Count': 8
            },
            {
                'Percentage': 60,
                'Count': 9
            },
            {
                'Percentage': 65,
                'Count': 3
            },
            {
                'Percentage': 70,
                'Count': 0
            },
            {
                'Percentage': 75,
                'Count': 0
            },
            {
                'Percentage': 80,
                'Count': 0
            },
            {
                'Percentage': 85,
                'Count': 0
            },
            {
                'Percentage': 90,
                'Count': 0
            },
            {
                'Percentage': 95,
                'Count': 0
            },
            {
                'Percentage': 100,
                'Count': 0
            }
        ]
    })

    public async Get(dateTo: Date, shiftStartDateTime: Date, shiftDuration: number, @Request() request: express.Request, minimumBatteryPercentageThreshold?: number, dateFrom?: Date): Promise<SDS> {

        let req = request;
        let token = req.headers['x-access-token'];
        let shiftDateTimeString = shiftStartDateTime.toISOString().substr(0, 19);

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

                const getDBURL = 'http://localhost:8000/getDBAccess/' + decodedToken.tenantid;

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

                const xqs = {shiftStartDateTime: shiftDateTimeString, endDate: dateTo, shiftDuration: shiftDuration};
                console.log(xqs);
                const xurl = 'https://' + config['aws-hostname'] + config['aws-listAverageDischargeRate'];

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

                let mData = ['countOfDevices: int',
                    'percentage: int'];

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
