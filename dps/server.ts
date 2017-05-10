import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as helmet from "helmet";
import {MongoClient, Db} from "mongodb";
let _ = require('lodash');
let config = require('./config.json');
let appconfig = require('./appconfig.json');
let app = express();
var mongodb = require('mongodb').MongoClient;

import {uploadRawData, uploadModifiedData} from './services/rawDataLakeService';
import {DatabaseService} from  './services/databaseService';
import {User} from "./models/user";

////////////////////////
// Express stuff

let db = new DatabaseService(appconfig.ddb_address);
//db.start();

app.set('db', db);

app.use(bodyParser.json({limit: '50mb'}));
app.use('/testing', express.static(path.join(__dirname + '/testing')));
app.use(bodyParser.json({
        type: function() {
            return true;
        },
        limit: '500mb'
    }
));


if (appconfig.testingmode) {
    app.get('/test', function (req, res) {
        res.sendFile(path.join(__dirname + '/testing/spec/SpecRunner.html'));
    });
}

app.get('/', function(req,res){
    res.send("DPS");
});

app.use(helmet());

app.use(cors());

////////////////////////////
// CUSTOMER TENANT DATA API
////////////////////////////

// Puts a data point into a tenant datasets.
app.post('/data/request', function(req,res) {
    console.log('request came in');

    // send data to s3 without a lot of fuss
    let idaMetadata = req.body.idaMetadata;
    let clientMetadata = req.body.clientMetadata;
    if (!idaMetadata) {
        res.status(400).send('Missing idaMetadata field');
    } else if (!clientMetadata) {
        res.status(400).send('Missing clientMetadata field');
    }
    else {
        let tenantId = req.body.idaMetadata.tenantId;
        let dataSourceId = req.body.idaMetadata.dataSourceId;
        uploadRawData(tenantId, dataSourceId, req.body).then(function (awsResponse: any) {
             console.log(awsResponse.Location);
                res.status(200).send({
                    status: 200,
                    response: awsResponse.Location
                });
            }, function (error: any) {
                res.status(500).send('you failed.' + error);
            }
        );

        // massage and clean up data before sending to database layer
        let tenant = db.getTenant(req.body.idaMetadata.tenantId);
        if(tenant) {
            let dataSource = _.find(tenant.dataSources, ['dataSourceId', req.body.idaMetadata.dataSourceId]);
            let projections = (!clientMetadata.projections) ? dataSource.metadata.projections : clientMetadata.projections;
            let dataSetId = (!clientMetadata.dataSetId) ? dataSource.metadata.dataSetId : clientMetadata.dataSetId;

            let inputData: any = { };

            if (projections.length > 0) {
                projections.forEach((item, index) => {
                    inputData[item] = req.body.clientData[item];
                });
            } else {
                inputData = req.body.clientData;
            }

            uploadModifiedData(tenant.tenantId, dataSetId, inputData).then(function(response) {
               console.log(JSON.stringify(response));
            });
        }
    }

});



if (config.useSSL) {
    var httpsOptions = {
        key: fs.readFileSync(config['https_key_location'] ),
        cert: fs.readFileSync(config['https_cert_location'] )
    };
    var httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(appconfig.port, function () {
        console.log('Starting https server.. https://localhost:' + appconfig.port + '/test');
    });
} else {
    var httpServer = http.createServer(app);

    httpServer.listen(appconfig.port, function () {
        console.log('Starting no SSL http server.. http://localhost:' + appconfig.port + '/test');
    });
}