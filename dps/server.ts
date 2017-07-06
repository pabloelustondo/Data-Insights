import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as helmet from "helmet";
import {MongoClient, Db} from "mongodb";
let _ = require('lodash');
let config = require('./config.json');
let appconfig = require('./appconfig.json');
import * as rp from 'request-promise';


let kafka = require('kafka-node');
let ConsumerGroup = kafka.ConsumerGroup;

let app = express();
var mongodb = require('mongodb').MongoClient;

import {uploadRawData, uploadModifiedData} from './services/rawDataLakeService';
import {DatabaseService} from  './services/databaseService';
import {DataProjections} from './services/projection';
import {processRequest, getDbFromDataService} from './services/dataService';
// import message = SNS.message;

var globalconfig = require('./globalconfig.json');


globalconfig.hostname = "localhost";  //this can be overwritten by app config if necessary
//our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
});
globalconfig.port = globalconfig[globalconfig.id+"_url"].split(":")[2];

appconfig = globalconfig;
// global.appconfig = appconfig;

console.log("configuration");
console.log(appconfig);



////////////////////////
// Express stuff

let db = new DatabaseService(appconfig.ddb_address);


app.set('db', db);

app.use(bodyParser.json({limit: '50mb'}));
app.use('/testing', express.static(path.join(__dirname + '/testing')));
app.use(bodyParser.json({
        type: function() {
            return true;
        },
        limit: '500mb'
    }
));



app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname + '/testing/spec/SpecRunner.html'));
});


app.get('/', function(req,res){
    res.send("DPS");
});

app.use(helmet());

app.use(cors());



////////////////////////////
// CUSTOMER TENANT DATA API
////////////////////////////

// Puts a data point into a tenant datasets.
app.post('/data/request', function(req,res) {
    console.log('request came in');

    // send data to s3 without a lot of fuss
    let idaMetadata = req.body.idaMetadata;
    let clientMetadata = req.body.clientMetadata;
    if (!idaMetadata) {
        res.status(400).send('Missing idaMetadata field');
    } else if (!clientMetadata) {
        res.status(400).send('Missing clientMetadata field');
    }
    else {
        let tenantId = req.body.idaMetadata.tenantId;
        let dataSourceId = req.body.idaMetadata.dataSourceId;
        uploadRawData(tenantId, dataSourceId, req.body).then(function (awsResponse: any) {
                console.log(awsResponse);
                res.status(200).send({
                    status: 200,
                    response: awsResponse
                });
            }, function (error: any) {
                console.log(error);
                res.status(500).send(error);
            }
        );

        // massage and clean up data before sending to database layer
        let tenant = db.getTenant(req.body.idaMetadata.tenantId);
        if(tenant) {

            let dataSource = _.find(tenant.dataSources, ['dataSourceId', req.body.idaMetadata.dataSourceId]);
            let projections = (!clientMetadata.projections) ? dataSource.metadata.projections : clientMetadata.projections;
            let dataSetId = (!clientMetadata.dataSetId) ? dataSource.metadata.dataSetId : clientMetadata.dataSetId;
            let collectionName = dataSetId;

            DataProjections(req.body.clientData, projections).then(function (data) {
                uploadModifiedData(tenant.tenantId, collectionName, data).then(function (response) {
                    console.log('Final response' + JSON.stringify(response));
                }, function (error) {
                    console.log(error);
                });
            });
        }
    }

});

function publishTransactionLog (idaMetadata: any, clientMetadata: any, clientData: any) {

    let tenantId = idaMetadata.tenantId;
    let dataSourceId = idaMetadata.dataSourceId;
    let data = {
        idaMetadata: idaMetadata,
        clientData: {
            metadata: clientMetadata,
            data : clientData
        }
    };
    uploadRawData(tenantId, dataSourceId, data).then(function (awsResponse: any) {
            console.log(awsResponse);
        }, function (error: any) {
            console.log(error);
        }
    );
}

//TODO refactor the name of the function, functionality stays the same
function processCleanedData(idaMetadata: any, clientMetadata: any, clientData: any ) {

    let tenantId = idaMetadata.tenantId;
    let dataSourceId = idaMetadata.dataSourceId;

    let db = app.get('db');  //get db
    let tenant = db.getTenant(idaMetadata.tenantId); //get the tenant for request

    if(tenant ) {
        let dataSet =_.find(tenant['dataSets'], ['id', clientMetadata.dataSetId]); //get the dataSet for the request
        let projections = dataSet.projections; //get the projections
        console.log('projections \t ' + JSON.stringify(projections));
        let dataSetId = dataSet.id; //get the id

        let collectionName = dataSetId;

        DataProjections(clientData, projections).then(function (data) {

            //upload to database
            uploadModifiedData(tenant.tenantId, collectionName, data).then(function (response) {
                console.log('Final response' + JSON.stringify(response));
            }, function (error) {
                console.log(error);
            });

            // make it ready for consumption right away
            publishCleanedDataToKafka('undefined_cleanedData',  tenant.tenantId, dataSetId, data );

        });
    } else {
        console.log (tenantId +  'tenantId not found');
    }
}

