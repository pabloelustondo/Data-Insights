
import './controllers/queryController';
import './controllers/topicsController';


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

let helmet = require('helmet');

let config = require('../appconfig.json');
const app = express();
const swaggerPath =  __dirname + '/swagger.json';


exports.app = app;

app.use(helmet());
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
// console.log('Starting server.. http://localhost:' + config.port + '/docs');

if (config.useSSL) {
    let httpsOptions = {
        key: fs.readFileSync(config['https-key-location']),
        cert: fs.readFileSync(config['https-cert-location'])
    };
    let httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(config.port, function (){
        console.log('Starting https server.. https://localhost:' + config.port + '/docs');
    });
} else {

    let httpServer = http.createServer(app);

    httpServer.listen(config.port, function () {
        console.log('Starting no SSL http server.. http://localhost:' + config.port + '/docs');
    });


}


module.exports = logger;
module.exports.stream = {
    write: function(message: any, encoding: any){
        logger.info(message);
    }
};