import * as express from 'express';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as  path from 'path';
import * as rp from 'request-promise';
import * as  cors from 'cors';
import * as sio from 'socket.io';
import * as Sml from './sml'
import * as Smli from './smli'
//Change somet

let io = sio(http);



declare var require:any;
var config = require('./config.json');
var appconfig = require('./appconfig.json');
var globalconfig = require('./globalconfig.json');

let app = express();
let router = express.Router();

globalconfig.hostname = "localhost";  //this can be overwritten by app config if necessary
//our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
});
globalconfig.port = globalconfig[globalconfig.id+"_url"].split(":")[2];

appconfig = globalconfig;

console.log("configuration");
console.log(appconfig);


let dataSetProviderlurl ='http://localhost:' + appconfig.port + '/getdata';
//this is simulating the source of our input data... that can be CDL for DPS and ODA for DAD...etc

let smlInterpreter = new Smli.SMLI(dataSetProviderlurl);


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg:string){
        console.log('message: ' + msg);
    });
});
io.on('connection', function(socket){
    socket.on('chat message', function(msg:string){
        io.emit('chat message', msg);
    });
});


app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use('/testing', express.static(path.join(__dirname + '/testing')));

app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname  + '/testing/spec/SpecRunner.html'));
});

app.get('/chat', function(req,res){
    res.sendFile(path.join(__dirname  + '/index.html'));
});

app.get('/', function(req,res){
    res.send("SML Backend");
});

app.get('/status', function(req,res){
    if (req.query["secret"] !== appconfig.secret) res.send("wrong key");

    let report:any = {};
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

app.get('/datasets', function(req,res){
    fs.readdir("testdata", function(err, files){
        res.send(JSON.stringify(files))
    })
});

app.post('/getdata', function(req,res){
    fs.readFile("testdata/devstats1.json",'utf8', function(err, file){
        console.log("logdata");
        res.send(file);
    })
});

app.post('/smlquery', function(req,res){
    //not implemented yet
    let ds = new Sml.SmlDataSet();
    console.log("slmquery called 2");
        smlInterpreter.getDataSet(ds,[]).then(
            (result) => {
                console.log("slmquery called - come back from interpreter");
            res.send(result);
             },
            (err) => {
                console.log("slmquery called - come back NOT from interpreter");
                res.status(400).send(err);
            },
        );
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
    let httpServer = http.createServer(app);

    httpServer.listen(appconfig.port, function () {
        console.log('Starting http server.. http://localhost:' + appconfig.port + '/test');
    });

}

