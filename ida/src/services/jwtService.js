/**
 * Created by vdave on 5/4/2017.
 */
"use strict";
var jwt = require('jsonwebtoken');
var path = require('path');
var config = require('../../appconfig.json');
function verifyToken(token) {
    var promise = new Promise(function (resolve, reject) {
        resolve(jwt.verify(token, config['expiring-secret']));
    });
    return promise;
}
exports.verifyToken = verifyToken;
;
