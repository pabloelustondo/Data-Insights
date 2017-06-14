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
var globalconfig = require('./globalconfig.json');
var Database = require('mongodb').Db;
var Server = require('mongodb').Server;
var path = require('path');
var cors = require('cors');
var testTenants = require('./testing/sampleTenants.json');


globalconfig.hostname = "localhost";  //this can be overwritten by app config if necessary
//our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
})
globalconfig.port = globalconfig[globalconfig.id+"_url"].split(":")[2];

appconfig = globalconfig;
global.appconfig = appconfig;

console.log("configuration");
console.log(appconfig);


if(config.userAccessKey) {
    var accessKey = (fs.readFileSync(config['accessKey-location'])).toString();
    router.use(function (req, res, next) {
        if (!req.headers['x-access-token']) {
            res.status(401).send('unauthorized!');
        }
        if (req.headers['x-access-token'] === accessKey) {
            next();
        } else {
            //next();
            res.status(401).send('unauthorized!');
        }
    });
}

var mongoInfo = {
    uri: appconfig.mongodb_url
};

function tenantDbUri(req) { //
    return mongoInfo.uri + "/ddb";
}

if (config['mongodb-config-location']) {
    var mongoDbCreds = require(config['mongodb-config-location']);
    mongoInfo = {
        uri: mongoDbCreds.uri
    };
}

var Server = require('mongodb').Server;


function callDbAndRespond(req,res,query){
    console.log(mongoInfo.uri);

    mongodb.connect( mongoInfo.uri ,function(err,db){
        if (err) {
            res.send({data:null, status:err });
        }
        else query(req,res,db,function(err,doc){

            console.log( 'returned data = ' + JSON.stringify(doc));
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


function getUser(req){
    var username = 'test'; var password;
    var auth = req.headers['authorization'];

    if (auth){
        var tmp = auth.split(' ');
        var buf = new Buffer(tmp[1], 'base64');
        var plain_auth = buf.toString();
        var creds = plain_auth.split(':');
        username = creds[0];
        password = creds[1];
    };
    return username;
}

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use('/testing', express.static(path.join(__dirname + '/testing')));

app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname  + '/testing/spec/SpecRunner.html'));
});

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname  + '/testing/spec/SpecRunner.html'));
    //"DDB"
    return res.send("DDB");
});

app.get('/status', function(req,res){
    if (req.query["secret"] !== appconfig.secret) res.send("wrong secret");

    var report = {};
    Object.keys(appconfig).forEach(function(key){
        if (key!== "secret") {
            if (req.query[key]){
                appconfig[key] = req.query[key];
            }
            report[key]=appconfig[key];
        }
    });
    return res.send(report);
});
////////////////////////////
// DAD USER related APIS  //
// BEGIN                  //
//                        //
////////////////////////////


function checkDadUserRequest(req, res){
    if (req.params.userid !== req.body.userid )
    {
        res.status(400).send("url userid different from body userid");
        return false;
    }
    return true;
}


router.get('/dadusers/:tenantid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        var tenantid = req.body.tenantid;
        db.collection('daduser').find({"tenantid":req.params.tenantid}).toArray(next);
    });
});

router.get('/daduser/:userid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('daduser').find({"userid":req.params.userid}).toArray(next);
    });
});

router.post('/daduser/:userid', function(req,res){
    if (checkDadUserRequest(req,res)) {
        callDbAndRespond(req, res, function (req, res, db, next) {
            db.collection('daduser').replaceOne({"userid": req.params.userid}, req.body, {upsert: true}, next);
        });
    }
});

router.delete('/daduser/:userid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('daduser').deleteMany({"userid":req.params.userid}, next);
    });
});

////////////////////////////
// DAD USER related APIS  //
// END                    //
//                        //
////////////////////////////


////////////////////////////
// TENANT related APIS  //
// BEGIN                  //
//                        //
////////////////////////////


