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

var kafka = require('kafka-node');

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


function checksilogRequest(req, res){
    if (req.params.userid !== req.body.userid )
    {
        res.status(400).send("url userid different from body userid");
        return false;
    }
    return true;
}

////////////////////////////
// LOG USER related APIS  //
// BEGIN                  //
//                        //
////////////////////////////

router.get('/siloguser', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('siloguser').find({}).toArray(next);
    });
});

router.post('/siloguser', function(req,res){
    callDbAndRespond(req, res, function (req, res, db, next) {
        db.collection('siloguser').insertOne(req.body, next);
    });
});

router.delete('/siloguser/:tenantid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('siloguser').deleteMany({"tenantid":req.params.tenantid}, next);
    });
});

////////////////////////////
// LOG USER related APIS  //
// END                    //
//                        //
////////////////////////////




//////////////////////////////
// LOG SERVER related APIS  //
// BEGIN                    //
//                          //
//////////////////////////////

router.get('/silogserver', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
//        db.collection('silog').find({"tenantid":req.params.tenantid}).toArray(next);
        db.collection('silogserver').find({}).toArray(next);
    });
});

router.post('/silogserver', function(req,res){
    callDbAndRespond(req, res, function (req, res, db, next) {
        db.collection('silogserver').insertOne(req.body, next);
    });
});

router.delete('/silogserver/:tenantid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('silogserver').deleteMany({"tenantid":req.params.tenantid}, next);
    });
});

//////////////////////////////
// LOG SERVER related APIS  //
// END                      //
//                          //
//////////////////////////////



/////////////////////////////
// LOG AGENT related APIS  //
// BEGIN                   //
//                         //
/////////////////////////////

router.get('/silogagent', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('silogagent').find({}).toArray(next);
    });
});

router.post('/silogagent', function(req,res){
    if (checksilogRequest(req,res)) {
        callDbAndRespond(req, res, function (req, res, db, next) {
            db.collection('silogagent').insertOne(req.body, next);
        });
    }
});

router.delete('/silogagent/:tenantid', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('silogagent').deleteMany({"tenantid":req.params.tenantid}, next);
    });
});

/////////////////////////////
// LOG AGENT related APIS  //
// END                     //
//                         //
/////////////////////////////


let ConsumerGroup = kafka.ConsumerGroup;
let topics = ['log1'];
let consumerGroupOptions = {
    host: '127.0.0.1:2181',
    zk : undefined,   // put client zk settings if you need them (see Client)
    batch: undefined, // put client batch settings if you need them (see Client)
    ssl: false, // optional (defaults to false) or tls options hash
    groupId: 'ExampleTestGroup',
    sessionTimeout: 15000,
    // An array of partition assignment protocols ordered by preference.
    // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
    protocol: ['roundrobin'],

    // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
    // equivalent to Java client's auto.offset.reset
    fromOffset: 'earliest', // default

    // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
    outOfRangeOffset: 'earliest', // default
    migrateHLC: false,    // for details please see Migration section below
    migrateRolling: true
};

let consumerGroup = new ConsumerGroup(consumerGroupOptions , topics);

function callDbAndAct(query){
    console.log(mongoInfo.uri);

    mongodb.connect( mongoInfo.uri ,function(err,db){
        if (err) {
            console.log( 'error connecting to the mongo');
        }
        else {
            query(db, function (err, doc) {
                console.log('returned data = ' + JSON.stringify(doc));
                db.close();
            });
        }
    });
}


consumerGroup.on('error', function(err) {
    console.log('error: ' + err);
});

consumerGroup.on('message', function (message) {
    let data = // {producer: "MCDP", params: {"tenantId": "someid"}};
    JSON.parse(message.value);

    var timeStamp = new Date().getTime();
    data = { ...data, ...{ "timeStamp": timeStamp.toString() } };

    console.log('data = ' + JSON.stringify(data));
    if (data.producer == "Tenant") {
        callDbAndAct(function (db, next) {
            db.collection('siloguser').insertOne(data, next);
        });
    }
    if (data.producer == "MCDP") {
        callDbAndAct(function (db, next) {
            db.collection('silogagent').insertOne(data, next);
        });
    }
    else {
        callDbAndAct(function (db, next) {
            db.collection('silogserver').insertOne(data, next);
        });
    }
});

let Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client(),
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message');

producer.on('ready', function () {});
producer.on('error', function (err) {
    console.log('error: ' + err);
});

router.get('/unittest', function(req, res){
    let timeStamp =  new Date().getTime();
    let payloads = [ { topic: 'log1', messages: `{"producer": "MCDP", "timeStamp": "${timeStamp}", "message": "TEST" ,"params": {"tenantId": "someTenantId"}}`, partition: 0 } ];
    producer.send(payloads, function (err, data) {

        //Waits for Kafka Listener to act
        setTimeout(function() {
            callDbAndAct(function(db, next){
               db.collection('silogagent').find({"timeStamp": timeStamp.toString()}).toArray(function (err, doc) {
                   console.log(doc);
                   if (err) {
                       console.log(err);
                   }
                   else {
                       if (doc.length && doc[0].timeStamp == timeStamp.toString()) {
                           res.status(200).send({ok: 1});
                       }
                       else {
                           res.status(500).send({ok: 0});
                       }
                   }
                });
            });
        }, 500);
    });
});

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

