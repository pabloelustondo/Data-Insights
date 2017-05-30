import request = require("request");
/**
 * Created by vdave on 5/17/2017.
 */

let _ = require('lodash');
let async = require('async');
import * as rp from 'request-promise';
let config = require('../config.json');

let dataSets = [
    {
        queryId : '12345',
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
        queryId : '21345',
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
        queryId: 'ttc',
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
        queryId: 'test12345',
        dataSources: [
        {
            dataSource: 'test',

        }
        ],
        filter : {}
    }
];
export function filter(data: any, property: any, value: any) {
    let filteredArray: any = data.filter(function (o:any ){
         return o[property] === value;
    });
    return filteredArray;
}

export function findElement (data: any, element: any) {
    return (data[element]) ? data[element] : null;
}

export function processRequest (metadata: any, res) {

    let queryId = metadata.queryId;

    // get dataSetFrom all available dataSets

    let dataSet = _.find(dataSets, { queryId : queryId} );

    let dataSources = dataSet.dataSources;

    let responseData = [];
    async.each(dataSources,function (ds, callback) {
        console.log(ds);

        let aggregate: any = [{
            $match : {}},
            {
                $project : {
                    '_id' : 0,
                    'data' : 1
                }
            }];
        if (ds.filter) {
            let project =
                {
                    $project : {
                        '_id' : 0,
                        'data' : {
                            $filter : {
                                input : '$data',
                                as : 'customData',
                                cond: { $eq : ['$$customData.'+ds.filter.key, ds.filter.value ]}
                            }
                        }
                    }
                };
            console.log( JSON.stringify(project));
            aggregate[1] = project;

        }
        var options = {
            url : 'http://localhost:8001/ds/test/getdata/query',
            method: 'POST',

            body: {
                'collectionName': ds.dataSource,
                'aggregation' : aggregate
            },
            json: true
        };

        function responseCallback ( err, response, body) {
            if (!err && response.statusCode == 200) {
                var info = JSON.stringify(body);

                // console.log('CDL reponse : \n ' + info);

                var responseObj = {};

                /*
                let dataTest = body.map( function (element) {
                    return element.data;
                }); */

                //let x = body[0];
               // let y = x['data.vehicle'];
               // let z = _.get(x, 'data.vehicle');
                let projected = _.get(body[0], ds.projection);
                // let sample = projected[ds.projection];
                responseObj[ds.dataSource] = _.get(body[0], ds.projection);
                responseData.push( responseObj);
            }
            callback();
        }
        request(options, responseCallback);

    }, function (err, results) {
        if (err) {
            console.log(err);
        } else {
             // console.log( results);
            // console.log(responseData);

            if (dataSet.merge) {

                let a1 = _.find(responseData, dataSet.dataSources[0].dataSource );
                let a2 = _.find(responseData, dataSet.dataSources[1].dataSource );

                let a = a1[dataSet.dataSources[0].dataSource];
                let b = a2[dataSet.dataSources[1].dataSource];



                let m2 = _.map( a, function (obj) {
                   let t = _.assign(obj, _.find(b, {Value : obj.id}));
                   return t;
                });

                let merge = _.map(a, function(item) {

                return _.merge(item,  _.find(b, { 'Value' : parseInt(item.id) }));
                });

               res.status(200).send({
                   result : merge
               });

            } else {



                res.status(200).send(responseData);
            }
           // res.status(501).send("Needs to be implemented");
        }
    });



}



function getDataFromDb (dataSource: any) {


    return {
        'test': true,
        dataSource: dataSource
    };
}