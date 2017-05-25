/**
 * Created by vdave on 5/25/2017.
 */
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
import {QueryModel} from '../models/queryModel';
import {Metrics} from '../models/metrics';
import * as rp from 'request-promise';
// import * as https from 'https';
const config = require('../../appconfig.json');

@Route('Query')
export class QueryController {

    /**
     * This api can be used to post a query that will use the stored metadata in the system to generate
     * and return a dataSet.
     *
     *
     */

    @Post('')
    @Example<any>({
        dataSetId : 'myCustomQueryID',
        from : ['sourceMetadataId']
    })
    public async Create(request: QueryModel): Promise<SDS> {


        if (request.from[0] === 'vehicleInfo') {
            let mData = [
                'dataSets : ["ttcMaps", "deviceInfo"]'];

            // returns test data for now
            const user: any = {
                createdAt: new Date(),
                metadata: mData,
                data: [
                    {'ttcMaps' : [
                        {
                            data : [{
                                'id' : '1551',
                                'lon' : '-79.493118',
                                'routeTag' : '32',
                                'predictable' : 'true',
                                'dirTag' : '32_0_mp32sch',
                                'heading' : '216',
                                'lat' : '43.688217',
                                'secsSinceReport' : '19'
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
                                'secsSinceReport' : '11'
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
                    ]}, {
                        'customData' : [
                            {
                                data : [
                                    {
                                        busId : 1151,
                                        deviceId : '0001',
                                        name : 'device1'
                                    },
                                    {
                                        busId : 1151,
                                        deviceId : '0002',
                                        name : 'device2'
                                    },
                                    {
                                        busId : 1151,
                                        deviceId : '0003',
                                        name : 'device3'
                                    },
                                    {
                                        busId : 1073,
                                        deviceId : '0004',
                                        name : 'device1'
                                    },
                                    {
                                        busId : 1073,
                                        deviceId : '0005',
                                        name : 'device2'
                                    },
                                    {
                                        busId : 1073,
                                        deviceId : '0006',
                                        name : 'device4'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
            return user;
        } else {
            let mData = ['Query Not supported'];


            const user: SDS = {
                createdAt: new Date(),
                metadata: mData,
                data: ['query not supported']
            };

            return user;
        }


    }



}