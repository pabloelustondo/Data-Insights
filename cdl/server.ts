import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as helmet from "helmet";
import * as rp from 'request-promise';
import {MongoClient, Db} from "mongodb";
let config = require('./config.json');
let appconfig = require('./appconfig.json');
let app = express();
const AWS = require('aws-sdk');
var mongodb = require('mongodb').MongoClient;

import {getData, getExtensibleData} from './getdata';

////////////////////////
// Express stuff




let accessKeyIdFile = fs.readFileSync(config['aws_accessKeyFileLocation'], 'utf8');
let secretAccessKeyFile = fs.readFileSync(config['aws_secretKeyFileLocation'], 'utf8');

const options = ({
    accessKeyId: accessKeyIdFile,
    secretAccessKey: secretAccessKeyFile
});

const creds = new AWS.Credentials(options);

let s3instance = new AWS.S3({
    region : config['aws_region'] ,
    credentials : creds,
    bucket: config['aws_s3bucket']
});


app.use(bodyParser.json({limit: '50mb'}));
app.use('/testing', express.static(path.join(__dirname + '/testing')));
app.use(bodyParser.json({
        type: function() {
            return true;
        },
        limit: '500mb'
    }
));

app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname  + '/testing/spec/SpecRunner.html'));
});

app.get('/', function(req,res){
    res.send("CDB");
});

app.use(helmet());

app.use(cors());

////////////////////////////
// CUSTOMER TENANT DATA API
////////////////////////////

// Puts a data point into a tenant datasets.

app.post('/ds/:tenantid/putdata', function(req,res){
    console.log('request came in');
    callDbAndRespond(req,res, function(req,res,db, next){

        var reqBody = req.body;
        let tenantId = req.params.tenantid;
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
app.post('/transactionLog/:tenantid/data', function(req, res) {

    console.log('placing data in s3 for now');
    let tenantId = req.params.tenantid;
    let clientData = req.body.clientData;
    let dataSourceId = req.body.dataSourceId;

    let uploadParams = {Bucket: config['aws_s3bucket']  + '/' + tenantId, Key: '', Body: ''};
    uploadParams.Body = JSON.stringify(clientData);
    uploadParams.Key = path.basename(tenantId + '.' + dataSourceId + '.' + (new Date()).toISOString() + '.json');


    console.time('awsCallLarge');

    s3instance.upload(uploadParams, function (err: any, data: any) {
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

app.post('/ds/:tenantid/getdata', function(req,res){
    //check parameters
    //TODO
    console.log('enter post get data for tenant');
    var collectionName = req.body.collectionName; //this query is a qeury written in our metadata
    callDbAndRespond(req,res, function(req,res,db, next){
            db.collection(collectionName).find({},{
                data: 1,
                _id : 0
            }).toArray(next);

    });
});


//deletes the whole ds (mostly for testing and completeness..)
app.delete('/ds/:tenantid/:dsid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        var dsid = req.params.dsid;
        //check parameters
        db.collection(dsid).drop(next);
    });
});

// Gets the n most recent data points from the ds .... I think this is goint to be removed
app.get('/ds/:tenantid/:dsid/:n', function(req,res){
    //just returns top number of records from ds dsid
    callDbAndRespond(req,res, function(req,res,db, next){
        let collectionName = req.params.dsid;
        var n = req.params.dsid;
        //check parameters
        db.collection(collectionName).find({},
            {
                data: 1,
                _id : 0
            }
        ).skip(db.collection(collectionName).count() - n).toArray(next);
    });
});

////////////////////////////
//Finding mongodb credentials TODO: where are the credentials?

let mongoInfo = {uri: appconfig.mongodb_url};
if (config['mongodb-config-location']) {
    var mongoDbCreds = require(config['mongodb-config-location']);
    mongoInfo = { uri: mongoDbCreds.uri };
}

function tenantDbUri(req) { //
     return mongoInfo.uri + "/cdl_" + req.params.tenantid;
}

function callDbAndRespond(req,res,query){
    //this function opens a connection to the tenant db and calls the specific query.
    //when this is do it returns the http response.
    //the inout parameter query contains the actual query to be executed against to db
    var uri = tenantDbUri(req); // one database per tenant
    //check uri and make sure we have rights
    mongodb.connect(uri,function(err,db:Db){
        if (err) {
            res.send({data:null, status:err });
        }
        else query(req,res,db,function(err,doc){
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
        key: fs.readFileSync(config['https-key-location'] ),
        cert: fs.readFileSync(config['https-cert-location'] )
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