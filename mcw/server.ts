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

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use('/testing', express.static(path.join(__dirname + '/testing')));

app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname  + '/testing/spec/SpecRunner.html'));
});

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname  + '/testing/spec/SpecRunner.html'));
    //"DDB"
    return res.send("MCW");
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

