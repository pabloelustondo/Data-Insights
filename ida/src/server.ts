import './controllers/multiplePosts';
import './controllers/getAuthorizationToken';
import './controllers/uploadLargeDataSet';

import * as winston from 'winston';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import * as methodOverride from 'method-override';
const morgan = require('morgan');

const expressWinston = require('express-winston');

import {RegisterRoutes} from './routes';

let helmet = require('helmet');
let config = require('../appconfig.json');
const app = express();
const swaggerPath =  __dirname + '/swagger.json';

let httpsOptions = {
    key: fs.readFileSync(config['https-key-location'] ),
    cert: fs.readFileSync(config['https-cert-location'] )
};


exports.app = app;
app.use(helmet());
const logger = expressWinston.logger({
    transports: [
        new winston.transports.File({
            name: 'verboseLog',
            filename: './verbose-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'verbose',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            maxFiles: 5
        }),
        new winston.transports.File({
            name: 'infoLog',
            filename: './info-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'info',
            maxFiles: 5
        }),
        new winston.transports.File({
            name: 'debugLog',
            filename: './debug-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'debug',
            maxFiles: 5
        }),
        new winston.transports.File({
            name: 'errorLog',
            filename: './error-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'error',
            maxFiles: 5
        })
    ],
    exitOnError: false
});

const errorLogger = expressWinston.errorLogger({

    dumpExceptions: true,
    showStack: true,
    transports: [
        new winston.transports.File({
            name: 'vverboseLog',
            filename: './logs/error-verbose-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'verbose',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            maxFiles: 5
        }),
        new winston.transports.File({
            name: 'iinfoLog',
            filename: './logs/error-info-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'info',
            maxFiles: 5
        }),
        new winston.transports.File({
            name: 'ddebugLog',
            filename: './logs/error-debug-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'debug',
            maxFiles: 5
        }),
        new winston.transports.File({
            name: 'eerrorLog',
            filename: './logs/error-error-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'verbose',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            maxFiles: 5
        })
    ],
    exitOnError: false
});



// app.use(morgan('dev'));
app.use(logger);
app.use('/docs', express.static(__dirname + '/swagger-ui'));
app.use('/', express.static(__dirname + '/swagger-ui'));
app.use('/swagger.json', (req, res) => {
    res.sendfile(swaggerPath);
});
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

app.use(bodyParser.json({
    type: function() {
        return true;
    },
        limit: '500mb'
}
));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

RegisterRoutes(app);

let httpsServer = https.createServer(httpsOptions, app);

app.use(errorLogger);

httpsServer.listen(config.port, function (){
    console.log('Starting https server.. https://localhost:' + config.port + '/docs');
});

