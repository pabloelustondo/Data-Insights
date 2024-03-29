/**
 * Created by vdave on 5/30/2017.
 */
/**
 * Created by vdave on 5/25/2017.
 */
import {Route, Get, Post, Delete, Patch, Example, Request} from 'tsoa';
import {SDS} from '../models/user';
import {QueryModel} from '../models/queryModel';
import * as express from '@types/express';
import {KafkaService} from '../services/kafkaService';
import * as rp from 'request-promise';
let server = require('../server');
const config = require('../../appconfig.json');

@Route('Query')
export class TopicsController {

    /**
     * Sample result of topics returned. It will be an array where each
     * element of the array represents a topic. This is at the tenant level
     * for now
     *
     */

    @Get('Topics')
    @Example<any>({
        dataSetId : 'myCustomQueryID',
        from : ['sourceMetadataId']
    })
    public async Create(@Request() request: express.Request, tenantId: string): Promise<SDS> {

        let req = request;
        let token = req.headers['x-access-token'];

        let kafka = new KafkaService();

        if (token) {
            let server = require('../server');
          //  let appConfig = server.appconfig;
            let appConfig =  require('../../globalconfig.json');
            let mData = ['topics : string [] '];

            if (appConfig.testingmode) {

                let testData = ['vehicleInfo', 'customTopic'];
                // returns test data for now
                 const user: any = {
                    createdAt: new Date(),
                    metadata: mData,
                    data: testData
                };
                return user;
            } else {

                // call dps to get metadata for a tenant

                let testData = ['vehicleInfo', 'customTopic'];
                // returns test data for now

                let xqs = {tenantId: tenantId};

                const xurl = appConfig['dps_url'] + '/getMetadata/' + tenantId;

                const options: rp.OptionsWithUrl = {
                    headers: {
                        'x-api-key': config['aws-x-api-key']
                    },
                    json: true,
                    method: 'GET',
                    qs: xqs,
                    url: xurl
                };

                let p = await rp(options);
                let mData = ['Description of discharge rate', 'NumberOfDevices', 'Rng', 'Percentage'];


                const user: SDS = {
                    createdAt: new Date(),
                    metadata: mData,
                    data: p
                };

                return user;

            }
        } else {

            // TODO: Implement correct error handling. Look at IDA's implementation using TSOA library
            throw new Error ('Missing token');
        }

    }



}