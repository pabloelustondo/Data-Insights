"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb = require('mongodb').MongoClient;
var config = require('../config.json');
var appconfig = require('../appconfig.json');
var DatabaseService = (function () {
    function DatabaseService(ddbUrl) {
    }
    DatabaseService.prototype.getTenant = function (tenantId) {
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
