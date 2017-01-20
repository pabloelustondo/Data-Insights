/**
 * Created by vdave on 1/9/2017.
 */
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
import {CalculatePredicates} from '../models/reasonModel';
import {Metrics} from '../models/Metrics';
import * as rp from 'request-promise';
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


        const xurl = 'https://' + config['aws-hostname'] + config['aws-batteryNotFullyCharged'];

        const options: rp.OptionsWithUrl = {
            headers: {
                'x-api-key': config['aws-x-api-key']
            },
            json: true,
            method: 'POST',
            body: {
              predicates: request.predicates,

                metricName: request.metricName,
                parameters: {
                    'shiftStartDateTime': request.parameters.shiftStartDateTime.toISOString().substring(0, 19),
                    'endDate': request.parameters.endDate.toISOString().substring(0, 10),
                    'shiftDuration': request.parameters.shiftDuration.toString(),
                    'minimumBatteryPercentageThreshold': request.parameters.minimumBatteryPercentageThreshold.toString()
                }
            },
            url: xurl
        };
        console.time('deviceNotSurviveShift: aws call');

        let p = await rp(options); // request library used
        console.timeEnd('deviceNotSurviveShift: aws call');

        let mData = ['countDeviceNotFullyChargedBeforeShift: int',
            'totalActiveDevices: int'];

        const user: any = {
            createdAt: new Date(),
            metadata: mData,
            data: p
        };

        return user;
    }



}