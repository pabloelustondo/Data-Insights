import './controllers/multiplePosts';
import './controllers/getAuthorizationToken';
import './controllers/uploadLargeDataSet';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import * as methodOverride from 'method-override';

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

httpsServer.listen(config.port, function (){
    console.log('Starting https server.. https://localhost:' + config.port + '/docs');
});

