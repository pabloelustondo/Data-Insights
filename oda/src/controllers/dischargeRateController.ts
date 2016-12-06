/**
 * Created by vdave on 11/30/2016.
 */
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
// import * as https from 'https';
const config = require('../../appconfig.json');
import * as querystring from 'querystring';

import * as rp from 'request-promise';
@Route('Devices')
export class DischargeRateController {
    /**
     * A DischargeRate represents how quickly the battery is losing the charge per hour.
     * This data is retrieved every hour for a given day.
     * A date range is required to get the information.
     */

    @Get('Battery/Summary/DischargeRate')
    @Example<any>({
        'createdAt': '2016-11-29T20:30:21.385Z',
        'data': [
            {
                'NumberOfDevices': '4',
                'DischargeRate': 2
            },
            {
                'NumberOfDevices': '6',
                'DischargeRate': 3
            },
            {
                'NumberOfDevices': '24',
                'DischargeRate': 4
            },
            {
                'NumberOfDevices': '58',
                'DischargeRate': 5
            },
            {
                'NumberOfDevices': '53',
                'DischargeRate': 6
            },
            {
                'NumberOfDevices': '27',
                'DischargeRate': 7
            },
            {
                'NumberOfDevices': '18',
                'DischargeRate': 8
            },
            {
                'NumberOfDevices': '3',
                'DischargeRate': 9
            },
            {
                'NumberOfDevices': '3',
                'DischargeRate': 10
            },
            {
                'NumberOfDevices': '1',
                'DischargeRate': 12
            },
            {
                'NumberOfDevices': '1',
                'DischargeRate': 14
            },
            {
                'NumberOfDevices': '4',
                'Percentage': 16
            },
            {
                'NumberOfDevices': '14',
                'DischargeRate': 17
            },
            {
                'NumberOfDevices': '1',
                'DischargeRate': 22
            },
            {
                'NumberOfDevices': '1',
                'DischargeRate': 45
            }
        ]
    })
    public async Get(dateFrom: string, dateTo: string): Promise<SDS> {

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
            data: p
        };

        return user;
    }
}
