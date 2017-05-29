"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var cors = require("cors");
var fs = require("fs");
var http = require("http");
var https = require("https");
var helmet = require("helmet");
var _ = require('lodash');
var config = require('./config.json');
var appconfig = require('./appconfig.json');
var app = express();
var mongodb = require('mongodb').MongoClient;
var rawDataLakeService_1 = require("./services/rawDataLakeService");
var databaseService_1 = require("./services/databaseService");
var projection_1 = require("./services/projection");
var dataService_1 = require("./services/dataService");
////////////////////////
// Express stuff
var db = new databaseService_1.DatabaseService(appconfig.ddb_address);
//db.start();
app.set('db', db);
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/testing', express.static(path.join(__dirname + '/testing')));
app.use(bodyParser.json({
    type: function () {
        return true;
    },
    limit: '500mb'
}));
app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname + '/testing/spec/SpecRunner.html'));
});
app.get('/', function (req, res) {
    res.send("DPS");
});
app.use(helmet());
app.use(cors());
////////////////////////////
// CUSTOMER TENANT DATA API
////////////////////////////
// Puts a data point into a tenant datasets.
app.post('/data/request', function (req, res) {
    console.log('request came in');
    // send data to s3 without a lot of fuss
    var idaMetadata = req.body.idaMetadata;
    var clientMetadata = req.body.clientMetadata;
    if (!idaMetadata) {
        res.status(400).send('Missing idaMetadata field');
    }
    else if (!clientMetadata) {
        res.status(400).send('Missing clientMetadata field');
    }
    else {
        var tenantId = req.body.idaMetadata.tenantId;
        var dataSourceId = req.body.idaMetadata.dataSourceId;
        rawDataLakeService_1.uploadRawData(tenantId, dataSourceId, req.body).then(function (awsResponse) {
            console.log(awsResponse);
            res.status(200).send({
                status: 200,
                response: awsResponse
            });
        }, function (error) {
            console.log(error);
            res.status(500).send(error);
        });
        // massage and clean up data before sending to database layer
        var tenant_1 = db.getTenant(req.body.idaMetadata.tenantId);
        if (tenant_1) {
            var dataSource = _.find(tenant_1.dataSources, ['dataSourceId', req.body.idaMetadata.dataSourceId]);
            var projections = (!clientMetadata.projections) ? dataSource.metadata.projections : clientMetadata.projections;
            var dataSetId = (!clientMetadata.dataSetId) ? dataSource.metadata.dataSetId : clientMetadata.dataSetId;
            var collectionName_1 = dataSetId + '.' + dataSource['dataSourceId'];
            projection_1.DataProjections(req.body.clientData, projections).then(function (data) {
                rawDataLakeService_1.uploadModifiedData(tenant_1.tenantId, collectionName_1, data).then(function (response) {
                    console.log('Final response' + JSON.stringify(response));
                }, function (error) {
                    console.log(error);
                });
            });
        }
    }
});
app.post('/data/outGoingRequest', function (req, res) {
    // TODO: process metadata to figure out the request
    var metadata = req.body.metadata;
    if (metadata) {
        dataService_1.processRequest(metadata, res);
    }
    else {
        res.status(400).send({
            message: 'No metadata field present in request body.'
        });
    }
});
if (config.useSSL) {
    var httpsOptions = {
        key: fs.readFileSync(config['https_key_location']),
        cert: fs.readFileSync(config['https_cert_location'])
    };
    var httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(appconfig.port, function () {
        console.log('Starting https server.. https://localhost:' + appconfig.port + '/test');
    });
}
else {
    var httpServer = http.createServer(app);
    httpServer.listen(appconfig.port, function () {
        console.log('Starting no SSL http server.. http://localhost:' + appconfig.port + '/test');
    });
}
