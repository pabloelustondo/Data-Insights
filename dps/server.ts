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

let app = express();
var mongodb = require('mongodb').MongoClient;

import {uploadRawData, uploadModifiedData} from './services/rawDataLakeService';
import {DatabaseService} from  './services/databaseService';
import {DataProjections} from './services/projection';
import {processRequest, getDbFromDataService} from './services/dataService';

var globalconfig = require('./globalconfig.json');
var path = require('path');
var cors = require('cors');

globalconfig.hostname = "localhost";  //this can be overwritten by app config if necessary
//our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
});
globalconfig.port = globalconfig[globalconfig.id+"_url"].split(":")[2];

appconfig = globalconfig;
global.appconfig = appconfig;

console.log("configuration");
console.log(appconfig);



let kafka = require('kafka-node');

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
            let collectionName = dataSetId ;

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
    uploadRawData(tenantId, dataSourceId, clientData).then(function (awsResponse: any) {
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


  //  console.log('tenantID ' + tenantId);

 //   console.log('dataSourceId ' + dataSourceId);

    // massage and clean up data before sending to database layer
    let db = app.get('db');
    let tenant = db.getTenant(idaMetadata.tenantId);

    if(tenant) {

        let dataSource = _.find(tenant.dataSources, ['dataSourceId', idaMetadata.dataSourceId]);
        console.log('dataSource \t ' + JSON.stringify(dataSource));
        let projections = (!clientMetadata.projections) ? dataSource.metadata.projections : clientMetadata.projections;
        console.log('projections \t ' + JSON.stringify(projections));
        let dataSetId = (!clientMetadata.dataSetId) ? dataSource.metadata.dataSetId : clientMetadata.dataSetId;

        let collectionName = dataSetId;

        DataProjections(clientData, projections).then(function (data) {
            uploadModifiedData(tenant.tenantId, collectionName, data).then(function (response) {
                console.log('Final response' + JSON.stringify(response));
            }, function (error) {
                console.log(error);
            });
        });
    } else {
        console.log ('tenantId not found');
    }
}

app.post('/data/outGoingRequest', function(req, res) {


    let metadata = req.body.metadata;

    let db = app.get('db');
    let tenant = db.getTenant('test');
    let dataSets = tenant.dataSets;
    if (metadata) {
        processRequest(metadata, dataSets, res);
    } else {
        res.status(400).send ({
            message: 'No metadata field present in request body.'
        })
    }


} );

app.get('/getMetadata/:tenantId', function (req, res) {
    let tenantId = req.params.tenantId;

    let db = app.get('db');
    let tenant = db.getTenant(tenantId);
    let dataSets = tenant.dataSets;
    res.status(200).send(dataSets);
})

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
            url: appconfig['ddb_url'] + '/getAllTenants',
        };
        rp(options).then(function (data) {
            db.populateTenants(data.tenants);
        }).catch(function (err) {
            console.log(err);
        }).then(function () {
            let tenant = db.getTenant('test');
            console.log(JSON.stringify(tenant));
        }).then(function () {
            ////////////////////////////////
// Kafka streaming topic     ///
////////////////////////////////
            let kafkaClient = new kafka.Client(config.kafka_url);

            let payloads =  [{ topic: 'transactionLog', partition: 0 }];
            let options = { autoCommit: false};
            let kafkaOptions = { autoCommit: false};
            try {

                let consumer = new kafka.Consumer(kafkaClient, payloads, options);

                consumer.on('message', function (message: any) {
                    try {
                        let data = JSON.parse(message.value);

                        let idaMetadata = data.idaMetadata;
                        let clientData = data.clientData.body;
                        let clientMetadata = data.clientData.metadata;

                        console.log('json = ' + JSON.stringify(data));

                    //    publishTransactionLog( idaMetadata, clientMetadata, clientData);
                    //    processCleanedData( idaMetadata, clientMetadata, clientData);
                    } catch (e) {
                        console.log('not json format' + message.value);
                    }
                });

                consumer.on('error', function (err: any) {

                    console.log('varun');
                    console.log(err);
                })

            } catch (e) {
                console.log('IDA could not communicate with kafka producer');
            }


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
                url: appconfig['ddb_url'] + '/getAllTenants',
            };
            rp(options).then(function (data) {
                db.populateTenants(data.tenants);
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