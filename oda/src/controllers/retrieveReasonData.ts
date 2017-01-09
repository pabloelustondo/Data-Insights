/**
 * Created by vdave on 1/9/2017.
 */
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
import {ReasonModel} from '../models/reasonModel';

// import * as https from 'https';
const config = require('../../appconfig.json');

@Route('Battery/Summary')
export class MultiplePostsController {

    /**
     * This api can be used to retrieve data related to possible reasons for device not lasting shift.
     * To use:
     * Provide the reasonId and the associated parameters with it.
     *
     * Supported reasons:
     * batteryNotFully Charged
     */

    @Post('possibleReasons')
    @Example<any>({
        headers: {
            'X-API-key': 'Future Private Access Key',
            'Accept': 'application/json'
        },
        json: true,
        url: 'http://localhost:3003/data',
        data:  {
            reasonId: 'deviceNotFullyCharged',
            parameters: [
                {
                    name: 'date',
                    value: '2016-08-25'
                },
                {
                    name: 'shiftStartTime',
                    value: '09:00:00'
                },
                {
                    name: 'shiftDuration',
                    value: '8'
                },
                {
                    name: 'minimumThresholdValue',
                    value: '5'
                }
            ]
        }
    })
    public async Create(request: ReasonModel): Promise<SDS> {



        console.time('awsPutRecord');
        console.timeEnd('awsPutRecord');
        let mData = ['CountDevicesLastedShift: int',
            'CountDevicesNotLastedShift: int',
            'CountDevicesChargingEntireShift: int',
            'TotalActiveDevices: int'];

        const user: SDS = {
            createdAt: new Date(),
            metadata: mData,
            data: ['hello']
        };
        return user;
    }



}