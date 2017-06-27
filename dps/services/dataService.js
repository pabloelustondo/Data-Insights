"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var _ = require('lodash');
var async = require('async');
var config = require('../config.json');
var dataSets = [
    {
        id: '12345',
        dataSources: [
            {
                dataSource: 'test',
                filter: {}
            },
            {
                dataSource: 'test2',
                filter: {}
            }
        ],
        filter: {},
        merge: 'field1',
        definition: {}
    },
    {
        id: '21345',
        dataSources: [
            {
                dataSource: 'test'
            },
            {
                dataSource: 'customDataSetId.TestuniqueId12345456'
            }
        ]
    },
    {
        id: 'ttc',
        dataSources: [
            {
                dataSource: 'ttcMaps',
                projection: 'data.vehicle'
            },
            {
                dataSource: 'customDeviceInfo',
                filter: {
                    id: '$data',
                    key: 'Name',
                    value: 'VehicleID'
                },
                projection: 'data'
            }
        ],
        merge: 'data'
    },
    {
        id: 'test12345',
        dataSources: [
            {
                dataSource: 'test',
            }
        ],
        filter: {}
    }
];
function getDbFromDataService() {
    var server = require('../server');
    var app = server.app;
    var db = app.get('db');
    return app.get('db');
}
exports.getDbFromDataService = getDbFromDataService;
function filter(data, property, value) {
    var filteredArray = data.filter(function (o) {
        return o[property] === value;
    });
    return filteredArray;
}
exports.filter = filter;
function findElement(data, element) {
    return (data[element]) ? data[element] : null;
}
exports.findElement = findElement;
function processRequest(metadata, _dataSets, res) {
    var queryId = metadata.dataSetId;
    var dataSet = _.find(_dataSets, { id: queryId });
    var dataSources = dataSet['from'];
    var responseData = [];
    async.each(dataSources, function (dsId, callback) {
        console.log(dsId);
        var db = getDbFromDataService();
        var tenant = db.getTenant(metadata.tenantId);
        var allDataSets = tenant.dataSets;
        var ds = _.find(allDataSets, { id: dsId });
        var filter = (ds && ds.filter !== "") ? ds.filter : undefined;
        var aggregate = [{
                $match: {}
            },
            {
                $project: {
                    '_id': 0,
                    'data': 1
                }
            }];
        if (filter) {
            var project = {
                $project: {
                    '_id': 0,
                    'data': {
                        $filter: {
                            input: '$data',
                            as: 'customData',
                            cond: { $eq: ['$$customData.' + filter.key, filter.value] }
                        }
                    }
                }
            };
            console.log(JSON.stringify(project));
            aggregate[1] = project;
        }
        var options = {
            url: 'http://localhost:8020/ds/' + metadata.tenantId + '/getdata/query',
            method: 'POST',
            body: {
                'collectionName': (ds) ? ds.id : queryId,
                'aggregation': aggregate
            },
            json: true
        };
        function responseCallback(err, response, body) {
            if (!err && response.statusCode == 200 && body) {
                var info = JSON.stringify(body);
                var responseObj = {};
                if (ds) {
                    var projected = _.get(body[0], ds.projections[0]);
                    responseObj[ds.id] = _.get(body[0], ds.projections[0]);
                    responseData.push(responseObj);
                }
                else {
                    var ds_1 = _.find(allDataSets, { id: queryId });
                    var projected = _.get(body[0], ds_1.projections[0]);
                    responseObj[ds_1.id] = _.get(body[0], ds_1.projections[0]);
                    responseData.push(responseObj);
                }
            }
            callback();
        }
        request(options, responseCallback);
    }, function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
            if (dataSet.merge) {
                var a1 = _.find(responseData, dataSet.from[0]);
                var a2 = _.find(responseData, dataSet.from[1]);
                if (a1 && a2) {
                    var a = a1[dataSet.from[0]];
                    var b_1 = a2[dataSet.from[1]];
                    var merge = _.map(a, function (item) {
                        return _.merge(item, _.find(b_1, { 'Value': parseInt(item.id) }));
                    });
                    res.status(200).send({
                        timeStamp: new Date().toISOString(),
                        result: merge
                    });
                }
                else {
                    res.status(204).send('No data found');
                }
            }
            else {
                res.status(200).send({
                    timeStamp: new Date().toISOString(),
                    result: responseData
                });
            }
        }
    });
}
exports.processRequest = processRequest;
function getDataFromDb(dataSource) {
    return {
        'test': true,
        dataSource: dataSource
    };
}
//# sourceMappingURL=dataService.js.map