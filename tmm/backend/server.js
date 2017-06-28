var express  = require('express');
var app = express();
var router = express.Router();
var https = require('https');
var http = require('http').Server(app);
var fs = require('fs');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var config = require('./config.json');
var appconfig = require('./appconfig.json');
var globalconfig = require('./globalconfig.json');
var path = require('path');
var rp = require('request-promise');
var cors = require('cors');
var io = require('socket.io')(http);
var kafka = require('kafka-node');

var ConsumerGroup = kafka.ConsumerGroup;
var topics = ['log1'];
var consumerGroupOptions = {
    host: '127.0.0.1:2181',
    zk: undefined,
    batch: undefined,
    ssl: false,
    groupId: 'ExampleTestGroup',
    sessionTimeout: 15000,
    // An array of partition assignment protocols ordered by preference.
    // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
    protocol: ['roundrobin'],
    // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
    // equivalent to Java client's auto.offset.reset
    fromOffset: 'earliest',
    // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
    outOfRangeOffset: 'earliest',
    migrateHLC: false,
    migrateRolling: true
};

// Kafka Logging
var Producer = kafka.Producer, KeyedMessage = kafka.KeyedMessage, client = new kafka.Client(), producer = new Producer(client), km = new KeyedMessage('key', 'message');
producer.on('ready', function () { });
producer.on('error', function (err) {
    console.log('error: ' + err);
});



globalconfig.hostname = "localhost";  //this can be overwritten by app config if necessary
//our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
})
globalconfig.port = globalconfig[globalconfig.id+"_url"].split(":")[2];

appconfig = globalconfig;

console.log("configuration");
console.log(appconfig);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
});
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});



app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use('/testing', express.static(path.join(__dirname + '/testing')));
app.use('/', express.static(path.join(__dirname)));

app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname  + '/testing/spec/SpecRunner.html'));
});

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname  + '/index.html'));
});

app.get('/status', function(req,res){
    if (req.query["secret"] !== appconfig.secret) res.send("wrong key");

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

app.get('/tenant/:tenantid', function(req,res){
    var timeStamp = new Date().getTime();
    var payloads = [{ topic: 'log', messages: `{"producer": "TMM", "message": "${req.params.tenantid}", "params": {"tenantId": "${req.params.tenantid}"}}`, partition: 0 }];
    producer.send(payloads, function (err, data) {

    var options = {
        uri:appconfig.ddb_url + "/tenant/" + req.params.tenantid,
        method:"GET",
        contentType:"application/json"
    };
    rp(options)
        .then(function (data) {
            console.log("OK" + data);
            res.send(data)
        })
        .catch(function (err) {
            console.log("BAD" + err);
           res.send(err);
       });
    });
});

app.post('/tenant/:tenantid', function(req,res){
    var timeStamp = new Date().getTime();
    var payloads = [{ topic: 'log', messages: `{"producer": "TMM", "message": "${req.params.tenantid}", "params": {"tenantId": "${req.params.tenantid}"}}`, partition: 0 }];


  producer.send(payloads, function (err, data) {

    var options = {
        uri:appconfig.ddb_url + "/tenant/" + req.params.tenantid,
        method:"POST",
        contentType:"application/json",
        body: req.body,
        json:true
    };
    rp(options)
        .then(function (data) {
            console.log("OK" + data)
            res.send(data)
        })
        .catch(function (err) {
            console.log("BAD" + err);
            res.send(err);
        });
    });
});

app.post('/tenant/dev/:tenantid', function (req,res) {
  //TODO: push to DDB
  console.log(req.body);
  res.send(req.body);
});

app.delete('/tenant/:tenantid', function(req,res){

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
    //var httpServer = http.createServer(app);

    http.listen(appconfig.port, function () {
        console.log('Starting http server.. http://localhost:' + appconfig.port + '/test');
    });

}

