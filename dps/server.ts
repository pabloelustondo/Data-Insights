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
let app = express();
var mongodb = require('mongodb').MongoClient;

import {uploadRawData, uploadModifiedData} from './services/rawDataLakeService';
import {DatabaseService} from  './services/databaseService';
import {DataProjections} from './services/projection';
import {processRequest} from './services/dataService';
import {User} from "./models/user";
import {accessSync} from "fs";


let kafka = require('kafka-node');

////////////////////////
// Express stuff

let db = new DatabaseService(appconfig.ddb_address);
//db.start();

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
        //console.log(message);
        //console.log( JSON.stringify(message.value));
      //  console.log( (message.value));
        try {
            let data = JSON.parse(message.value);

            let idaMetadata = data.idaMetadata;
            let clientData = data.clientData.body;
            let clientMetadata = data.clientData.metadata;
            console.log('json = ' + JSON.stringify(data));
            processKafkaRequest(idaMetadata, clientMetadata, clientData);
        } catch (e) {
            console.log('not json format' + message.value);
        }
    });

    consumer.on('error', function (err: any) {
        console.log(err);
    })

} catch (e) {
    console.log('IDA could not communicate with kafka producer');
}



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
            let collectionName = dataSetId + '.' + dataSource['dataSourceId'];


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

//TODO refactor the name of the function, functionality stays the same

function processKafkaRequest (idaMetadata: any, clientMetadata: any, clientData: any ) {

    let tenantId = idaMetadata.tenantId;
    let dataSourceId = idaMetadata.dataSourceId;
    uploadRawData(tenantId, dataSourceId, clientData).then(function (awsResponse: any) {
            console.log(awsResponse);
        }, function (error: any) {
            console.log(error);
        }
    );

    // massage and clean up data before sending to database layer
    let tenant = db.getTenant(idaMetadata.tenantId);
    if(tenant) {

        let dataSource = _.find(tenant.dataSources, ['dataSourceId', idaMetadata.dataSourceId]);
        let projections = (!clientMetadata.projections) ? dataSource.metadata.projections : clientMetadata.projections;
        let dataSetId = (!clientMetadata.dataSetId) ? dataSource.metadata.dataSetId : clientMetadata.dataSetId;
        let collectionName = dataSetId + '.' + dataSource['dataSourceId'];

        DataProjections(clientData, projections).then(function (data) {
            uploadModifiedData(tenant.tenantId, collectionName, data).then(function (response) {
                console.log('Final response' + JSON.stringify(response));
            }, function (error) {
                console.log(error);
            });
        });
    }
}

app.post('/data/outGoingRequest', function(req, res) {

    // TODO: process metadata to figure out the request
    let metadata = req.body.metadata;

    if (metadata) {
        processRequest(metadata, res);
    } else {
        res.status(400).send ({
            message: 'No metadata field present in request body.'
        })
    }


} );

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
    });
}