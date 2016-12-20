import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
// import * as https from 'https';
const config = require('../../appconfig.json');
import * as querystring from 'querystring';

import * as rp from 'request-promise';
@Route('Devices')
export class SDSController {

    /**
     * An InitialChargeLevel represent the battery charge level at the moment where a device is taken from the charger.
     * This event may happen many times during the specified time period and
     * this data set provides the count of how many times this event happen for a given battery level range.
     */

    @Get('Battery/Summary/InitialChargeLevels')
    @Example<any>({
        'createdAt': '2016-11-29T20:30:21.385Z',
        'data': [
            {
                'NumberOfDevices': '1',
                'Rng': '0-10',
                'Percentage': '0.00032776138970829'
            },
            {
                'NumberOfDevices': '14',
                'Rng': '11-20',
                'Percentage': '0.00458865945591609'
            },
            {
                'NumberOfDevices': '13',
                'Rng': '21-30',
                'Percentage': '0.00426089806620780'
            },
            {
                'NumberOfDevices': '18',
                'Rng': '31-40',
                'Percentage': '0.00589970501474926'
            },
            {
                'NumberOfDevices': '22',
                'Rng': '41-50',
                'Percentage': '0.00721075057358243'
            },
            {
                'NumberOfDevices': '42',
                'Rng': '51-60',
                'Percentage': '0.01376597836774827'
            },
            {
                'NumberOfDevices': '61',
                'Rng': '61-70',
                'Percentage': '0.01999344477220583'
            },
            {
                'NumberOfDevices': '105',
                'Rng': '71-80',
                'Percentage': '0.03441494591937069'
            },
            {
                'NumberOfDevices': '295',
                'Rng': '81-90',
                'Percentage': '0.09668960996394624'
            },
            {
                'NumberOfDevices': '2480',
                'Rng': '91-100',
                'Percentage': '0.81284824647656506'
            }
        ]
    })
    public async Get(dateFrom: string, dateTo: string): Promise<SDS> {

        const xqs = {dateFrom: dateFrom, dateTo: dateTo };
        const xurl = 'https://' + config['aws-hostname'] + config['aws-path'];

        const options: rp.OptionsWithUrl = {
            headers: {
                'x-api-key': config['aws-x-api-key']
            },
            json: true,
            method: 'GET',
            qs: xqs,
            url: xurl
        };

        let p = await rp(options);
        let mData = ['Description of discharge rate', 'NumberOfDevices', 'Rng', 'Percentage'];


        const user: SDS = {
            createdAt: new Date(),
            metadata: mData,
            data: p
        };

        return user;
    }
}
