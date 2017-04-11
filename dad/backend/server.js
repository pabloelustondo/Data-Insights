var express  = require('express');
var app = express();
var router = express.Router();
var https = require('https');
var http = require('http');
var fs = require('fs');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var config = require('./config.json');
var appconfig = require('./appconfig.json');
var path = require('path');
var rp = require('request-promise');


app.use(bodyParser.json({limit: '50mb'}));
app.use('/testing', express.static(path.join(__dirname + '/testing')));

app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname  + '/testing/spec/SpecRunner.html'));
});

app.get('/', function(req,res){
    res.send("Welcome to DAD Backend - A Very Light Basic Backend API for DAD");
});

app.get('/daduser/:userid', function(req,res){

    var options = {
        uri:"http://localhost:8000/daduser/testtenant-testuser",
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
        uri:"http://localhost:8000/daduser/testtenant-testuser",
        method:"POST",
        contentType:"application/json",
        body: req.body,
        json:true
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
    var httpServer = http.createServer(app);

    httpServer.listen(appconfig.port, function () {
        console.log('Starting http server.. http://localhost:' + appconfig.port + '/test');
    });

}

