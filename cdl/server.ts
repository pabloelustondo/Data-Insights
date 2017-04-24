import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as helmet from "helmet";
import {MongoClient, Db} from "mongodb";
let config = require('./config.json');
let appconfig = require('./appconfig.json');
let app = express();

import {getData} from './getdata';

////////////////////////
// Express stuff

app.use(bodyParser.json({limit: '50mb'}));
app.use('/testing', express.static(path.join(__dirname + '/testing')));
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
    callDbAndRespond(req,res, function(req,res,db, next){
        var dsdef = req.body; //this query is a qeury written in our metadata
        var dsid = dsdef["dsid"];
        var data = dsdef["data"];
        //check parameters
        db.collection(dsid).insertMany(data, next);
    });
});

// THIS IS THE MOST INTERESTING FUNCTION WHERE WE ACTUALLY USE METADATA
// This is under construction and the idea is to allow consumer to query
// the ds using a general metadata... if no metadata is provided it returns the most recennt
// data points up to a certain max
app.post('/ds/:tenantid/getdata', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        var dsdef = req.body; //this query is a qeury written in our metadata
        var dsid = dsdef["dsid"];
        //check parameters
         
        //TODO !!!!!!
        db.collection(dsid).find().toArray(next);
    });
});

/*
function getData(db,dsdef){
    return db.collection().find();
}
*/

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
    //juut returns top number of records from ds dsid
    callDbAndRespond(req,res, function(req,res,db, next){
        var dsid = req.params.dsid;
        var n = req.params.dsid;
        //check parameters
        db.collection(dsid).find().skip(db.collection(dsid).count() - n).toArray(next);
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
    return mongoInfo.uri + "/tdb_" + req.params.tenantid;
}

function callDbAndRespond(req,res,query){
    //this function opens a connection to the tenant db and calls the specific query.
    //when this is do it returns the http response.
    //the inout parameter query contains the actual query to be executed against to db
    var uri = tenantDbUri(req); // one database per tenant
    //check uri and make sure we have rights
    MongoClient.connect(uri,function(err,db:Db){
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
        console.log('Starting http server.. http://localhost:' + appconfig.port + '/test');
    });
}