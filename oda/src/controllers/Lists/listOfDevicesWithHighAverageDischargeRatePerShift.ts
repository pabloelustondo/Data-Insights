/**
 * Created by vdave on 1/16/2017.
 */
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../../models/user';

const config = require('../../../appconfig.json');
import * as rp from 'request-promise';

@Route('Devices')
export class ListOfDevicesWithHighAverageDischargeRatePerShift {
/**
 * List of all devices that had high average discharge rate per shift. The devices
 *
 * The API returns a list of devices specified using the rowsSkip and rowsTake parameters. The complete list
 * can be retrieved by assigning the value -1 to rowsSkip and rowsTake. Each device in the contains the following
 * information:
 * - Device ID
 * - Last reported status
 * - List of battery values reported during the shift.
 *
 * Note: The device information returned in the list is subject to change in the future version. User will be able
 * to determine the desired device metric(s).
 *
 * A device is added to the list if:
 * - the average discharge rate was above the threshold specified by the customer. (Default is 70%)
 *
 * Required fields are: shiftDuration, shiftStartDateTime, rowsSkip, rowsTake, and minimumThresholdDischargeRate.
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
 *
 *     minimumBatteryPercentageThreshold: the minimum battery percentage the device has to fall below in
 *     order to be included in the listOfDevicesDidNotSurviveShift
 */

@Get('Battery/List/DidNotSurviveShift/HighAverageDischargeRatePerShift')
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
            'DeviceId': 'nopqrs',
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
public async Get(shiftDuration: number, rowsSkip: number, rowsTake: number, shiftStartDateTime: Date,  minimumThresholdDischargeRate: number ): Promise<SDS> {

    let shiftDateTimeString = shiftStartDateTime.toISOString().substr(0, 19);
let xqs = {};

if (rowsTake < -1 || rowsSkip < -1) {
    throw new Error('invalid row skip and rows take');
}


if (rowsTake === -1 || rowsSkip === -1) {
    rowsTake = null;
    rowsSkip = null;
    xqs = {shiftDuration: shiftDuration, rowsSkip: 'null', rowsTake: 'null', shiftStartDateTime : shiftDateTimeString, minimumThresholdDischargeRate: minimumThresholdDischargeRate};
} else {
    xqs = {shiftDuration: shiftDuration, rowsSkip: rowsSkip, rowsTake: rowsTake, shiftStartDateTime : shiftDateTimeString, minimumThresholdDischargeRate: minimumThresholdDischargeRate};
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