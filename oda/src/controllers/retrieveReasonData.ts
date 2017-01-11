/**
 * Created by vdave on 1/9/2017.
 */
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
import {ReasonModel} from '../models/reasonModel';
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
     * batteryNotFullyCharged
     *  - shiftDuration: int
     *  - shiftStartTime: int
     *  - minimumBatteryPercentageThreshold: int
     *
     */

    @Post('Battery/getMetrics')
    @Example<any>({
        metricName: 'DevicesDidNotLastShift',
        predicates: 'batteryNotFullyChargedBeforeShift',
        parameters: [
            {
                parameterName: 'date',
                parameterValue: '2016-08-25'
            },
            {
                parameterName: 'shiftStartTime',
                parameterValue: '09:00:00'
            },
            {
                parameterName: 'shiftDuration',
                parameterValue: '8'
            },
            {
                parameterName: 'minimumThresholdValue',
                parameterValue: '5'
            }
        ]

    })
    public async Create(request: ReasonModel): Promise<SDS> {


        if (request.metricName.toString()  !== 'DevicesDidNotLastShift') {
            throw new Error('Metric name not valid');
        }
        if (request.predicates.toString() !== 'batteryNotFullyChargedBeforeShift') {
            throw new Error('batteryNotFullyChargedBeforeShift name not valid');
        }

        console.time('awsPutRecord');

        let mData = ['countDeviceNotFullyChargedBeforeShift: int',
            'totalActiveDevices'];

        let max = Math.floor(Math.random() * (5347 - 23)) + 23;


        let returnData = [{
            countDeviceNotFullyChargedBeforeShift: Math.floor(Math.random() * (max - 0)) + 0,
            totalActiveDevices: max
        }];

        const user: any = {
            createdAt: new Date(),
            metadata: mData,
            data: returnData
        };
        console.timeEnd('awsPutRecord');
        return user;
    }



}