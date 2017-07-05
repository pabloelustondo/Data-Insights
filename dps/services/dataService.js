"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
let _ = require('lodash');
let async = require('async');
let config = require('../config.json');
function getDbFromDataService() {
    let server = require('../server');
    let app = server.app;
    let db = app.get('db');
    return app.get('db');
}
exports.getDbFromDataService = getDbFromDataService;
function filter(data, property, value) {
    let filteredArray = data.filter(function (o) {
        return o[property] === value;
    });
    return filteredArray;
}
exports.filter = filter;
function findElement(data, element) {
    return (data[element]) ? data[element] : null;
}
exports.findElement = findElement;
function callCdlForData(aggregate, dataSetId, tenantId) {
    let p = new Promise(function (resolve, reject) {
        resolve('');
    });
    return p;
}
exports.callCdlForData = callCdlForData;
function secretProcess(tenantId, dataSetId, _dataSets) {
    let dataSetDefinition = _.find(_dataSets, { id: dataSetId });
    let sourceDataSets = dataSetDefinition.from;
    if (sourceDataSets.length > 0 && sourceDataSets[0] !== '') {
        for (let ds in sourceDataSets) {
            secretProcess(tenantId, sourceDataSets[ds], _dataSets);
        }
    }
    let aggregation = [];
    if (dataSetDefinition.projection) {
        aggregation.push({
            $project: dataSetDefinition.projection
        });
    }
    if (dataSetDefinition.filter) {
        aggregation.push({
            $filter: dataSetDefinition.filter
        });
    }
    let sourceData = [];
    let data;
    mergeData(sourceData[0], sourceData[1], '');
    if (dataSetDefinition.merge) {
        data = getDataFromCDL(tenantId, dataSetId, aggregation).then(function () {
            let mergedDataSet = mergeData(sourceData[0], sourceData[1], '');
            return mergedDataSet;
        });
        return data;
    }
    else {
        data = getDataFromCDL(tenantId, dataSetId, aggregation);
        return data;
    }
}
exports.secretProcess = secretProcess;
function mergeData(sourceOne, sourceTwo, key) {
    let merge = new Promise(function (resolve, reject) {
        resolve(_.map(sourceOne, function (item) {
            return _.merge(item, _.find(sourceTwo, { 'Value': parseInt(item.id) }));
        }));
    });
    return merge;
}
function getDataFromCDL(tenantId, collectionName, query) {
    return null;
}
function processRequest(metadata, _dataSets, res) {
    let queryId = metadata.dataSetId;
    let dataSet = _.find(_dataSets, { id: queryId });
    let dataSources = dataSet['from'];
    let responseData = [];
    async.each(dataSources, function (dsId, callback) {
        console.log(dsId);
        let db = getDbFromDataService();
        let tenant = db.getTenant(metadata.tenantId);
        let allDataSets = tenant.dataSets;
        let ds = _.find(allDataSets, { id: dsId });
        let filter = (ds && ds.filter !== "") ? ds.filter : undefined;
        let aggregate = [{
                $match: {}
            },
            {
                $project: {
                    '_id': 0,
                }
            }];
        if (filter) {
            let project = {
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
                    if (ds.projections.length > 0) {
                        responseObj[ds.id] = _.get(body[0], ds.projections[0]);
                    }
                    else {
                        responseObj[ds.id] = body;
                    }
                    responseData.push(responseObj);
                }
                else {
                    let ds = _.find(allDataSets, { id: queryId });
                    if (ds.projections) {
                        responseObj[ds.id] = _.get(body[0], ds.projections[0]);
                        responseData.push(responseObj);
                    }
                    else {
                        responseObj[ds.id] = body;
                        responseData.push(responseObj);
                    }
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
            let a1 = _.find(responseData, dataSet.from[0]);
            let a2 = _.find(responseData, dataSet.from[1]);
            if (dataSet.merge) {
                if (a1 && a2) {
                    let a = a1[dataSet.from[0]];
                    let b = a2[dataSet.from[1]];
                    let merge = _.map(a, function (item) {
                        return _.merge(item, _.find(b, { 'Value': parseInt(item.id) }));
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
                if (dataSet.crossJoin) {
                    if (a1 && a2) {
                        let a = a1[dataSet.from[0]];
                        let b = a2[dataSet.from[1]];
                        var result = _.forEach(a, function (value, key) {
                            console.log('bus = ' + key);
                            var image = _.forEach(a, function (value, key) {
                                console.log('image = ' + key);
                            });
                            var obj = a[key];
                            obj['images'] = b;
                            return obj;
                        });
                        res.status(200).send({
                            timeStamp: new Date().toISOString(),
                            result: result
                        });
                    }
                }
                else {
                    res.status(200).send({
                        timeStamp: new Date().toISOString(),
                        result: responseData
                    });
                }
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