/**
 * Created by pabloelustondo on 2016-11-17.
 */
import * as path from 'path';
import * as express from 'express';
import * as https from 'https';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
var config = require('../appconfig.json');
import * as querystring from 'querystring';


// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.sendFile(path.join(__dirname + '/odahome.html'));
        });

        router.use(express.static('public'));

        router.get('/awstest', (req, res, next) => {
            const options = {
                hostname: config["aws-hostname"],
                path: config["aws-path"]+"?"+querystring.stringify(req.query),
                method: 'GET',
                headers: {
                    "x-api-key": config["aws-x-api-key"]
                }
            };

            const awsreq = https.request(options, (awsres) => {
                console.log(`STATUS: ${awsres.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(awsres.headers)}`);
                awsres.setEncoding('utf8');
                awsres.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                    const result = JSON.parse(chunk.toString());
                    res.json({"status":"ok", "request":options ,"result":result});
                });
                awsres.on('end', () => {
                    console.log('No more data in response.');
                });
            });

            awsreq.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
                const result = "was test failed";
                res.json({"result":result});
            });

            awsreq.end();
        });

        this.express.use('/', router);
    }

}

export default new App().express;
