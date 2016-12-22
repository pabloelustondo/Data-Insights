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
export class ListDevicesNotSurvivedShiftController {
    /**
     * List of all devices that may have not lasted the full shift for a given date, shift time, and shift duration.
     *
     * The user can request a complete list by assigning the value -1 to rowsSkip and rowsTake or get a partial list
     * by assigning an appropriate number to the rowsSkip and rowsTake fields.
     *
     * A device is added to the list if:
     * - it's battery was charged or an attempt to charge the device was detected during the shift
     * - if the battery status is reported as 0 at the end of the shift.
     *
     * Required fields are: shiftDuration, shiftStartDateTime, rowsSkip, and rowsTake.
     *
     *     shiftDuration: a number representing the length of the shift in hours.
     *     Eg. A shift of 8 hours can be represented as 8, 8.0
     *     A shift of 7.5 hours can be represented as 7.5
     *
     *     shiftStartTime: a date time must be in date format specified by ISO-8601 format (YYYY-MM-DDTHH:MM:SS).
     *     The time is in UTC time format.
     *
     *     rowsSkip: a number corresponding to the number of records to skip. Acceptable values are
     *     all numbers greater than or equal to -1.
     *
     *     rowsTake; a number corresponding the the number of records to take. Acceptable values are
     *     all numbers greater than or equal to -1.
     */

    @Get('Battery/Summary/listOfDevicesDidNotSurviveShift')
    @Example<any>({
        'createdAt': '2016-11-29T20:30:21.385Z',
        'metadata': [
            'DeviceId: string',
            'LastBatteryStatus: string',
            'BatteryChargeLevel: int[]'
        ],
        'data': [
            {
                'DeviceId': 'abcd',
                'DeviceName': 'Samsung S7',
                'BatteryChargeLevel': '[100,90,80,70,60,50,40,30,20,10,0,0,10,20,30,20]'
            },
            {
                'DeviceId': 'efgh',
                'DeviceName': 'Samsung S6',
                'BatteryChargeLevel': '[100, 100, 100, 90, 90, 90, 90, 30, 0, 0, 0, 0, 10, 70, 30, 20]'
            },
            {
                'DeviceId': 3,
                'DeviceName': 'Samsung S3',
                'BatteryChargeLevel': '[100,90,80,70,60,50,40,30,20,10,0,0, 0, 0, 0, 0]'
            },
            {
                'DeviceId': 'ijklm',
                'DeviceName': 'Samsung S2',
                'BatteryChargeLevel': '[100, 70, 30, 10, 0, 0, 0, 0, 0, 0, 0, 0, 90, 0, 0, 0]'
            },
        ]
    })
    public async Get(shiftDuration: number, rowsSkip: number, rowsTake: number, shiftStartDateTime: Date ): Promise<SDS> {

        let shiftDateTimeString = shiftStartDateTime.toISOString().substr(0, 19);
        let xqs = {};
        if (rowsTake < 0 || rowsSkip < 0) {
            rowsTake = null;
            rowsSkip = null;
            xqs = {shiftDuration: shiftDuration, rowsSkip: 'null', rowsTake: 'null', shiftStartDateTime : shiftDateTimeString};
        } else {
            xqs = {shiftDuration: shiftDuration, rowsSkip: rowsSkip, rowsTake: rowsTake, shiftStartDateTime : shiftDateTimeString};
        }


        console.log(xqs);
        const xurl = 'https://' + config['aws-hostname'] + config['aws-listDeviceNotLasted'];

        const options: rp.OptionsWithUrl = {
            headers: {
                'x-api-key': config['aws-x-api-key']
            },
            json: true,
            method: 'GET',
            qs: xqs,
            url: xurl
        };

        let responseData = await rp(options); // request library used

        let mData = ['CountDevicesNotLastedShift: int', 'TotalActiveDevices: int'];

        const user: SDS = {
            createdAt: new Date(),
            metadata: mData,
            data: responseData
        };

        return user;
    }
}
/**
 * Created by vdave on 12/14/2016.
 */
