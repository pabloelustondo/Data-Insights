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
export class CountDevicesNotSurvivedShiftController {
    /**
     * This API returns Number of devices that did not last the full shift for a given date and time, and the shift duration.
     * The required fields are shiftStartDateTime and shiftDuration field. It also returns the total number of devices that were
     * active in the shift.
     *
     * A device is added to the count if it has been charged during the shift.
     *
     *     shiftDuration: a number representing the length of the shift in hours.
     *     Eg. A shift of 8 hours can be represented as 8, 8.0
     *     A shift of 7.5 hours can be represented as 7.5
     *
     *     shiftStartTime: a date time must be in date format YYYY-MM-DDTHH:MM:SS
     *     where YYYY-MM-DD = Year in 4 digits, followed by month, followed by day of the month
     *     T - A static string value
     *     HH:MM:SS - Hour, minute and seconds.
     *
     */

    @Get('Battery/Summary/countOfDevicesDidNotSurviveShift')
    @Example<any>({
        'createdAt': '2016-11-29T20:30:21.385Z',
        'metadata': [
            'CountDevicesNotLastedShift: int',
            'TotalActiveDevices: int'
        ],
        'data': [
            {
                'CountDevicesNotLastedShift': '25',
                'TotalActiveDevices': '100'
            }
        ]
    })
    public async Get(shiftDuration: number, shiftStartDateTime: Date): Promise<SDS> {


       // let date = shiftStartTime.getFullYear().toString() + '-' + shiftStartTime.getMonth().toString() + '-' + shiftStartTime.getDate().toString();
      //  let time = shiftStartTime.getHours().toString() + ':' + shiftStartTime.getMinutes().toString() + ':00';

        let shiftDateTimeString = shiftStartDateTime.toISOString().substr(0, 19);


        const xqs = {shiftDuration: shiftDuration, shiftStartDateTime : shiftDateTimeString};
        console.log(xqs);
        const xurl = 'https://' + config['aws-hostname'] + config['aws-deviceNotLasted'];

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
        let mData = ['CountDevicesNotLastedShift: Count of devices that did not last full shift', 'TotalActiveDevices: Total devices active per day'];

        const user: SDS = {
            createdAt: new Date(),
            metadata: mData,
            data: p
        };

        return user;
    }
}
/**
 * Created by vdave on 12/14/2016.
 */
