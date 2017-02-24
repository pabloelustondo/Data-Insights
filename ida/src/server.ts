import './controllers/multiplePosts';
import './controllers/getAuthorizationToken';
import './controllers/uploadLargeDataSet';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import * as methodOverride from 'method-override';
import {RegisterRoutes} from './routes';
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
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

app.use(function(req, res, next) {
    res.header('X-Content-Type-Option', 'nosniff');
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

RegisterRoutes(app);

let httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(config.port, function (){
    console.log('Starting https server.. https://localhost:' + config.port + '/docs');
});

