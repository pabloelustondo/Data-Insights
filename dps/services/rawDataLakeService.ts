/**
 * Created by vdave on 5/8/2017.
 */

import * as path from "path";
import * as fs from "fs";
import * as rp from 'request-promise';
import * as express from '@types/express';
import {User} from '../models/user';
import {ClientData} from '../models/clientData';
let config = require('../config.json');
let appconfig = require('../appconfig.json');
let globalConfig = require('../globalconfig.json');
let testResponses = require('../testing/testResponses.json');

export function uploadRawData(tenantId: string, dataSourceId: string, clientData: ClientData) {

    if (appconfig.testingmode) {

        return new Promise( (resolve) => { resolve(testResponses.awsSampleResponse + tenantId) }) ;
    }
    else {
        let endpoint = globalConfig['cdl_url'] + '/transactionLog/' + tenantId + '/data';

        const headerOptions = {
            'x-access-token': config['access_token']
        };

        let body = {
            tenantId: tenantId,
            dataSourceId: dataSourceId,
            clientData: clientData
        };

        const options: rp.OptionsWithUrl = {
            json: true,
            method: 'POST',
            headers: headerOptions,
            url: endpoint,
            body: body
        };
        return rp(options);
    }
}

export function uploadModifiedData(tenantId: string, collectionName: string, clientData: any) {

    if (appconfig.testingMode) {
        return {
            n : '1',
            ok : '1'
        };
    } else {

        let endpoint = globalConfig ['cdl_url'] + tenantId + config['cdl_put_endpoint'];

        const headerOptions = {
            'x-access-token': config['access_token']
        };

        let body = {
            tenantId: tenantId,
            dsId: collectionName,
            data: clientData
        };

        const options: rp.OptionsWithUrl = {
            json: true,
            method: 'POST',
            headers: headerOptions,
            url: endpoint,
            body: body
        };
        return rp(options);

    }
}





