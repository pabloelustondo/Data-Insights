/**
 * Created by vdave on 12/21/2016.
 */

import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {DeviceModel} from '../models/deviceModel';
const config = require('../../appconfig.json');

@Route('Devices')
export class ListOfDevices {
    @Post('/getList')
    @Example<any>({
        headers: {
            'X-API-key': 'Future Private Access Key',
            'Accept': 'application/json'
        },
        json: true,
        url: 'http://localhost:3002/devices/getList',
        data: {
            deviceId: '1234avcde',
            deviceProperties: ['deviceName', 'deviceManufacturer', 'deviceOwner', 'deviceDriver']
        }
    })

    public async Create(request: DeviceModel): Promise<DeviceModel> {
        return{
            deviceId: '1234avcde',
            deviceProperties: ['deviceName', 'deviceManufacturer', 'deviceOwner', 'deviceDriver']
        };
    }
}

