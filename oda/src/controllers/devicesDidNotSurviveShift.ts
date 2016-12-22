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
     * This API returns the number of devices that may not have lasted the full shift for a given date, time, and the shift duration.
     * It also returns the total number of devices that were active in the shift. An active device is any device that
     * reported a battery status for the defined shift duration. If the device was off or did not report battery status
     * it is not included in the data returned.
     *
     * A device is added to the CountDevicesNotLastedShift if:
     * - it has been charged or an attempt to charge the device has been detected during the shift
     * - if it's battery drained to 0% at the end of the shift.
     *
     * The required fields are shiftStartDateTime and shiftDuration field.
     *
     *     shiftDuration: a number representing the length of the shift in hours.
     *     Eg. A shift of 8 hours can be represented as 8, 8.0
     *     A shift of 7.5 hours can be represented as 7.5
     *
     *     shiftStartTime: a date time must be in date format specified by ISO-8601 format (YYYY-MM-DDTHH:MM:SS).
     *     The time is in UTC time format.
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
        let mData = ['CountDevicesNotLastedShift: int', 'TotalActiveDevices: int'];

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
