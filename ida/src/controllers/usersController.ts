import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
import {SDSBattery} from '../models/batteryData';

import * as express from 'express';
import * as methodOverride from 'method-override';

// import * as https from 'https';
const config = require('../../appconfig.json');
const awsPush = require('../../../pdic/src/awsPush');

import * as querystring from 'querystring';
import * as rp from 'request-promise';
@Route('Data')
export class SDSController {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */


    @Post()
    @Example<any>({
    metadata: 'here is where metadata explaining the data should go',
    createdAt: '2016-08-08',
    data: ['aaa', 'bbb', 'ccc']
    })
    public async Create(request: SDSBattery, optionalString?: string): Promise<SDS> {

        awsPush.putRecord(request);
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



}
