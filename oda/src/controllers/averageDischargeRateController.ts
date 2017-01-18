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
     * The AverageDischargeRate represents how quickly the battery is losing the charge per hour over the specified
     * number of days.
     *
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
    public async Get(dateFrom: Date, dateTo: Date, shiftStartDateTime: Date, shiftDuration: number, minimumBatteryPercentageThreshold?: number): Promise<SDS> {



        if (dateFrom.getDate() !== shiftStartDateTime.getDate()) {
            throw new Error('shift start data time != to dateFrom');
        }

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

        // let p = await rp(options); // request library used
        let mData = [''];

        let returnData1 = [
            {
                percentage: 5,
                countOfDevices: 1874
            },
            {
                percentage: 10,
                countOfDevices: 6520
            },
            {
                percentage: 15,
                countOfDevices: 172
            },
            {
                percentage: 20,
                countOfDevices: 21
            },
            {
                percentage: 25,
                countOfDevices: 10
            },
            {
                percentage: 30,
                countOfDevices: 0
            },
            {
                percentage: 35,
                countOfDevices: 0
            },
            {
                percentage: 45,
                countOfDevices: 172
            },
            {
                percentage: 45,
                countOfDevices: 21
            },
            {
                percentage: 50,
                countOfDevices: 10
            },
            {
                percentage: 55,
                countOfDevices: 0
            },
            {
                percentage: 60,
                countOfDevices: 0
            },
            {
                percentage: 65,
                countOfDevices: 0
            },
            {
                percentage: 70,
                countOfDevices: 21
            },
            {
                percentage: 75,
                countOfDevices: 0
            },
            {
                percentage: 80,
                countOfDevices: 0
            },
            {
                percentage: 85,
                countOfDevices: 0
            },
            {
                percentage: 90,
                countOfDevices: 0
            },
            {
                percentage: 95,
                countOfDevices: 0
            },
            {
                percentage: 100,
                countOfDevices: 0
            }
        ];



        let returnData2 = [
            {
                percentage: 5,
                countOfDevices: 187
            },
            {
                percentage: 10,
                countOfDevices: 650
            },
            {
                percentage: 15,
                countOfDevices: 172
            },
            {
                percentage: 20,
                countOfDevices: 925
            },
            {
                percentage: 25,
                countOfDevices: 10
            },
            {
                percentage: 30,
                countOfDevices: 0
            },
            {
                percentage: 35,
                countOfDevices: 0
            },
            {
                percentage: 45,
                countOfDevices: 172
            },
            {
                percentage: 45,
                countOfDevices: 21
            },
            {
                percentage: 50,
                countOfDevices: 107
            },
            {
                percentage: 55,
                countOfDevices: 0
            },
            {
                percentage: 60,
                countOfDevices: 85
            },
            {
                percentage: 65,
                countOfDevices: 0
            },
            {
                percentage: 70,
                countOfDevices: 21
            },
            {
                percentage: 75,
                countOfDevices: 0
            },
            {
                percentage: 80,
                countOfDevices: 2
            },
            {
                percentage: 85,
                countOfDevices: 0
            },
            {
                percentage: 90,
                countOfDevices: 0
            },
            {
                percentage: 95,
                countOfDevices: 0
            },
            {
                percentage: 100,
                countOfDevices: 0
            }
        ];
        let returnData = returnData1;

        let x1 = dateFrom.getMonth();
        if (dateFrom.getMonth() === 7) {
            returnData = returnData2;
        }
        const user: any = {
            createdAt: new Date(),
            metadata: mData,
            data: returnData
        };

        return user;
    }


}
