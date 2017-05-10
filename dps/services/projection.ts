/**
 * Created by vdave on 5/10/2017.
 */

import * as path from "path";
import * as fs from "fs";
import * as rp from 'request-promise';
import * as express from '@types/express';
import {User} from '../models/user';
import {ClientData} from '../models/clientData';
let config = require('../config.json');
let appconfig = require('../appconfig.json');

export function DataProjections(data: any, projections: string[]) {
     return new Promise((resolve, reject) => {
        let _data: any = {};

        if (projections.length > 0) {
            projections.forEach((item, index) => {
                _data[item] = data[item];
            });
        } else {
            _data = data;
        }
        resolve(_data);
    })

}