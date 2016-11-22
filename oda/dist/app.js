"use strict";
/**
 * Created by pabloelustondo on 2016-11-17.
 */
const path = require('path');
const express = require('express');
const https = require('https');
const logger = require('morgan');
const bodyParser = require('body-parser');
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }
    // Configure API endpoints.
    routes() {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.sendFile(path.join(__dirname + '/odahome.html'));
        });
        router.get('/awstest', (req, res, next) => {
            //draft test to see if we can call AWS properly... this code will evolve into serious code later
            const options = {
                hostname: '2vf2f8xp27.execute-api.us-east-1.amazonaws.com',
                path: '/test/function_one',
                method: 'GET',
                headers: {
                    "x-api-key": "DiGyphaBjj10CbsNpqBAM2kLGfRAXRob9XYEchxm",
                    "dateFrom": "2016-08-20",
                    "dateTo": "2016-08-25"
                }
            };
            const awsreq = https.request(options, (awsres) => {
                console.log(`STATUS: ${awsres.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(awsres.headers)}`);
                awsres.setEncoding('utf8');
                awsres.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                    const result = JSON.parse(chunk.toString());
                    res.json({ "status": "ok", "request": options, "result": result });
                });
                awsres.on('end', () => {
                    console.log('No more data in response.');
                });
            });
            awsreq.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
                const result = "was test failed";
                res.json({ "result": result });
            });
            awsreq.end();
        });
        this.express.use('/', router);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new App().express;
