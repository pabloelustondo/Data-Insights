"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by vdave on 2/9/2017.
 */
const tsoa_1 = require("tsoa");
let jwt = require('jsonwebtoken');
let server = require('../server');
const config = require('../../config.json');
const AWS = require('aws-sdk');
const rp = require("request-promise");
let GetAuthorizationToken = class GetAuthorizationToken {
    /**
     * Post a unit of data to be stored in the cloud analytics database
     */
    Get(express) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = express;
            let token = req.headers['x-access-token'];
            if (token) {
                /*
                 * call DSS to verify the agent has credentials
                 * and provide a token retireved from DSS
                 *
                 */
                let verifyToken = function () {
                    let promise = new Promise(function (resolve, reject) {
                        try {
                            resolve(jwt.verify(token, config['mcdp-secret']));
                        }
                        catch (err) {
                            console.log('could not verify token');
                            reject(err);
                        }
                    });
                    return promise;
                };
                let callDss = function (decodedToken) {
                    let promise = new Promise(function (resolve, reject) {
                        let server = require('../server');
                        let appConfig = server.appconfig;
                        if (decodedToken) {
                            const dssEndpoint = appConfig['dssback_url'] + '/getAgentToken';
                            const optionsTest = {
                                json: true,
                                method: 'GET',
                                url: dssEndpoint,
                                headers: {
                                    'x-access-token': token
                                }
                            };
                            resolve(rp(optionsTest));
                        }
                        else {
                            reject({
                                message: 'Invalid token',
                                status: 400
                            });
                        }
                    });
                    return promise;
                };
                let responseData = function (dssResponse) {
                    let promise = new Promise(function (resolve, reject) {
                        if (dssResponse) {
                            resolve(dssResponse);
                        }
                        else {
                            reject({
                                message: 'Dss error response',
                                status: 500
                            });
                        }
                    });
                    return promise;
                };
                let p = yield verifyToken().then(callDss).then(responseData, function (error) {
                    return Promise.reject({
                        message: error.message,
                        status: error.statusCode
                    });
                });
                console.log(JSON.stringify(p));
                return p;
            }
            else {
                return Promise.reject({
                    message: 'missing token',
                    status: '400'
                });
            }
        });
    }
};
__decorate([
    tsoa_1.Get('getAuthorizationToken'),
    tsoa_1.Example({
        headers: {
            'x-access-token': 'Certificate from admin console',
            'Accept': 'application/json'
        },
        json: true,
        url: 'https://localhost:3010/security/getAuthorizationToken'
    }),
    __param(0, tsoa_1.Request())
], GetAuthorizationToken.prototype, "Get", null);
GetAuthorizationToken = __decorate([
    tsoa_1.Route('Security')
], GetAuthorizationToken);
exports.GetAuthorizationToken = GetAuthorizationToken;
//# sourceMappingURL=getAuthorizationToken.js.map