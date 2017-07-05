"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb = require('mongodb').MongoClient;
let config = require('../config.json');
let appconfig = require('../appconfig.json');
let globalConfig = require('../globalconfig.json');
let sampletenants = require('../testing/sampleTenants.json');
let _ = require('lodash');
const rp = require("request-promise");
class DatabaseService {
    constructor(ddbUrl) {
        this.appConfig = globalConfig;
        if (appconfig.testingmode) {
            this.tenants = sampletenants.tenants;
        }
        else {
            const headersOptions = {
                'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
            };
            const options = {
                json: true,
                method: 'get',
                headers: headersOptions,
                url: globalConfig['ddb_url'] + '/getAllTenants',
            };
            rp(options).then(data => this.tenants = data.tenants).catch(function (err) {
                console.log(err);
            });
        }
    }
    populateTenants(tenants) {
        this.tenants = tenants;
    }
    getAllDataSets() {
        let dataSets = [];
        for (let tenant of this.tenants) {
            if (tenant.dataSets) {
                for (let dataSet of tenant.dataSets) {
                    dataSets.push({
                        tenantId: tenant.id,
                        dataSet: dataSet
                    });
                }
            }
        }
        return dataSets;
    }
    getTenant(tenantId) {
        if (this.tenants) {
            return _.find(this.tenants, ['tenantId', tenantId]);
        }
        else {
            return null;
        }
    }
    getTenantDataSets(tenant, dataSet) {
    }
    findProperty(propertyName, propertyValue) {
        return _.find(this.tenants, [propertyName, propertyValue]);
    }
    getUserInfo(userId) {
        return {
            userId: "varun",
            tenantId: "varunTenant" + Math.floor(Math.random() * 5) + 1
        };
    }
    callDbAndRespond(req, res, query) {
        var uri = '1234';
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
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=databaseService.js.map