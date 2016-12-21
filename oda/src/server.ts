
import './controllers/intialChargeLevelController';
import './controllers/dischargeRateController';
import './controllers/devicesDidNotSurviveShift';
import './controllers/listOfDevicesDidNotSurviveShift';
import './controllers/deviceList';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as methodOverride from 'method-override';
import {RegisterRoutes} from './routes';
let config = require('../appconfig.json');
const app = express();
const swaggerPath =  __dirname + '/swagger.json';

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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

RegisterRoutes(app);

/* tslint:disable-next-line */
console.log('Starting server.. http://localhost:' + config.port + '/docs');
app.listen(config.port);
