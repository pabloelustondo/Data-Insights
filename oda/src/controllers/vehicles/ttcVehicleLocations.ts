/**
 * Created by vdave on 3/20/2017.
 */
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../../models/user';
// import * as https from 'https';
const config = require('../../../appconfig.json');
import * as querystring from 'querystring';

import * as rp from 'request-promise';
@Route('Vehicles')
export class VehicleLocations {
    /**
     * A DischargeRate represents how quickly the battery is losing the charge per hour.
     * This data is retrieved every hour for a given day.
     * A date range is required to get the information.
     */

    @Get('Data/GetLocations')
    @Example<any>({
        'createdAt': '2016-11-29T20:30:21.385Z',
        'metadata' : 'vehicle : [ { id, lon, routeTag, predictable, heading, lat, secsSinceReport } ]',
        'data': {
            'vehicle' : [
                {
                    'id': '1049',
                    'lon': '-79.48658',
                    'routeTag': '79',
                    'predictable': 'true',
                    'heading': '165',
                    'lat': '43.670834',
                    'secsSinceReport': '6939'
                }
            ]}
    })
    public async Get(): Promise<SDS> {

        const xqs = {command : 'vehicleLocations', a : 'ttc' };
        const xurl = 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc';

        const options: rp.OptionsWithUrl = {
            json: true,
            method: 'GET',

            url: xurl
        };

        let p = await rp(options); // request library used
        let mData = ['vehicle : [ {' +
        'id, lon, routeTag, predictable, heading, lat, secsSinceReport' +
        ' } ]'];

        const user: SDS = {
            createdAt: new Date(),
            metadata: mData,
            data: p
        };

        return user;
    }
}
