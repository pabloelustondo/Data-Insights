/**
 * Created by vdave on 12/21/2016.
 */

import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {DeviceModel} from '../models/deviceModel';
const config = require('../../appconfig.json');

@Route('Devices')
export class DeviceInformation {
    /**
     * This API provides information related to a device. The consumer of the API must provide a list of attributes
     * related to the device. The API returns values of the attributes requested.
     *
     * @param request
     * @returns {{deviceId: string, deviceProperties: string[]}}
     * @constructor
     */
    @Post('getDeviceInformation')
    @Example<DeviceModel>({
       deviceId: '1234avcde',
       deviceProperties: ['deviceName', 'deviceManufacturer', 'deviceOwner', 'deviceDriver']
    })

    public async Create(request: DeviceModel): Promise<DeviceModel> {

        let requestProperties = request.deviceProperties;

        let responseProperties: string[] = [];

        let date = new Date();
        for (let prop in requestProperties) {
            let respP = this.getValueOfProperty(requestProperties[prop], date);
            responseProperties.push(requestProperties[prop] + ' : ' + respP);
        }

        return{
            deviceId: request.deviceId,
            deviceProperties: responseProperties
        };
    }

    public getValueOfProperty(propName: string, date: Date) {

        let ms = date.getMilliseconds();

        if (propName === 'deviceName') {
            if (ms % 3 === 0) {
                return 'S7';
            } else if (ms % 3 === 1) {
                return 'ipad';
            } else {
                return 'windows ce m123344';
            }
        } else if (propName === 'deviceManufacturer') {
            if (ms % 3 === 0) {
                return 'Samsung';
            } else if (ms % 3 === 1) {
                return 'Apple';
            } else {
                return 'Microsoft';
            }
        } else if (propName === 'deviceDriver') {
            if (ms % 3 === 0) {
                return 'Pablo';
            } else if (ms % 3 === 1) {
                return 'Doga';
            } else {
                return 'Tim';
            }
        }else if (propName === 'deviceOwner') {
            if (ms % 3 === 0) {
                return 'Varun';
            } else if (ms % 3 === 1) {
                return 'Nathan';
            } else {
                return 'Sergey';
            }
        } else {
            if (ms % 3 === 0) {
                return 'undefined';
            } else if (ms % 3 === 1) {
                return 'undefined';
            } else {
                return 'undefined';
            }

        }
    }
}

