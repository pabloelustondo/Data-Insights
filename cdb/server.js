var express  = require('express');
var app = express();
var router = express.Router();
var https = require('https');
var http = require('http');
var fs = require('fs');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var mongodb = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('./config.json');
var appconfig = require('./appconfig.json');
var Database = require('mongodb').Db;
var Server = require('mongodb').Server;
var path = require('path');
var cors = require('cors');

var mongoInfo = {
    uri: appconfig.mongodb_url
};
if (config['mongodb-config-location']) {
    var mongoDbCreds = require(config['mongodb-config-location']);
    mongoInfo = {
        uri: mongoDbCreds.uri
    };
}

var Server = require('mongodb').Server;

function tenantDbUri(req) {
    //this function tell use which database we are refering based on the tenant infomamtion.
    //One tanant, one DB
    return mongoInfo.uri + "/tdb_" + req.params.tenantid;
}


function callDbAndRespond(req,res,query){
    //this function opens a connection to the tenant db and calls the specific query.
    //when this is do it returns the http response.
    //the inout parameter query contains the actual query to be executed against to db

    mongodb.connect(tenantDbUri(req) ,function(err,db){
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

app.use(bodyParser.json({limit: '50mb'}));
app.use('/testing', express.static(path.join(__dirname + '/testing')));
app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname  + '/testing/spec/SpecRunner.html'));
});
app.get('/', function(req,res){
    res.send("CDB - The Customer Database API for The Data Analytics Service");
});

////////////////////////////
// USER  DATA VERY BASIC
// APIS//
// BEGIN                  //
//                        //
////////////////////////////


router.get('/stream/:streamid/:limit', function(req,res){
    //juut returns top number of records from stream streamid
    callDbAndRespond(req,res, function(req,res,db, next){
        var sreamtid = req.params.streamid;
        var limit = req.params.streamid;
        //check parameters
        db.collection(streamid).find().skip(db.collection.count() - limit).toArray(next);
    });
});

router.post('/stream/:streamid/query', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        var streamtid = req.params.streamid;
        var query = req.body;
        //check parameters
        db.collection(streamid).find(query);
    });
});

router.post('/stream/:streamid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        var streamtid = req.params.streamid;
        var timeStamp = Date.now();
        var record = { timeStamp: timeStamp, data: req.body };
        //check parameters
        db.collection(streamid).insert(record, next);
    });
});

router.delete('/stream:/streamid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        var streamtid = req.params.streamid;
        //check parameters
        db.collection(streamid).drop(next);
    });
});

////////////////////////////
// DAD USER related APIS  //
// END                    //
//                        //
////////////////////////////


router.use(helmet());

router.use(cors());

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