
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


import * as winston from 'winston';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as methodOverride from 'method-override';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
let localDynamo = require('local-dynamo');

import {RegisterRoutes} from './routes';
const expressWinston = require('express-winston');

let config = require('../appconfig.json');
const app = express();
const swaggerPath =  __dirname + '/swagger.json';

let httpsOptions = {
    key: fs.readFileSync('./src/63663247-localhost_3002.key'),
    cert: fs.readFileSync('./src/63663247-localhost_3002.cert')
};

exports.app = app;

app.use('/docs', express.static(__dirname + '/swagger-ui'));
app.use('/', express.static(__dirname + '/swagger-ui'));
app.use('/swagger.json', (req, res) => {
    res.sendfile(swaggerPath);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');

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

let httpsServer = https.createServer(httpsOptions, app);
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
// console.log('Starting server.. http://localhost:' + config.port + '/docs');

httpsServer.listen(config.port, function (){
    console.log('Starting https server.. https://localhost:' + config.port + '/docs');
});


module.exports = logger;
module.exports.stream = {
    write: function(message: any, encoding: any){
        logger.info(message);
    }
};