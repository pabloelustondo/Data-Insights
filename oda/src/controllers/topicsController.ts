/**
 * Created by vdave on 5/30/2017.
 */
/**
 * Created by vdave on 5/25/2017.
 */
import {Route, Get, Post, Delete, Patch, Example, Request} from 'tsoa';
import {SDS} from '../models/user';
import {QueryModel} from '../models/queryModel';
import {Metrics} from '../models/metrics';
import * as express from '@types/express';
import {KafkaService} from '../services/kafkaService';
import * as rp from 'request-promise';
// import * as https from 'https';
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
    public async Create(@Request() request: express.Request): Promise<SDS> {

        let req = request;
        let token = req.headers['x-access-token'];

        let kafka = new KafkaService();

        if (token) {

            let mData = ['topics : string [] '];


            let client = kafka.getClient('tenantId'); // pass in tenantId to get client for a tenant (R

            /*
            client.once('connect', function () {
                client.loadMetadataForTopics([], function (error: any, results: any) {
                    if (error) {
                        return console.error(error);
                    }
                    console.log('%j', _.get(results, '1.metadata'));
                });
            });
            */
            let testData = ['vehicleInfo', 'customTopic'];
            // returns test data for now

            const user: any = {
                createdAt: new Date(),
                metadata: mData,
                data: testData
            };
            return user;
        } else {

            // TODO: Implement correct error handling. Look at IDA's implementation using TSOA library
            throw new Error ('Missing token');
        }

    }



}