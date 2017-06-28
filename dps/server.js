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
var kafka = require('kafka-node');
var ConsumerGroup = kafka.ConsumerGroup;
var app = express();
var mongodb = require('mongodb').MongoClient;
var rawDataLakeService_1 = require("./services/rawDataLakeService");
var databaseService_1 = require("./services/databaseService");
var projection_1 = require("./services/projection");
var dataService_1 = require("./services/dataService");
var globalconfig = require('./globalconfig.json');
var path = require('path');
var cors = require('cors');
globalconfig.hostname = "localhost";
Object.keys(appconfig).forEach(function (key) {
    globalconfig[key] = appconfig[key];
});
globalconfig.port = globalconfig[globalconfig.id + "_url"].split(":")[2];
appconfig = globalconfig;
global.appconfig = appconfig;
console.log("configuration");
console.log(appconfig);
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
app.post('/data/request', function (req, res) {
    console.log('request came in');
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
        var tenant_1 = db.getTenant(req.body.idaMetadata.tenantId);
        if (tenant_1) {
            var dataSource = _.find(tenant_1.dataSources, ['dataSourceId', req.body.idaMetadata.dataSourceId]);
            var projections = (!clientMetadata.projections) ? dataSource.metadata.projections : clientMetadata.projections;
            var dataSetId = (!clientMetadata.dataSetId) ? dataSource.metadata.dataSetId : clientMetadata.dataSetId;
            var collectionName_1 = dataSetId;
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
    var data = {
        clientMetadata: clientMetadata,
        clientData: clientData
    };
    rawDataLakeService_1.uploadRawData(tenantId, dataSourceId, data).then(function (awsResponse) {
        console.log(awsResponse);
    }, function (error) {
        console.log(error);
    });
}
function processCleanedData(idaMetadata, clientMetadata, clientData) {
    var tenantId = idaMetadata.tenantId;
    var dataSourceId = idaMetadata.dataSourceId;
    var db = app.get('db');
    var tenant = db.getTenant(idaMetadata.tenantId);
    if (tenant) {
        var dataSet = _.find(tenant['dataSets'], ['id', clientMetadata.dataSetId]);
        var projections = dataSet.projections;
        console.log('projections \t ' + JSON.stringify(projections));
        var dataSetId_1 = dataSet.id;
        var collectionName_2 = dataSetId_1;
        projection_1.DataProjections(clientData, projections).then(function (data) {
            rawDataLakeService_1.uploadModifiedData(tenant.tenantId, collectionName_2, data).then(function (response) {
                console.log('Final response' + JSON.stringify(response));
            }, function (error) {
                console.log(error);
            });
            publishCleanedDataToKafka('undefined_cleanedData', tenant.tenantId, dataSetId_1, data);
        });
    }
    else {
        console.log(tenantId + 'tenantId not found');
    }
}
function publishCleanedDataToKafka(topic, tenantId, dataSetId, data) {
    var kafkaClient = new kafka.Client(globalconfig['kafka_url']);
    var producer = new kafka.Producer(kafkaClient);
    producer.on('ready', function (message) {
        var payloads = [
            {
                topic: topic,
                partition: 0,
                messages: JSON.stringify({
                    tenantId: tenantId,
                    dataSetId: dataSetId,
                    data: data
                })
            }
        ];
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
    });
    producer.on('error', function (error) {
        console.log(error);
    });
}
app.post('/data/outGoingRequest', function (req, res) {
    var metadata = req.body.metadata;
    var db = app.get('db');
    var tenant = db.getTenant(metadata.tenantId);
    if (!tenant) {
        res.status(404).send('Tenant not found');
    }
    else {
        var dataSets = tenant['dataSets'];
        var dataSet = _.find(dataSets, { id: metadata.dataSetId });
        if (dataSet) {
            dataService_1.processRequest(metadata, dataSets, res);
        }
        else {
            res.status(400).send({
                message: 'No combination of tenant and dataSet found.'
            });
        }
    }
});
app.get('/getMetadata/:tenantId', function (req, res) {
    var tenantId = req.params.tenantId;
    var db = app.get('db');
    var tenant = db.getTenant(tenantId);
    var dataSets = tenant.dataSets;
    res.status(200).send(dataSets);
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
        var headersOptions = {
            'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
        };
        var options = {
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
            var tenant = db.getTenant('test');
            console.log(JSON.stringify(tenant));
        }).then(function () {
            var dataSets = db.getAllDataSets();
            var topics = ['undefined_transactionLogs'];
            var consumerGroupOptions = {
                host: '127.0.0.1:2181',
                zk: undefined,
                batch: undefined,
                ssl: false,
                groupId: 'ExampleTestGroup',
                sessionTimeout: 15000,
                protocol: ['roundrobin'],
                fromOffset: 'earliest',
                outOfRangeOffset: 'earliest',
                migrateHLC: false,
                migrateRolling: true
            };
            var consumerGroup = new ConsumerGroup(consumerGroupOptions, 'undefined_transactionLogs');
            consumerGroup.on('error', function (err) {
                console.log('error' + err);
            });
            consumerGroup.on('message', function (message) {
                try {
                    var data = JSON.parse(message.value);
                    var idaMetadata = data.idaMetadata;
                    var clientData = data.clientData;
                    var clientMetadata = data.clientMetadata;
                    publishTransactionLog(idaMetadata, clientMetadata, clientData);
                    processCleanedData(idaMetadata, clientMetadata, clientData);
                }
                catch (e) {
                    console.log('not json format' + message.value);
                }
            });
        });
        setInterval(function () {
            var headersOptions = {
                'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
            };
            var options = {
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
                var tenant = db.getTenant('test');
            });
        }, 15000);
    });
}
//# sourceMappingURL=server.js.map