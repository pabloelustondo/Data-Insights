/**
 * Created by vdave on 5/4/2017.
 */

let jwt  = require('jsonwebtoken');
import * as express from '@types/express';
const path = require('path');
const config = require('../../appconfig.json');
import * as rp from 'request-promise';


export function verifyToken(token: any) {
    let promise = new Promise(function (resolve, reject) {
        resolve(jwt.verify(token, config['expiring-secret']));
    });
    return promise;
};

