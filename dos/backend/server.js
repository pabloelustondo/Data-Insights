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

var report = [];

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

///////// REPORTING BEGIN

report = dasServicesList(appconfig);
callServices();

function isDosService(configItem){

  var isUrl = configItem.toString().indexOf("url") > -1;
  return isUrl;
}

function isMongoDb(configItem){
  return configItem.name === "mongodb";
}

function isKafka(configItem){
  return configItem.name === "kafka";
}

function dasServicesList(appconfig){
  var servicekeys = Object.keys(appconfig).filter(function(key){return isDosService(key)});
  var services = [];
  servicekeys.forEach(function(key){services.push({id:services.length, name:dasServiceName(key), url:appconfig[key]})})
  return services;
}

function dasServiceName(dasServiceKey){
  return dasServiceKey.replace("_url","");
}

function callService(item){

  var options = {
    uri:item.url,
    method:"GET",
    contentType:"application/json"
  };
  rp(options)
    .then(function (data) {
      report[item.id].status = "up";
    })
    .catch(function (err) {
      report[item.id].status = "down";
    });
}

function callMongoDb(item){
  report[item.id].status = "?";
}

function callKafka(item){
  report[item.id].status = "?";
}

function callServices(){
  report.forEach(function(item){
    if (isMongoDb(item)) {
      callMongoDb(item);
    } else
    if (isKafka(item)) {
      callKafka(item);
    } else {
      callService(item);
    }
  });
}

setInterval(
  function(){callServices();},
  1000
);

app.get('/report', function(req,res){
  res.send(report);
});



////////// REPORTING END
app.get('/daduser/:userid', function(req,res){

    var options = {
        uri:appconfig.ddb_url + "/daduser/" + req.params.userid,
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

app.post('/daduser/:userid', function(req,res){
    var options = {
        uri:appconfig.ddb_url + "/daduser/" + req.params.userid,
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


app.delete('/daduser/:userid', function(req,res){

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

