"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb = require('mongodb').MongoClient;
var config = require('../config.json');
var appconfig = require('../appconfig.json');
var sampletenants = require('../testing/sampleTenants.json');
var _ = require('lodash');
var rp = require("request-promise");
var DatabaseService = (function () {
    function DatabaseService(ddbUrl) {
        var _this = this;
        if (appconfig.testingmode) {
            this.tenants = sampletenants.tenants;
        }
        else {
            //TODO: call DDB for this but for now just return  test data
            //  this.tenants = sampletenants.tenants;
            // this.loadTenants();
            var headersOptions = {
                'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
            };
            var options = {
                json: true,
                method: 'get',
                headers: headersOptions,
                url: 'http://localhost:8000/getAllTenants',
            };
            rp(options).then(function (data) { return _this.tenants = data.tenants; });
        }
    }
    DatabaseService.prototype.getTenant = function (tenantId) {
        var value = _.find(this.tenants, ['tenantId', tenantId]);
        return value;
        /*
            return _.find(this.tenants, function(element: any) {
                return element.tenantId == tenantId;
            })*/
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
