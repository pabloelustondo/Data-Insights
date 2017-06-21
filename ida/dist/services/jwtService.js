/**
 * Created by vdave on 5/4/2017.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let jwt = require('jsonwebtoken');
const path = require('path');
const config = require('../../config.json');
function verifyToken(token) {
    let promise = new Promise(function (resolve, reject) {
        resolve(jwt.verify(token, config['expiring-secret']));
    });
    return promise;
}
exports.verifyToken = verifyToken;
;
//# sourceMappingURL=jwtService.js.map