"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const https = require("https");
const helmet = require("helmet");
let _ = require('lodash');
let config = require('./config.json');
let appconfig = require('./appconfig.json');
const rp = require("request-promise");
let kafka = require('kafka-node');
let ConsumerGroup = kafka.ConsumerGroup;
let app = express();
var mongodb = require('mongodb').MongoClient;
const rawDataLakeService_1 = require("./services/rawDataLakeService");
const databaseService_1 = require("./services/databaseService");
const projection_1 = require("./services/projection");
const dataService_1 = require("./services/dataService");
var globalconfig = require('./globalconfig.json');
globalconfig.hostname = "localhost";
Object.keys(appconfig).forEach(function (key) {
    globalconfig[key] = appconfig[key];
});
globalconfig.port = globalconfig[globalconfig.id + "_url"].split(":")[2];
appconfig = globalconfig;
console.log("configuration");
console.log(appconfig);
let db = new databaseService_1.DatabaseService(appconfig.ddb_address);
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
    let idaMetadata = req.body.idaMetadata;
    let clientMetadata = req.body.clientMetadata;
    if (!idaMetadata) {
        res.status(400).send('Missing idaMetadata field');
    }
    else if (!clientMetadata) {
        res.status(400).send('Missing clientMetadata field');
    }
    else {
        let tenantId = req.body.idaMetadata.tenantId;
        let dataSourceId = req.body.idaMetadata.dataSourceId;
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
        let tenant = db.getTenant(req.body.idaMetadata.tenantId);
        if (tenant) {
            let dataSource = _.find(tenant.dataSources, ['dataSourceId', req.body.idaMetadata.dataSourceId]);
            let projections = (!clientMetadata.projections) ? dataSource.metadata.projections : clientMetadata.projections;
            let dataSetId = (!clientMetadata.dataSetId) ? dataSource.metadata.dataSetId : clientMetadata.dataSetId;
            let collectionName = dataSetId;
            projection_1.DataProjections(req.body.clientData, projections).then(function (data) {
                rawDataLakeService_1.uploadModifiedData(tenant.tenantId, collectionName, data).then(function (response) {
                    console.log('Final response' + JSON.stringify(response));
                }, function (error) {
                    console.log(error);
                });
            });
        }
    }
});
function publishTransactionLog(idaMetadata, clientMetadata, clientData) {
    let tenantId = idaMetadata.tenantId;
    let dataSourceId = idaMetadata.dataSourceId;
    let data = {
        idaMetadata: idaMetadata,
        clientData: {
            metadata: clientMetadata,
            data: clientData
        }
    };
    rawDataLakeService_1.uploadRawData(tenantId, dataSourceId, data).then(function (awsResponse) {
        console.log(awsResponse);
    }, function (error) {
        console.log('upload Raw Data: ' + error.message);
    });
}
function processCleanedData(idaMetadata, clientMetadata, clientData) {
    let tenantId = idaMetadata.tenantId;
    let dataSourceId = idaMetadata.dataSourceId;
    let db = app.get('db');
    let tenant = db.getTenant(idaMetadata.tenantId);
    if (tenant) {
        let dataSet = _.find(tenant['dataSets'], ['id', clientMetadata.dataSetId]);
        let projections = dataSet.projections;
        console.log('projections \t ' + JSON.stringify(projections));
        let dataSetId = dataSet.id;
        let collectionName = dataSetId;
        projection_1.DataProjections(clientData, projections).then(function (data) {
            rawDataLakeService_1.uploadModifiedData(tenant.tenantId, collectionName, data).then(function (response) {
                console.log('Final response' + JSON.stringify(response));
            }, function (error) {
                console.log(error.message);
            });
            publishCleanedDataToKafka('undefined_cleanedData', tenant.tenantId, dataSetId, data);
        });
    }
    else {
        console.log(tenantId + 'tenantId not found');
    }
}
function publishCleanedDataToKafka(topic, tenantId, dataSetId, data) {
    let kafkaClient = new kafka.Client(globalconfig['kafka_url']);
    let producer = new kafka.Producer(kafkaClient);
    producer.on('ready', function (message) {
        let payloads = [
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
    let metadata = req.body.metadata;
    let db = app.get('db');
    let tenant = db.getTenant(metadata.tenantId);
    if (!tenant) {
        res.status(404).send('Tenant not found');
    }
    else {
        let dataSets = tenant['dataSets'];
        let dataSet = _.find(dataSets, { id: metadata.dataSetId });
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
    let tenantId = req.params.tenantId;
    let db = app.get('db');
    let tenant = db.getTenant(tenantId);
    let dataSets = tenant.dataSets;
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
        let db = dataService_1.getDbFromDataService();
        const headersOptions = {
            'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
        };
        const options = {
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
            let dataSets = db.getAllDataSets();
            let topics = ['undefined_transactionLogs'];
            let consumerGroupOptions = {
                host: globalconfig['kafka_url'],
                ssl: false,
                groupId: 'ExampleTestGroup',
                sessionTimeout: 15000,
                protocol: ['roundrobin'],
                fromOffset: 'earliest',
                outOfRangeOffset: 'earliest'
            };
            let consumerGroup = new ConsumerGroup(Object.assign({ id: 'consumer1' }, consumerGroupOptions), topics);
            consumerGroup.on('error', function (err) {
                console.log('error' + err.message);
            });
            consumerGroup.on('message', function (message) {
                try {
                    let data = JSON.parse(message.value);
                    let idaMetadata = data.idaMetadata;
                    let clientData = data.clientData;
                    let clientMetadata = data.clientMetadata;
                    publishTransactionLog(idaMetadata, clientMetadata, clientData);
                    processCleanedData(idaMetadata, clientMetadata, clientData);
                }
                catch (e) {
                    console.log('not json format' + message.value);
                }
            });
        });
        setInterval(function () {
            const headersOptions = {
                'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
            };
            const options = {
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
            });
        }, 15000);
    });
}
//# sourceMappingURL=server.js.map