function publishCleanedDataToKafka (topic: string, tenantId: string, dataSetId: string,  data: string) {
    let kafkaClient = new kafka.Client(globalconfig['kafka_url']);
    let producer = new kafka.Producer(kafkaClient);
    producer.on('ready', function (message: any) {
        let payloads: any = [
            {
                topic: topic,
                partition: 0,
                messages:  JSON.stringify( {
                    tenantId : tenantId,
                    dataSetId : dataSetId,
                    data : data
                })
            }];

        producer.send(payloads, function (err: any, data: any) {
            console.log(data);
            // return Promise.resolve(data);
        });
    });
    producer.on('error', function (error: any) {
        console.log(error);
    });
}
app.post('/data/outGoingRequest', function(req, res) {


    let metadata = req.body.metadata;

    let db = app.get('db');
    let tenant = db.getTenant(metadata.tenantId);
    if (!tenant) {
        res.status(404).send('Tenant not found');
    } else {
        let dataSets = tenant['dataSets'];
        let dataSet = _.find(dataSets, {id: metadata.dataSetId});
        if (dataSet) {
            processRequest(metadata, dataSets, res);
        } else {
            res.status(400).send({
                message: 'No combination of tenant and dataSet found.'
            })
        }
    }


} );

app.get('/getMetadata/:tenantId', function (req, res) {
    let tenantId = req.params.tenantId;

    let db = app.get('db');
    let tenant = db.getTenant(tenantId);
    let dataSets = tenant.dataSets;
    res.status(200).send(dataSets);
});

exports.app = app;

if (config.useSSL) {
    var httpsOptions = {
        key: fs.readFileSync(config['https_key_location'] ),
        cert: fs.readFileSync(config['https_cert_location'] )
    };
    var httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(appconfig.port, function () {
        console.log('Starting https server.. https://localhost:' + appconfig.port + '/test');
    });
} else {
    var httpServer = http.createServer(app);

    httpServer.listen(appconfig.port, function () {
        console.log('Starting no SSL http server.. http://localhost:' + appconfig.port + '/test');
        let db = getDbFromDataService();

        const headersOptions = {
            'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
        };


        const options: rp.OptionsWithUrl = {
            json: true,
            method: 'get',
            headers: headersOptions,
            url: globalconfig['ddb_url'] + '/tenants',
        };
        rp(options).then(function (data) {
            db.populateTenants(data);
        }).catch(function (err) {
            console.log(err);
        }).then(function () {
            let tenant = db.getTenant('test');
            console.log(JSON.stringify(tenant));
        }).then(function () {
            ////////////////////////////////
// Kafka streaming topic     ///
////////////////////////////////
           // let kafkaClient = new kafka.Client(config.kafka_url);
            let dataSets = db.getAllDataSets();
            let topics = ['undefined_transactionLogs'];
            let consumerGroupOptions = {
                host: '127.0.0.1:2181',
                zk : undefined,   // put client zk settings if you need them (see Client)
                batch: undefined, // put client batch settings if you need them (see Client)
                ssl: false, // optional (defaults to false) or tls options hash
                groupId: 'ExampleTestGroup',
                sessionTimeout: 15000,
                // An array of partition assignment protocols ordered by preference.
                // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
                protocol: ['roundrobin'],

                // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
                // equivalent to Java client's auto.offset.reset
                fromOffset: 'earliest', // default

                // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
                outOfRangeOffset: 'earliest', // default
                migrateHLC: false,    // for details please see Migration section below
                migrateRolling: true
            };

            let consumerGroup = new ConsumerGroup(consumerGroupOptions , 'undefined_transactionLogs');
            consumerGroup.on('error', function(err) {
                console.log('error' + err);
            });
            consumerGroup.on('message', function (message) {
                try {
                    let data = JSON.parse(message.value);

                    let idaMetadata = data.idaMetadata;
                    let clientData = data.clientData;
                    let clientMetadata = data.clientMetadata;

                   // console.log('json = ' + JSON.stringify(data));
                    publishTransactionLog( idaMetadata, clientMetadata, clientData);
                    processCleanedData( idaMetadata, clientMetadata, clientData);

                } catch (e) {
                    console.log('not json format' + message.value);
                }
                // console.log('message' + message);
            });

        });

        // continuously monitor mongodb for new tenant metadata; this can be updated with kafka streams later
        setInterval(function() {
            const headersOptions = {
                'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
            };


            const options: rp.OptionsWithUrl = {
                json: true,
                method: 'get',
                headers: headersOptions,
                url: globalconfig['ddb_url'] + '/tenants',
            };
            rp(options).then(function (data) {
                db.populateTenants(data);
            }).catch(function (err) {
                console.log(err);
            }).then(function () {
                let tenant = db.getTenant('test');
                //console.log(JSON.stringify(tenant));
            });
        }, 15000);

        //

    });


}