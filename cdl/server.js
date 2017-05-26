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
var AWS = require('aws-sdk');
var mongodb = require('mongodb').MongoClient;
////////////////////////
// Express stuff
var accessKeyIdFile = fs.readFileSync(config['aws_accessKeyFileLocation'], 'utf8');
var secretAccessKeyFile = fs.readFileSync(config['aws_secretKeyFileLocation'], 'utf8');
var options = ({
    accessKeyId: accessKeyIdFile,
    secretAccessKey: secretAccessKeyFile
});
var creds = new AWS.Credentials(options);
var s3instance = new AWS.S3({
    region: config['aws_region'],
    credentials: creds,
    bucket: config['aws_s3bucket']
});
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
    res.send("CDB");
});
app.use(helmet());
app.use(cors());
////////////////////////////
// CUSTOMER TENANT DATA API
////////////////////////////
// Puts a data point into a tenant datasets.
app.post('/ds/:tenantid/putdata', function (req, res) {
    console.log('request came in');
    callDbAndRespond(req, res, function (req, res, db, next) {
        var reqBody = req.body;
        var tenantId = req.params.tenantid;
        var data = {
            timeStamp: (new Date()).toISOString(),
            data: req.body.data
        };
        var collectionName = reqBody.dsId;
        //check parameters
        db.collection(collectionName).insertOne(data, next);
    });
});
// Store data to transacation log interface
app.post('/transactionLog/:tenantid/data', function (req, res) {
    console.log('placing data in s3 for now');
    var tenantId = req.params.tenantid;
    var clientData = req.body.clientData;
    var dataSourceId = req.body.dataSourceId;
    var uploadParams = { Bucket: config['aws_s3bucket'] + '/' + tenantId, Key: '', Body: '' };
    uploadParams.Body = JSON.stringify(clientData);
    uploadParams.Key = path.basename(tenantId + '.' + dataSourceId + '.' + (new Date()).toISOString() + '.json');
    console.time('awsCallLarge');
    s3instance.upload(uploadParams, function (err, data) {
        console.timeEnd('awsCallLarge');
        if (err) {
            err.code = 'External Error, contact SOTI support with code 0001';
            res.status(500).send(err.code);
        }
        if (data) {
            res.status(200).send(data.Location);
        }
    });
});
// THIS IS THE MOST INTERESTING FUNCTION WHERE WE ACTUALLY USE METADATA
// This is under construction and the idea is to allow consumer to query
// the ds using a general metadata... if no metadata is provided it returns the most recennt
// data points up to a certain max
app.post('/ds/:tenantid/getdata', function (req, res) {
    //check parameters
    //TODO
    console.log('enter post get data for tenant ' + req.body.collectionName);
    var collectionName = req.body.collectionName; //this query is a qeury written in our metadata
    callDbAndRespond(req, res, function (req, res, db, next) {
        db.collection(collectionName).find({}, {
            data: 1,
            _id: 0
        }).toArray(next);
    });
});
app.post('/ds/:tenantid/getdata/query', function (req, res) {
    //check parameters
    //TODO this api allows a consumer of this api to write a mongodb aggregate query
    console.log('enter post query data for tenant with aggregation');
    var collectionName = req.body.collectionName; //this is the collection name to qeury from
    var filter = req.body.aggregation || {};
    callDbAndRespond(req, res, function (req, res, db, next) {
        db.collection(collectionName).aggregate(filter, next);
    });
});
//deletes the whole ds (mostly for testing and completeness..)
app.delete('/ds/:tenantid/:dsid', function (req, res) {
    callDbAndRespond(req, res, function (req, res, db, next) {
        var dsid = req.params.dsid;
        //check parameters
        db.collection(dsid).drop(next);
    });
});
// Gets the n most recent data points from the ds .... I think this is goint to be removed
app.get('/ds/:tenantid/:dsid/:n', function (req, res) {
    //just returns top number of records from ds dsid
    callDbAndRespond(req, res, function (req, res, db, next) {
        var collectionName = req.params.dsid;
        var n = req.params.dsid;
        //check parameters
        db.collection(collectionName).find({}, {
            data: 1,
            _id: 0
        }).skip(db.collection(collectionName).count() - n).toArray(next);
    });
});
////////////////////////////
//Finding mongodb credentials TODO: where are the credentials?
var mongoInfo = { uri: appconfig.mongodb_url };
if (config['mongodb-config-location']) {
    var mongoDbCreds = require(config['mongodb-config-location']);
    mongoInfo = { uri: mongoDbCreds.uri };
}
function tenantDbUri(req) {
    return mongoInfo.uri + "/cdl_" + req.params.tenantid;
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
        key: fs.readFileSync(config['https-key-location']),
        cert: fs.readFileSync(config['https-cert-location'])
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
