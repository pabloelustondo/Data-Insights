"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
/**
 * Created by vdave on 5/17/2017.
 */
var _ = require('lodash');
var async = require('async');
var config = require('../config.json');
var dataSets = [
    {
        queryId: '12345',
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
        definition: {} //what the output data contains
    },
    {
        queryId: '21345',
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
        queryId: 'ttc',
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
        queryId: 'test12345',
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
function processRequest(metadata, res) {
    var queryId = metadata.queryId;
    // get dataSetFrom all available dataSets
    var dataSet = _.find(dataSets, { queryId: queryId });
    var dataSources = dataSet.dataSources;
    var responseData = [];
    async.each(dataSources, function (ds, callback) {
        console.log(ds);
        var aggregate = [{
                $match: {}
            },
            {
                $project: {
                    '_id': 0,
                    'data': 1
                }
            }];
        if (ds.filter) {
            var project = {
                $project: {
                    '_id': 0,
                    'data': {
                        $filter: {
                            input: '$data',
                            as: 'customData',
                            cond: { $eq: ['$$customData.' + ds.filter.key, ds.filter.value] }
                        }
                    }
                }
            };
            console.log(JSON.stringify(project));
            aggregate[1] = project;
        }
        var options = {
            url: 'http://localhost:8020/ds/test/getdata/query',
            method: 'POST',
            body: {
                'collectionName': ds.dataSource,
                'aggregation': aggregate
            },
            json: true
        };
        function responseCallback(err, response, body) {
            if (!err && response.statusCode == 200) {
                var info = JSON.stringify(body);
                var responseObj = {};
                var projected = _.get(body[0], ds.projection);
                // let sample = projected[ds.projection];
                responseObj[ds.dataSource] = _.get(body[0], ds.projection);
                responseData.push(responseObj);
            }
            callback();
        }
        request(options, responseCallback);
    }, function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
            if (!(responseData.length === dataSet.length)) {
                res.status(204).send('no data found');
            }
            else if (dataSet.merge) {
                var a1 = _.find(responseData, dataSet.dataSources[0].dataSource);
                var a2 = _.find(responseData, dataSet.dataSources[1].dataSource);
                var a = a1[dataSet.dataSources[0].dataSource];
                var b_1 = a2[dataSet.dataSources[1].dataSource];
                var merge = _.map(a, function (item) {
                    return _.merge(item, _.find(b_1, { 'Value': parseInt(item.id) }));
                });
                res.status(200).send({
                    result: merge
                });
            }
            else {
                res.status(200).send(responseData);
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
