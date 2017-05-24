
import './controllers/intialChargeLevelController';
import './controllers/dischargeRateController';
import './controllers/devicesDidNotSurviveShift';
import './controllers/retrieveReasonData';
import './controllers/averageDischargeRateController';
import './controllers/Lists/listOfDevicesDidNotSurviveShift';
import './controllers/Lists/deviceList';
import './controllers/Lists/listOfDevicesNotFullyChargedAndDidNotSurviveShift';
import './controllers/Lists/listOfDevicesWithHighAverageDischargeRatePerShift';
import './controllers/applicationExecutionTime';
import './controllers/numberOfApplicationInstalls';
import './controllers/vehicles/ttcVehicleLocations';


import * as winston from 'winston';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as methodOverride from 'method-override';

import * as https from 'https';
import * as fs from 'fs';
let localDynamo = require('local-dynamo');

import {RegisterRoutes} from './routes';
const expressWinston = require('express-winston');

let helmet = require('helmet');


const app = express();
const swaggerPath =  __dirname + '/swagger.json';

var http = require('http').Server(app);

var path = require('path');
let config = require('../config.json');
let appconfig = require('../appconfig.json');

exports.config = config;
exports.appconfig = appconfig;


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

app.get('/chat', function(req,res){
    res.sendFile(path.join(__dirname  + '/../src/index.html'));
});

app.get('/status', function(req,res){
    if (req.query["secret"] !== appconfig.secret) res.send("wrong secret");

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
    });

}


module.exports = logger;
module.exports.stream = {
    write: function(message: any, encoding: any){
        logger.info(message);
    }
};