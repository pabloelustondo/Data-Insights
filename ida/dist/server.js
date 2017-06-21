"use strict";
require('./controllers/getAuthorizationToken');
require('./controllers/finalUploadEndpoint');
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const methodOverride = require('method-override');
// const morgan = require('morgan');
// const expressWinston = require('express-winston');
const routes_1 = require('./routes');
let helmet = require('helmet');
let config = require('../config.json');
const app = express();
const swaggerPath = __dirname + '/swagger.json';
let path = require('path');
exports.appconfig = require('../appconfig.json');
let globalconfig = require('../globalconfig.json');
globalconfig.hostname = 'localhost'; // this can be overwritten by app config if necessary
// our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(exports.appconfig).forEach(function (key) {
    globalconfig[key] = exports.appconfig[key];
});
globalconfig.port = globalconfig[globalconfig.id + '_url'].split(':')[2];
console.log('configuration');
console.log(exports.appconfig);
exports.appconfig = globalconfig;
exports.appconfig = globalconfig;
if (!fs.existsSync(config.logDir)) {
    fs.mkdir((config.logDir), function (err) {
        if (err) {
            console.log(err);
        }
    });
}
app.use(helmet());
/*
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
            filename: appconfig.logDir + '/error-verbose-ida-logs.log',
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
            filename: appconfig.logDir + '/error-info-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'info',
            maxFiles: 5
        }),
        new winston.transports.File({
            name: 'ddebugLog',
            filename: appconfig.logDir + 'logs/error-debug-ida-logs.log',
            json: true,
            colorize: true,
            maxsize: 5242880,
            level : 'debug',
            maxFiles: 5
        }),
        new winston.transports.File({
            name: 'eerrorLog',
            filename: appconfig.logDir + '/error-error-ida-logs.log',
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

*/
// app.use(morgan('dev'));
// app.use(logger);
app.use('/docs', express.static(__dirname + '/swagger-ui'));
app.use('/', express.static(__dirname + '/swagger-ui'));
app.use('/swagger.json', (req, res) => {
    res.sendfile(swaggerPath);
});
app.use('/testing', express.static(path.join(__dirname + '/../testing')));
app.use('/src', express.static(path.join(__dirname + '/../src')));
app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname + '/../testing/spec/SpecRunner.html'));
});
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({
    type: function () {
        return true;
    },
    limit: '500mb'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.get('/status', function (req, res) {
    if (req.query['secret'] !== exports.appconfig.secret) {
        return res.send('wrong secret');
    }
    let report = {};
    Object.keys(exports.appconfig).forEach(function (key) {
        if (key !== 'secret') {
            if (req.query[key]) {
                exports.appconfig[key] = req.query[key];
            }
            report[key] = exports.appconfig[key];
        }
    });
    return res.send(report);
});
routes_1.RegisterRoutes(app);
app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message || 'An error occurred during the request.');
});
if (exports.appconfig.useSSL) {
    let httpsOptions = {
        key: fs.readFileSync(exports.appconfig['https-key-location']),
        cert: fs.readFileSync(exports.appconfig['https-cert-location'])
    };
    let httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(exports.appconfig.port, function () {
        console.log('Starting https server.. https://localhost:' + exports.appconfig.port + '/docs');
    });
}
else {
    let httpServer = http.createServer(app);
    httpServer.listen(exports.appconfig.port, function () {
        console.log('Starting http server.. http://localhost:' + exports.appconfig.port + '/test');
    });
}
// app.use(errorLogger);
/*
module.exports = logger;
module.exports.stream = {
    write: function(message: any, encoding: any){
        logger.info(message);
    }
};

    */ 
//# sourceMappingURL=server.js.map