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
var config = require('./config.json');
var appconfig = require('./appconfig.json');
var app = express();
var mongodb = require('mongodb').MongoClient;
var rawDataLakeService_1 = require("./services/rawDataLakeService");
var databaseService_1 = require("./services/databaseService");
////////////////////////
// Express stuff
var db = new databaseService_1.DatabaseService(appconfig.ddb_address);
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/testing', express.static(path.join(__dirname + '/testing')));
app.use(bodyParser.json({
    type: function () {
        return true;
    },
    limit: '500mb'
}));
if (appconfig.testingmode) {
    app.get('/test', function (req, res) {
        res.sendFile(path.join(__dirname + '/testing/spec/SpecRunner.html'));
    });
}
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
    if (idaMetadata) {
        var tenantId = req.body.idaMetadata.tenantId;
        var dataSourceId = req.body.idaMetadata.dataSourceId;
        rawDataLakeService_1.uploadDataToLake(tenantId, dataSourceId, req.body).then(function (awsResponse) {
            res.status(200).send({
                status: 200,
                response: awsResponse.Location
            });
        }, function (error) {
            res.status(500).send('you failed.' + error);
        });
    }
    else {
        res.status(400).send('Missing idaMetadata field');
    }
    // massage and clean up data before sending to database layer
});
////////////////////////////
//Finding mongodb credentials TODO: where are the credentials?
var mongoInfo = { uri: appconfig.mongodb_url };
if (config['mongodb_config_location']) {
    var mongoDbCreds = require(config['mongodb_config_location']);
    mongoInfo = { uri: mongoDbCreds.uri };
}
function tenantDbUri(req) {
    if (appconfig.testingmode) {
        return mongoInfo.uri + "/udb_test?socketTimeoutMS=900000";
    }
    else {
        return mongoInfo.uri + "/tdb_" + req.params.tenantid;
    }
}
function callDbAndRespond(req, res, query) {
    //this function opens a connection to the tenant db and calls the specific query.
    //when this is do it returns the http response.
    //the inout parameter query contains the actual query to be executed against to db
    var uri = tenantDbUri(req); // one database per tenant
    //check uri and make sure we have rights
    mongodb.connect(uri, function (err, db) {
        if (err) {
            res.send({ data: null, status: err });
        }
        else
            query(req, res, db, function (err, doc) {
                if (doc !== null) {
                    res.status(200).send(doc);
                }
                else {
                    res.status(404).send("No Results are returned");
                }
                db.close();
            });
    });
}
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
