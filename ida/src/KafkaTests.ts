import { suite, test} from 'mocha-typescript';
import * as express from 'express';
let helmet = require('helmet');
const app = express();
let http = require('http').Server(app);
let path = require('path');
let config = require('../config.json');
let appconfig = require('../appconfig.json');
let globalconfig = require('../globalconfig.json');
let jwt  = require('jsonwebtoken');
let chai = require('chai');
let TS = require('TS');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
let expect = chai.expect;
let kafka = require('kafka-node');

globalconfig.hostname = 'localhost';  // this can be overwritten by app config if necessary
// our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
});
globalconfig.port = globalconfig[globalconfig.id + '_url'].split(':')[2];
appconfig = globalconfig;
exports.config = config;
exports.appconfig = appconfig;


@suite class HelloKafka {


    @test('Posting to a data source through IDA should result in a valid response from Kafka')
    public post_to_ida(done: Function) {
        let projections: any[] = ['sensorValue'];
        let testData = {
            metadata  : {
                dataSetId : 'idaSampleId2',
                projections: projections
            },
            data: {
                sensorId : '123',
                sensorValue: '45648946'
            }
        };
        let tenantId = 'varun_test';
        let jwtPayload = {
            tenantid: tenantId,
            agentid: '12345678901234567890'
        };
        let token = jwt.sign(jwtPayload, config['expiring-secret'], {expiresIn: 15});
        chai.use(chaiHttp);
        chai.request(server.app)
            .post('/data')
            .set('x-access-token', token)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err: any, res: any) => {
                console.log(JSON.stringify(res));
                expect(res).to.have.status(200);
                let response = JSON.parse(res.text);
                let expectedFileLocationPrefix = 'https://s3.amazonaws.com/da-s3-bucket%2FDataExchange%2F' + tenantId;
                let fileLocation = response.data.substr(0, expectedFileLocationPrefix.length);
                expect(fileLocation).to.be.equal(expectedFileLocationPrefix);
                done();
            });
    }
    @test('Checking if Kafka has received anything')
    public check_kafka_working(done: Function) {

        let kafkaClient = new kafka.Client(appconfig.kafka_url);
        let kafkaConsumer;
        let payloads =  [{ topic: 'varun_test_idaSampleId2', partition: 0 }];
        let options = {
            autoCommit: false,
            sessionTimeout: 4000
        };
        let io = require('socket.io')(http);
        try {
            kafkaConsumer = new kafka.Consumer(kafkaClient, payloads, options);
            this.post_to_ida(done); // makes an api request to IDA with test data and tenant
            // now let's see if Kafka receives anything
            kafkaConsumer.on('message', function (message: any, err: any) {
                if (!err) {
                    if ((io)) {
                        io.emit('message', message.value);
                        expect(message).not.to.be.equal(''); // the message is something and not nothing
                        expect(err).to.be.null;
                        done();
                    }
                }
            });
            kafkaConsumer.on('error', function (err: any) {
                done(new Error(err));
            });
        }catch (e) {
            if (e instanceof TS.TimeoutException) {
                done(new Error('Kafka did not receive message on time'));
            }else {
                done(new Error('some error: ' + e.toString()));
            }
        }
    }
}/**
 * Created by sxia on 06/02.
 */
