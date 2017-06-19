"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb = require('mongodb').MongoClient;
var config = require('../config.json');
var appconfig = require('../appconfig.json');
var globalConfig = require('../globalconfig.json');
var sampletenants = require('../testing/sampleTenants.json');
var _ = require('lodash');
var rp = require("request-promise");
var DatabaseService = (function () {
    function DatabaseService(ddbUrl) {
        var _this = this;
        this.appConfig = globalConfig;
        if (appconfig.testingmode) {
            this.tenants = sampletenants.tenants;
        }
        else {
            //TODO: call DDB for this but for now just return  test data
            var headersOptions = {
                'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
            };
            var options = {
                json: true,
                method: 'get',
                headers: headersOptions,
                url: globalConfig['ddb_url'] + '/getAllTenants',
            };
            rp(options).then(function (data) { return _this.tenants = data.tenants; }).catch(function (err) {
                console.log(err);
            });
        }
    }
    DatabaseService.prototype.populateTenants = function (tenants) {
        this.tenants = tenants;
    };
    DatabaseService.prototype.getAllDataSets = function () {
        var dataSets = [];
        // go through each tenant and find the dataSet that needs to be updated listened to
        for (var _i = 0, _a = this.tenants; _i < _a.length; _i++) {
            var tenant = _a[_i];
            if (tenant.dataSets) {
                for (var _b = 0, _c = tenant.dataSets; _b < _c.length; _b++) {
                    var dataSet = _c[_b];
                    dataSets.push({
                        tenantId: tenant.id,
                        dataSet: dataSet
                    });
                }
            }
        }
        return dataSets;
    };
    DatabaseService.prototype.getTenant = function (tenantId) {
        if (this.tenants) {
            return _.find(this.tenants, ['tenantId', tenantId]);
        }
        else {
            return null;
        }
    };
    DatabaseService.prototype.getTenantDataSets = function (tenant, dataSet) {
    };
    DatabaseService.prototype.findProperty = function (propertyName, propertyValue) {
        return _.find(this.tenants, [propertyName, propertyValue]);
    };
    DatabaseService.prototype.getUserInfo = function (userId) {
        //TODO: proper implementation
        return {
            userId: "varun",
            tenantId: "varunTenant" + Math.floor(Math.random() * 5) + 1
        };
    };
    DatabaseService.prototype.callDbAndRespond = function (req, res, query) {
        //this function opens a connection to the tenant db and calls the specific query.
        //when this is do it returns the http response.
        //the inout parameter query contains the actual query to be executed against to db
        var uri = '1234'; // one database per tenant
        //check uri and make sure we have rights
        mongodb.connect(uri, function (err, db) {
            if (err) {
                res.send({ data: null, status: err });
            }
            else
                query(req, res, db, function (err, doc) {
                    if (doc !== null) {
                        res.status(200).send(doc);
                    }
                    else {
                        res.status(404).send("No Results are returned");
                    }
                    db.close();
                });
        });
    };
    return DatabaseService;
}());
exports.DatabaseService = DatabaseService;
