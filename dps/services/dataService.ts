import request = require("request");
/**
 * Created by vdave on 5/17/2017.
 */

let _ = require('lodash');
let async = require('async');
import * as rp from 'request-promise';
let config = require('../config.json');
import * as express from "express";



let dataSets = [
    {
        id : '12345',
        dataSources: [
            {
                dataSource: 'test',
                filter : {}
            },
            {
                dataSource: 'test2',
                filter : {}
            }
        ],
        filter : {},
        merge : 'field1',
        definition : {} //what the output data contains
    },
    {
        id : '21345',
        dataSources : [
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
                projection : 'data.vehicle'
            },
            {
                dataSource: 'customDeviceInfo',
                filter : {
                    id : '$data',
                    key: 'Name',
                    value: 'VehicleID'
                },
                projection : 'data'
            }

        ],
        merge : 'data'
    },
    {
        id: 'test12345',
        dataSources: [
        {
            dataSource: 'test',

        }
        ],
        filter : {}
    }
];

export function getDbFromDataService (){
    let server = require('../server');
    let app = server.app;
    let db = app.get('db');
    return app.get('db');
}

export function filter(data: any, property: any, value: any) {
    let filteredArray: any = data.filter(function (o:any ){
         return o[property] === value;
    });
    return filteredArray;
}

export function findElement (data: any, element: any) {
    return (data[element]) ? data[element] : null;
}

export function processRequest (metadata: any, _dataSets: any, res) {


    let queryId = metadata.dataSetId;

    // get dataSetFrom all available dataSets
    let dataSet = _.find(_dataSets, { id : queryId} );

    let dataSources = dataSet['from'];


    let responseData = [];
    async.each(dataSources,function (dsId, callback) {
        console.log(dsId);
        let db = getDbFromDataService();
        let tenant = db.getTenant(metadata.tenantId);
        let allDataSets = tenant.dataSets;

        let ds = _.find(allDataSets,{id : dsId});
        let filter = (ds && ds.filter !== "" ) ? ds.filter : undefined;
        let aggregate: any = [{
            $match : {}},
            {
                $project : {
                    '_id' : 0,
                    'data' : 1
                }
            }];
        if (filter) {
            let project =
                {
                    $project : {
                        '_id' : 0,
                        'data' : {
                            $filter : {
                                input : '$data',
                                as : 'customData',
                                cond: { $eq : ['$$customData.'+ filter.key, filter.value ]}
                            }
                        }
                    }
                };
            console.log( JSON.stringify(project));
            aggregate[1] = project;

        }
        var options = {
            url : 'http://localhost:8020/ds/' + metadata.tenantId +'/getdata/query',
            method: 'POST',

            body: {
                'collectionName': (ds)? ds.id: queryId,
                'aggregation' : aggregate
            },
            json: true
        };
        function responseCallback ( err, response, body) {
            if (!err && response.statusCode == 200) {
                var info = JSON.stringify(body);

                var responseObj = {};

                if (ds) {
                    let projected = _.get(body[0], ds.projections[0]);
                    // let sample = projected[ds.projection];
                    responseObj[ds.id] = _.get(body[0], ds.projections[0]);
                    responseData.push(responseObj);
                } else {

                    let ds = _.find(allDataSets,{id : queryId});
                    let projected = _.get(body[0], ds.projections[0]);
                    // let sample = projected[ds.projection];
                    responseObj[ds.id] = _.get(body[0], ds.projections[0]);
                    responseData.push(responseObj);
                }
            }
            callback();
        }
        request(options, responseCallback);

    }, function (err, results) {
        if (err) {
            console.log(err);
        } else {

        if (dataSet.merge) {

            let a1 = _.find(responseData, dataSet.from[0]);
            let a2 = _.find(responseData, dataSet.from[1]);

            if (a1 && a2){
                let a = a1[dataSet.from[0]];
                let b = a2[dataSet.from[1]];

                let merge = _.map(a, function(item) {
                    return _.merge(item,  _.find(b, { 'Value' : parseInt(item.id) }));
                });

               res.status(200).send({
                   timeStamp : new Date().toISOString(),
                   result : merge
               });}
               else {
                   res.status(204).send('No data found');
               }
            } else {
                 res.status(200).send({
                     timeStamp : new Date().toISOString(),
                     result: responseData
                 });

            }
        }
    });
}

function getDataFromDb (dataSource: any) {
    return {
        'test': true,
        dataSource: dataSource
    };
}