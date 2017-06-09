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
        if (request.from[0] === 'vehicleInfo') {

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
                        'queryId' : 'ttc'
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
        } else {
            let mData = ['Query Not supported, returning sample test data for ttc vehicle and device together'];

            const user: any = {
                createdAt: new Date(),
                metadata: mData,
                data:
                    {
                        'result' : [
                            {
                                'id' : '1551',
                                'lon' : '-79.493118',
                                'routeTag' : '32',
                                'predictable' : 'true',
                                'dirTag' : '32_0_mp32sch',
                                'heading' : '216',
                                'lat' : '43.688217',
                                'secsSinceReport' : '19',
                                'deviceId': '123456789',
                                'flag': 0,
                                'Name': 'VehicleID',
                                'Value': 1151
                            }, {
                                'id' : '1552',
                                'lon' : '-79.473118',
                                'routeTag' : '33',
                                'predictable' : 'true',
                                'dirTag' : '33_0_mp32sch',
                                'heading' : '216',
                                'lat' : '43.689217',
                                'secsSinceReport' : '19'
                            }, {
                                'id' : '1406',
                                'lon' : '-79.531631',
                                'routeTag' : '32',
                                'predictable' : 'true',
                                'dirTag' : '32_1_32A',
                                'heading' : '257',
                                'lat' : '43.6813999',
                                'secsSinceReport' : '21'
                            },
                            {
                                'id' : '1073',
                                'lon' : '-79.439537',
                                'routeTag' : '32',
                                'predictable' : 'true',
                                'dirTag' : '32_0_32D',
                                'heading' : '74',
                                'lat' : '43.697884',
                                'secsSinceReport' : '11',
                                'deviceId': '{10101010-1010-1010-1010-101010101010}',
                                'flag': 0,
                                'Name': 'VehicleID',
                                'Value': 1073
                            },
                            {
                                'id' : '1548',
                                'lon' : '-79.5039369',
                                'routeTag' : '32',
                                'predictable' : 'true',
                                'dirTag' : '32_1_32C',
                                'heading' : '252',
                                'lat' : '43.700733',
                                'secsSinceReport' : '19'
                            },
                            {
                                'id' : '1405',
                                'lon' : '-79.47538',
                                'routeTag' : '32',
                                'predictable' : 'true',
                                'dirTag' : '32_0_32D',
                                'heading' : '72',
                                'lat' : '43.689983',
                                'secsSinceReport' : '12'
                            }
                        ]
                    }
            };
            return user;

        }


    }



}