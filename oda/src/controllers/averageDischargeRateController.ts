/**
 * Created by vdave on 1/10/2017.
 */
import {Route, Get, Example} from 'tsoa';
import {SDS} from '../models/user';
// import * as https from 'https';
const config = require('../../appconfig.json');
import * as querystring from 'querystring';

import * as rp from 'request-promise';
@Route('Devices')
export class AverageDischargeRateController {
    /**
     * DO NOT USE THIS: WORK IN PROGRESS
     * The AverageDischargeRate represents how quickly the battery is losing the charge per hour over the specified
     * number of days.
     * This data is retrieved every hour for a given day.
     * A date range is required to get the information.
     */

    @Get('Battery/Summary/AverageDischargeRate')
    @Example<any>({
        'createdAt': '2016-11-29T20:30:21.385Z',
        'data': [
            {
                'Percentage': 1,
                'Count': 30
            },
            {
                'Percentage': 2,
                'Count': 40
            },
            {
                'Percentage': 4,
                'Count': 25
            },
            {
                'Percentage': 7,
                'Count': 67
            },
            {
                'Percentage': 8,
                'Count': 87
            },
            {
                'Percentage': 10,
                'Count': 30
            },
            {
                'Percentage': 15,
                'Count': 10
            },
            {
                'Percentage': 25,
                'Count': 15
            },
            {
                'Percentage': 30,
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
                'Percentage': 57,
                'Count': 9
            },
            {
                'Percentage': 67,
                'Count': 3
            },
            {
                'Percentage': 100,
                'Count': 1
            }
        ]
    })
    public async Get(dateFrom: string, dateTo: string, shiftStartTime: string, shiftDuration: string): Promise<SDS> {

        const xqs = {dateFrom: dateFrom, dateTo: dateTo };
        const xurl = 'https://' + config['aws-hostname'] + config['aws-discharge'];

        const options: rp.OptionsWithUrl = {
            headers: {
                'x-api-key': config['aws-x-api-key']
            },
            json: true,
            method: 'GET',
            qs: xqs,
            url: xurl
        };

        let p = await rp(options); // request library used
        let mData = ['Description of discharge rate', 'NumberOfDevices', 'DischargeRate'];

        const user: SDS = {
            createdAt: new Date(),
            metadata: mData,
            data: [
                'hello'
            ]
        };

        return user;
    }


}
