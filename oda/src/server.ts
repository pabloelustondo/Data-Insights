
import './controllers/intialChargeLevelController';
import './controllers/dischargeRateController';
import './controllers/devicesDidNotSurviveShift';
import './controllers/retrieveReasonData';
import './controllers/averageDischargeRateController';
import './controllers/Lists/listOfDevicesDidNotSurviveShift';
import './controllers/Lists/deviceList';
import './controllers/Lists/listOfDevicesNotFullyChargedAndDidNotSurviveShift';
import './controllers/Lists/listOfDevicesWithHighAverageDischargeRatePerShift';
import './controllers/applicationExecutionTime';
import './controllers/numberOfApplicationInstalls';
import './controllers/vehicles/ttcVehicleLocations';
import './controllers/queryController';
import './controllers/topicsController';


import * as winston from 'winston';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as methodOverride from 'method-override';

import * as https from 'https';
import * as fs from 'fs';
let localDynamo = require('local-dynamo');

import {RegisterRoutes} from './routes';
const expressWinston = require('express-winston');

let helmet = require('helmet');


const app = express();
const swaggerPath =  __dirname + '/swagger.json';

var http = require('http').Server(app);

var path = require('path');
let config = require('../config.json');
let appconfig = require('../appconfig.json');
let globalconfig = require('../globalconfig.json');

globalconfig.hostname = "localhost";  //this can be overwritten by app config if necessary
//our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
})
globalconfig.port = globalconfig[globalconfig.id+"_url"].split(":")[2];

appconfig = globalconfig;

console.log("configuration");
console.log(appconfig);

exports.config = config;
exports.appconfig = appconfig;


var kafka = require('kafka-node');
var kafkaClient = new kafka.Client(appconfig.kafka_url);
/*
 Client(connectionString, clientId, [zkOptions], [noAckBatchOptions], [sslOptions])
 connectionString: Zookeeper connection string, default localhost:2181/
 clientId: This is a user-supplied identifier for the client application, default kafka-node-client
 zkOptions: Object, Zookeeper options, see node-zookeeper-client
 noAckBatchOptions: Object, when requireAcks is disabled on Producer side we can define the batch properties, 'noAckBatchSize' in bytes and 'noAckBatchAge' in milliseconds. The default value is { noAckBatchSize: null, noAckBatchAge: null } and it acts as if there was no batch
 sslOptions: Object, options to be passed to the tls broker sockets, ex. { rejectUnauthorized: false } (Kafka +0.9)

 */

var payloads =  [{ topic: 'demo', partition: 0 }];
var options = { autoCommit: false};
try {
    var kafkaConsumer = new kafka.Consumer(kafkaClient, payloads, options);
    /*
     Consumer(client, payloads, options)
     client: client which keeps a connection with the Kafka server. Note: it's recommend that create new client for different consumers.
     payloads: Array,array of FetchRequest, FetchRequest is a JSON object like:
     {
     topic: 'topicName',
     offset: 0, //default 0
     }
     options: options for consumer,
     {
     groupId: 'kafka-node-group',//consumer group id, default `kafka-node-group`
     // Auto commit config
     autoCommit: true,
     autoCommitIntervalMs: 5000,
     // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
     fetchMaxWaitMs: 100,
     // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
     fetchMinBytes: 1,
     // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
     fetchMaxBytes: 1024 * 1024,
     // If set true, consumer will fetch message from the given offset in the payloads
     fromOffset: false,
     // If set to 'buffer', values will be returned as raw buffer objects.
     encoding: 'utf8'
     }
     Example:

     var kafka = require('kafka-node'),
     Consumer = kafka.Consumer,
     client = new kafka.Client(),
     consumer = new Consumer(
     client,
     [
     { topic: 't', partition: 0 }, { topic: 't1', partition: 1 }
     ],
     {
     autoCommit: false
     }
     );

     */


    kafkaConsumer.on('message', function (message: any, err: any) {
        if (!err) {
            console.log(message);
            if (io) io.emit('chat message', message.value);
        }
    });

    kafkaConsumer.on('error', function (err: any) {
        console.log(err);
    })




} catch(e){
    console.log("ODA could not start kafka consumer");

}


var io = require('socket.io')(http);

io.on('connection', function(socket:any){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

io.on('connection', function(socket:any){
    socket.on('chat message', function(msg:any){
        console.log('message: ' + msg);
    });
});
io.on('connection', function(socket:any){
    socket.on('chat message', function(msg:any){
        io.emit('chat message', msg);
    });
});




exports.app = app;

app.use(helmet());
app.use('/docs', express.static(__dirname + '/swagger-ui'));
app.use('/', express.static(__dirname + '/swagger-ui'));
app.use('/swagger.json', (req, res) => {
    res.sendfile(swaggerPath);
});

app.use('/testing', express.static(path.join(__dirname + '/../testing')));
app.use('/src', express.static(path.join(__dirname + '/../src')));

app.get('/test', function(req,res){
    res.sendFile(path.join(__dirname  + '/../testing/spec/SpecRunner.html'));
});

app.get('/messagingtest', function(req,res){
    res.sendFile(path.join(__dirname  + '/../src/index.html'));
});

app.get('/status', function(req,res){
    if (req.query["secret"] !== appconfig.secret) return res.send("wrong secret");

    var report:any = {};
    Object.keys(appconfig).forEach(function(key){
        if (key!== "secret") {
            if (req.query[key]){
                appconfig[key] = req.query[key];
            }
            report[key]=appconfig[key];
        }
    });
    return res.send(report);
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
// console.log('Starting server.. http://localhost:' + appconfig.port + '/docs');

if (config.useSSL) {
    let httpsOptions = {
        key: fs.readFileSync(config['https-key-location']),
        cert: fs.readFileSync(config['https-cert-location'])
    };
    let httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(appconfig.port, function (){
        console.log('Starting https server.. https://localhost:' + appconfig.port + '/test');
    });
} else {
    let httpOptions = {
    };

   // let httpServer = http.createServer(app);
    http.listen(appconfig.port, function (){
        console.log('Starting http server.. http://localhost:' + appconfig.port + '/test');
    });

}


module.exports = logger;
module.exports.stream = {
    write: function(message: any, encoding: any){
        logger.info(message);
    }
};