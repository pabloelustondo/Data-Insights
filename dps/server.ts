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