import './controllers/queryController';
import './controllers/topicsController';

import * as rp from 'request-promise';
import * as winston from 'winston';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as methodOverride from 'method-override';

import * as https from 'https';
import * as fs from 'fs';
let localDynamo = require('local-dynamo');

import {RegisterRoutes} from './routes';
import {DatabaseService} from  './services/databaseService';
const expressWinston = require('express-winston');

let helmet = require('helmet');

let kafka = require('kafka-node');
let ConsumerGroup = kafka.ConsumerGroup;

const app = express();
const swaggerPath =  __dirname + '/swagger.json';

var http = require('http').Server(app);

var path = require('path');
let config = require('../config.json');
let appconfig = require('../appconfig.json');
let globalconfig = require('../globalconfig.json');

globalconfig.hostname = "localhost";  //this can be overwritten by app config if necessary
//our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
});

globalconfig.port = globalconfig[globalconfig.id+"_url"].split(":")[2];

appconfig = globalconfig;

console.log("configuration");
console.log(appconfig);

let db = new DatabaseService(appconfig.ddb_address);


app.set('db', db);

var io = require('socket.io')(http);

io.on('connection', function(socket:any){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

io.on('connection', function(socket:any){
    socket.on('chat message', function(msg:any){
        console.log('message: ' + msg);
    });
});
io.on('connection', function(socket:any){
    socket.on('chat message', function(msg:any){
        io.emit('chat message', msg);
    });
});




exports.app = app;

app.use(helmet());
app.use('/docs', express.static(__dirname + '/swagger-ui'));
app.use('/', express.static(__dirname + '/swagger-ui'));
app.use('/swagger.json', (req, res) => {
    res.sendfile(swaggerPath);
});

app.use('/testing', express.static(path.join(__dirname + '/../testing')));
app.use('/src', express.static(path.join(__dirname + '/../src')));

app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname  + '/../testing/spec/SpecRunner.html'));
});

app.get('/messagingtest', function(req,res){
    res.sendFile(path.join(__dirname  + '/../src/index.html'));
});

app.get('/status', function(req,res){
    if (req.query["secret"] !== appconfig.secret) return res.send("wrong secret");

    var report:any = {};
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



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('X-Content-Type-Option', 'nosniff');
    next();
});

const logger = expressWinston.logger({
     transports: [
         new winston.transports.File({
             filename: './all-logs.log',
             json: true,
             colorize: true,
             maxsize: 5242880,
             maxFiles: 5
         })
     ],
     exitOnError: false
 });

app.use(logger);

// app.use(expressWinston.logger({
//    transports: [
//        new winston.transports.Console({
//            json: true,
//            colorize: true
//        })
//    ]
// }));

RegisterRoutes(app);
app.use( (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status || 500).send(err.message || 'An error occurred during the request.');
});
app.use(logger);


/* tslint:disable-next-line */


// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true,
//             handleExceptions: true,
//             level: 'debug'
//         })
//     ]
// }));
// console.log('Starting server.. http://localhost:' + appconfig.port + '/docs');

if (config.useSSL) {
    let httpsOptions = {
        key: fs.readFileSync(config['https-key-location']),
        cert: fs.readFileSync(config['https-cert-location'])
    };
    let httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(appconfig.port, function (){
        console.log('Starting https server.. https://localhost:' + appconfig.port + '/test');
    });
} else {
    let httpOptions = {
    };

   // let httpServer = http.createServer(app);
    http.listen(appconfig.port, function (){
        console.log('Starting http server.. http://localhost:' + appconfig.port + '/test');

        let db = app.get('db');

        const headersOptions = {
            'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
        };


        const options: rp.OptionsWithUrl = {
            json: true,
            method: 'get',
            headers: headersOptions,
            url: appconfig['ddb_url'] + '/getAllTenants',
        };
        rp(options).then(function (data) {
            db.populateTenants(data.tenants);
        }).catch(function (err) {
            console.log(err);
        }).then(function () {
            let tenant = db.getTenant('test');
            console.log(JSON.stringify(tenant));
        }).then(function () {


            let dataSets = db.getAllDataSets();
            let topics = ['undefined_transactionLogs'];
            let consumerGroupOptions = {
                host: '127.0.0.1:2181',
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

            let consumerGroup = new ConsumerGroup(consumerGroupOptions , 'undefined_cleanedData');
            consumerGroup.on('error', function(err: any) {
                console.log('error' + err);
            });
            consumerGroup.on('message', function (message: any) {
                try {
                    let data = JSON.parse(message.value);

                    let idaMetadata = data.idaMetadata;
                    let clientData = data.clientData;
                    let clientMetadata = data.clientMetadata;

                    console.log('json = ' + JSON.stringify(data));

                    io.emit('chat message', message.value);
                } catch (e) {
                    console.log('not json format' + message.value);
                }
                // console.log('message' + message);
            });

        });

    });

}

exports.appconfig = globalconfig;
module.exports = logger;
module.exports.stream = {
    write: function(message: any, encoding: any){
        logger.info(message);
    }
};