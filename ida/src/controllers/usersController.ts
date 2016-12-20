import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
import {SDSBattery} from '../models/batteryData';

import * as express from 'express';
import * as methodOverride from 'method-override';

// import * as https from 'https';
const config = require('../../appconfig.json');
 const awsPush = require('../awsPush');


import * as querystring from 'querystring';
import * as rp from 'request-promise';
@Route('Devices/Stat')
export class SDSController {

    /**
     * Post a unit of data to be stored in the cloud analytics database.
     * This api allows a user to post device data.
     */


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
    public async Create(request: SDSBattery): Promise<SDS> {

      awsPush.putRecord(request);
        return  {
            metadata: 'Thanks a lot',
            createdAt: new Date()
        };
    }

    // Build the post string from an object
}
