/**
 * Created by vdave on 1/9/2017.
 */
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
import {CalculatePredicates} from '../models/reasonModel';
import {Metrics} from '../models/Metrics';


// import * as https from 'https';
const config = require('../../appconfig.json');

@Route('Devices')
export class MultiplePostsController {

    /**
     * This api can be used to retrieve data related to possible reasons for device not lasting shift.
     * To use:
     * Provide the reasonId and the associated parameters with it.
     *
     * Supported reasons:
     * batteryNotFullyChargedBeforeShift
     *  - shiftDuration: int
     *  - shiftStartTime: int
     *  - minimumBatteryPercentageThreshold: int
     *
     */

    @Post('Battery/getMetrics')
    @Example<any>({
        metricName: 'DevicesDidNotLastShift',
        predicates: 'batteryNotFullyChargedBeforeShift',
        params: {
            shiftStartDateTime : '2017-01-01T08:00',
            endDate: '2017-01-12',
            shiftDuration: 8
        }

    })
    public async Create(request: CalculatePredicates): Promise<SDS> {


        if (request.metricName.toString()  !== 'DevicesDidNotLastShift') {
            throw new Error('Metric name not valid');
        }
        if (request.predicates.toString() !== 'batteryNotFullyChargedBeforeShift') {
            throw new Error('batteryNotFullyChargedBeforeShift name not valid');
        }

        console.time('awsPutRecord');

        let mData = ['countDeviceNotFullyChargedBeforeShift: int',
            'totalActiveDevices: int'];

        let max = Math.floor(Math.random() * (5347 - 23)) + 23;


        let returnData = [
            {
                countDeviceNotFullyChargedBeforeShift: Math.floor(Math.random() * (max - 0)) + 0,
                totalActiveDevices: max
            },
            {
                countDeviceNotFullyChargedBeforeShift: Math.floor(Math.random() * (max - 0)) + 0,
                totalActiveDevices: max
            }
        ];

        const user: any = {
            createdAt: new Date(),
            metadata: mData,
            data: returnData
        };
        console.timeEnd('awsPutRecord');
        return user;
    }



}