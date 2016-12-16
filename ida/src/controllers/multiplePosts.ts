import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
// import * as https from 'https';
const config = require('../../appconfig.json');
import * as querystring from 'querystring';
import * as rp from 'request-promise';

import {SDSBattery} from '../models/batteryData';


@Route('Devices/MultipleStats')
export class MultiplePostsController {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */

    @Post()
    @Example<any>({
        metadata: 'tbd',
        createdAt: '2016-08-08',
        data: ['aaa', 'bbb', 'ccc']
    })
    public async Create(request: SDS, optionalString?: string): Promise<SDS> {

        this.amazonCall(request, optionalString);
        return  {
            metadata: 'Thanks a lot',
            createdAt: new Date()
        };
    }

    private async amazonCall (request: SDS, optionString?: string): Promise<SDS> {
        return  {
            metadata: 'Thanks a lot',
            createdAt: new Date()
        };
    }
    // Build the post string from an object

    @Post()
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
    public async Create2(request: SDSBattery): Promise<SDS> {

        // awsPush.putRecord(request);
        return  {
            metadata: 'Thanks a lot',
            createdAt: new Date()
        };
    }



}
/**
 * Created by vdave on 12/6/2016.
 */
