import './controllers/usersController';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as methodOverride from 'method-override';
import {RegisterRoutes} from './routes';
let config = require('../appconfig.json');
const app = express();

exports.app = app;

app.use('/docs', express.static(__dirname + '/swagger-ui'));
app.use('/', express.static(__dirname + '/swagger-ui'));
app.use('/swagger.json', (req, res) => {
    res.sendfile('./dist/swagger.json');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

RegisterRoutes(app);

/* tslint:disable-next-line */
console.log('Starting server.. http://localhost:' + config.port + '/docs');
app.listen(config.port);