function checkTenantRequest(req, res){
    if (req.params.tenantid !== req.body.tenantid )
    {
        res.status(400).send("url tenantid different from body tenantid");
        return false;
    }
    return true;
}


router.get('/tenants/:tenantid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        var tenantid = req.body.tenantid;
        db.collection('tenant').find({"tenantid":req.params.tenantid}).toArray(next);
    });
});

router.get('/tenant/:tenantid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('tenant').find({"tenantid":req.params.tenantid}).toArray(next);
    });
});

router.post('/tenant/:tenantid', function(req,res){
    if (checkTenantRequest(req,res)) {
        callDbAndRespond(req, res, function (req, res, db, next) {
            db.collection('tenant').replaceOne({"tenantid": req.params.tenantid}, req.body, {upsert: true}, next);
        });
    }
});

router.delete('/tenant/:tenantid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('tenant').deleteMany({"tenantid":req.params.tenantid}, next);
        db.collection('enrollments').deleteMany({"tenantid":req.params.tenantid}, next);
    });
});


////////////////////////////
// TENANT related APIS  //
// END                    //
//                        //
////////////////////////////


router.get('/remote', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        // db.database('rawdata').collection('DeviceCustomData'.find({})).toArray(next);
        db.collection('tenants').find({}).toArray(next);
    });
});

router.get('/getDBAccess/:tenantID', function(req,res){
    var _tenantId = req.params.tenantID;
    callDbAndRespond(req,res, function(req,res,db, next){
        console.log(req.params.tenantID);
        db.collection('enrollments').findOne({
            "tenantId":req.params.tenantID
        }, next);
    });
});

router.get('/getEnrollment', function (req, res) {
    var _tenantId = req.query.tenantId;
    callDbAndRespond(req,res, function(req,res,db, next){
        console.log(req.params.tenantID);
        db.collection('enrollments').findOne({
                "tenantId": _tenantId
            }
            , next);
    });
});

router.post('/insertNewDataSource', function (req, res ) {

    callDbAndRespond(req, res, function (req,res, db, next ){
        db.collection('dataSources').insertOne(req.body, next);
    });
});

router.get('/dataSources', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('dataSources').find({}).toArray(next);
    });
});


router.get('/getTenantUrl', function (req, res) {
    var _tenantId = req.query.tenantId;
    callDbAndRespond(req,res, function(req,res,db, next){
        console.log(_tenantId);
        db.collection('enrollments').findOne({
                "tenantId": _tenantId
            }
            ,
            {
                "mcurl": 1,
                "clientid": 1
            }
            , next);
    });
});

router.post('/newEnrollment', function (req, res ) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('enrollments').insertOne(req.body, next);
    });
});

router.delete('/allEnrollments', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('enrollments').drop(next);
    });
});

router.get('/enrollments', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('enrollments').find({}).toArray(next);
    });
});

// get all data sources attached to id
router.get('/dataSources/:tenantId', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('dataSources').find({"tenantId":req.params.tenantId}).toArray(next);
    });
}) ;

// get one specific data source
router.get('/dataSource/:agentId', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('dataSources').find(
            {
                "agentId":req.params.agentId
            },
            {
                "activationKey": 1
            }
        ).toArray(next);
    });
});

router.get('/verifyDataSource', function (req, res) {

    console.log (req.query.tenantId);
    var _tenantId = req.query.tenantId;
    var _agentId = req.query.agentId;
    var _activationKey = req.query.activationKey;

    callDbAndRespond(req,res, function(req,res,db, next){
        console.log(req.params.tenatID);
        db.collection('dataSources').findOne({
            "agentId": _agentId
        }, next);
    });

});


///////////////////////
// DLM related APIS  //
//                   //
//                   //
///////////////////////
router.get('/getAgendas', function (req, res ) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('jobs').find({}).toArray(next);
    });
});


router.get('/getAllTenants', function (req, res) {
    //TODO: Provide DDB gix

    res.status(200).send(fs.readFileSync('./testing/sampleTenants.json'));
});


