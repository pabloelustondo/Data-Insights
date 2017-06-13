/**
 * Created by vdave on 5/25/2017.
 */
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
import {QueryModel} from '../models/queryModel';
import * as rp from 'request-promise';
// import * as https from 'https';
const config = require('../../appconfig.json');
let server = require('../server');

@Route('Query')
export class QueryController {

    /**
     * This api can be used to post a query that will use the stored metadata in the system to generate
     * and return a dataSet.
     *
     */

    @Post('')
    @Example<any>({
        dataSetId : 'myCustomQueryID',
        from : ['sourceMetadataId']
    })
    public async Create(request: QueryModel): Promise<SDS> {

        let server = require('../../globalconfig.json');

        let appConfig =  require('../../globalconfig.json');
    //    if (request.from[0] === 'vehicleInfo') {

        let mData = [
            'dataSets : ["ttcMaps", "deviceInfo"]'];

        const options: rp.OptionsWithUrl = {
            headers: {
                'x-api-key': config['aws-x-api-key']
            },
            json: true,
            method: 'POST',
            body: {
                metadata : {
                    'filterProperty' : 'prop1',
                    'value' : '3',
                    'queryId' : request.from[0]
                }
            },
            url: appConfig['dps_url'] + '/data/outGoingRequest'
        };
        console.time('deviceNotSurviveShift: aws call');

        let p = await rp(options); // request library used

        // returns test data for now
        const user: any = {
            createdAt: new Date(),
            metadata: mData,
            data: p
        };
        return user;

    }



}