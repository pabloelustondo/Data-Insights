import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
import {ListBatteryStats} from '../models/listBatteryStats';
// import * as https from 'https';
const config = require('../../appconfig.json');
import * as querystring from 'querystring';
import * as rp from 'request-promise';

import {SDSBattery} from '../models/batteryData';
const awsPush = require('../awsPush');

@Route('Devices/MultipleStats')
export class MultiplePostsController {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */

    @Post('MultiplePosts')
    @Example<any>({
        headers: {
            'X-API-key': 'Future Private Access Key',
            'Accept': 'application/json'
        },
        json: true,
        url: 'http://localhost:3003/data',
        data: {
            dev_id: '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
            server_time_stamp: '2016-12-08T19:12:15.235Z',
            int_value: 123456789123,
            stat_type: 1234,
            time_stamp: '2016-12-08T19:13:15.235Z'
        }
    })
    public async Create(request: ListBatteryStats): Promise<SDS> {

        if (request.stats.length > 500) {
            throw new Error('Maximum Record input Length Exceeded: ' + request.stats.length);
        }
        if (request.stats.length < 1) {
            throw new Error('Minimum Record input Length of 1 not met: ' + request.stats.length);
        }
        awsPush.putRecordBatch(request);
        return  {
            metadata: 'Thanks a lot: records that will be sent = ' + request.stats.length,
            createdAt: new Date()
        };
    }



}
/**
 * Created by vdave on 12/6/2016.
 */