router.get('/dataSourceByType', function(req,res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('dataSources').find({
            'dataSourceType' : req.query.dataSourceType
        }).toArray(next);
    });
});

router.post('/updateDataSourceCredentials', function (req, res ) {

    var _agentId = req.body.agentId;
    var _accessKey = req.body.activationKey;

    console.log("agent id = " +_agentId);

    callDbAndRespond(req, res, function(req,res,db, next) {

        db.collection('dataSources').update(
            {
                agentId : _agentId
            },
            {
                $set: {
                    activationKey : _accessKey

                }
            },
            {
                upsert: false
            }, next);

    });
});



router.post('/updateDataSourceAws', function (req, res) {

    callDbAndRespond(req, res, function(req,res,db, next) {

        var _tenantId = req.body.tenantID;
        db.collection('enrollments').update(
            {
                tenantId: _tenantId
            },
            {
                $set: {
                    accessUsername : req.body.accessUsername,
                    accessPswd : req.body.accessPswd,
                    RedShiftConnectionString: req.body.RedShiftConnectionString,
                    DBName: req.body.DBName,
                    Status: req.body.status
                }
            },
            {
                upsert: false
            }, next);

    });

});


router.post('/updateEnrollmentInformation', function (req, res) {

    callDbAndRespond(req, res, function(req,res,db, next) {

        var _tenantId = req.body.tenantId;
        var temp = {};

        for (var p in req.body.properties) {
            if (req.body.properties.hasOwnProperty(p)) {
                console.log(p + " -> " + req.body.properties[p] );
                temp [p] = req.body.properties[p];

            }
        }

        db.collection('enrollments').update(
            {
                tenantId: _tenantId
            },
            {
                $set: temp
            },
            {
                upsert: false
            }, next);


    });

});

//////////////////////////////////////
// DDB External Usage related APIS  //
//                                  //
//                                  //
//////////////////////////////////////

router.get('/tenant/configuration', function(req,res){

    var _tenantId = req.query.tenantId;
    callDbAndRespond(req,res, function(req,res,db, next){
        console.log(req.query.tenantId);
        db.collection('enrollments').findOne({
            "tenantId":req.query.tenantId
        }, next);
    });
});

//////////////////////////////////////
// DDB External Usage related APIS  //
//                                  //
//                                  //
//////////////////////////////////////



//////
//  All delete APIS??
//
///////

router.delete('/enrollments', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('enrollments').drop(next);
    });
});

router.delete('/testenrollments', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('enrollments').removeMany({tenantId:'test2'});
    });
});


router.delete('/deleteAllDataSources', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('dataSources').drop(next);
    });
});

router.delete('/deleteDataSource', function(req,res){

    var _agent = req.query.agentId;
    var _tenant = req.query.tenantId;

    var user = getUser(req);
    mongodb.connect(dbUrl + "udb_" + user,function(err,db){
        if (err) {
            console.log('err backing up object: ' + err);
        }
        else {
            db.collection('dataSources').findOne({
                agentId: _agent
            }, function (err, doc) {

                console.log('returned data = ' + JSON.stringify(doc));
                if (doc !== null) {
                    var metaData = {
                        timeStamp : new Date().toString()
                    };

                    var document = {
                        metaData : metaData,
                        originalObject : doc
                    };
                    db.collection('deletedSources').insertOne(document, function (err, result) {
                        db.close();
                        if (!err) {
                            callDbAndRespond(req, res, function (req, res, db, next) {
                                db.collection('dataSources').removeOne(
                                    {
                                        agentId: _agent
                                    }, next);
                            });
                        }
                    });

                }
                else {
                    console.log('no object returned: ' + err);
                }

            });
        }
    });

});

//router.use(helmet());

router.get('/router2', function (req, res) {
    res.send('hello, user!')
});


app.use('/',router, function (req, res) {
    res.sendStatus(404);
});


router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('X-Content-Type-Option', 'nosniff');
    next();
});


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

