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
var rp = require("request-promise");
var app = express();
var mongodb = require('mongodb').MongoClient;
var rawDataLakeService_1 = require("./services/rawDataLakeService");
var databaseService_1 = require("./services/databaseService");
var projection_1 = require("./services/projection");
var dataService_1 = require("./services/dataService");
var kafka = require('kafka-node');
////////////////////////
// Express stuff
var db = new databaseService_1.DatabaseService(appconfig.ddb_address);
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
////////////////////////////////
// Kafka streaming topic     ///
////////////////////////////////
var kafkaClient = new kafka.Client(config.kafka_url);
var payloads = [{ topic: 'transactionLog', partition: 0 }];
var options = { autoCommit: false };
var kafkaOptions = { autoCommit: false };
try {
    var consumer = new kafka.Consumer(kafkaClient, payloads, options);
    consumer.on('message', function (message) {
        try {
            var data = JSON.parse(message.value);
            var idaMetadata = data.idaMetadata;
            var clientData = data.clientData.body;
            var clientMetadata = data.clientData.metadata;
            console.log('json = ' + JSON.stringify(data));
            publishTransactionLog(idaMetadata, clientMetadata, clientData);
            processCleanedData(idaMetadata, clientMetadata, clientData);
        }
        catch (e) {
            console.log('not json format' + message.value);
        }
    });
    consumer.on('error', function (err) {
        console.log('varun');
        console.log(err);
    });
}
catch (e) {
    console.log('IDA could not communicate with kafka producer');
}
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
function publishTransactionLog(idaMetadata, clientMetadata, clientData) {
    var tenantId = idaMetadata.tenantId;
    var dataSourceId = idaMetadata.dataSourceId;
    rawDataLakeService_1.uploadRawData(tenantId, dataSourceId, clientData).then(function (awsResponse) {
        console.log(awsResponse);
    }, function (error) {
        console.log(error);
    });
}
//TODO refactor the name of the function, functionality stays the same
function processCleanedData(idaMetadata, clientMetadata, clientData) {
    var tenantId = idaMetadata.tenantId;
    var dataSourceId = idaMetadata.dataSourceId;
    // massage and clean up data before sending to database layer
    var tenant = db.getTenant(idaMetadata.tenantId);
    if (tenant) {
        var dataSource = _.find(tenant.dataSources, ['dataSourceId', idaMetadata.dataSourceId]);
        var projections = (!clientMetadata.projections) ? dataSource.metadata.projections : clientMetadata.projections;
        var dataSetId = (!clientMetadata.dataSetId) ? dataSource.metadata.dataSetId : clientMetadata.dataSetId;
        var collectionName_2 = dataSetId + '.' + dataSource['dataSourceId'];
        projection_1.DataProjections(clientData, projections).then(function (data) {
            rawDataLakeService_1.uploadModifiedData(tenant.tenantId, collectionName_2, data).then(function (response) {
                console.log('Final response' + JSON.stringify(response));
            }, function (error) {
                console.log(error);
            });
        });
    }
    else {
        console.log('tenantId not found');
    }
}
app.post('/data/outGoingRequest', function (req, res) {
    var metadata = req.body.metadata;
    var db = app.get('db');
    var tenant = db.getTenant('test');
    var dataSets = tenant.dataSets;
    if (metadata) {
        dataService_1.processRequest(metadata, dataSets, res);
    }
    else {
        res.status(400).send({
            message: 'No metadata field present in request body.'
        });
    }
});
exports.app = app;
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
        var db = dataService_1.getDbFromDataService();
        // continuously monitor mongodb for new tenant metadata; this can be updated with kafka streams later
        setInterval(function () {
            var headersOptions = {
                'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
            };
            var options = {
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
                var tenant = db.getTenant('test');
                console.log(JSON.stringify(tenant));
            });
        }, 15000);
        //
    });
}
