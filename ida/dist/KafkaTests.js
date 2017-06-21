"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const mocha_typescript_1 = require('mocha-typescript');
const express = require('express');
let helmet = require('helmet');
const app = express();
const swaggerPath = __dirname + '/swagger.json';
let http = require('http').Server(app);
let path = require('path');
let config = require('../config.json');
let appconfig = require('../appconfig.json');
let globalconfig = require('../globalconfig.json');
let jwt = require('jsonwebtoken');
let chai = require('chai');
let TS = require('TS');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
let expect = chai.expect;
globalconfig.hostname = 'localhost'; // this can be overwritten by app config if necessary
// our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function (key) {
    globalconfig[key] = appconfig[key];
});
globalconfig.port = globalconfig[globalconfig.id + '_url'].split(':')[2];
appconfig = globalconfig;
console.log('configuration');
console.log(appconfig);
exports.config = config;
exports.appconfig = appconfig;
let kafka = require('kafka-node');
let HelloKafka = class HelloKafka {
    post_to_ida(done) {
        let projections = ['sensorValue'];
        let testData = {
            metadata: {
                dataSetId: 'idaSampleId2',
                projections: projections
            },
            data: {
                sensorId: '123',
                sensorValue: '45648946'
            }
        };
        let tenantId = 'varun_test';
        let jwtPayload = {
            tenantid: tenantId,
            agentid: '12345678901234567890'
        };
        let token = jwt.sign(jwtPayload, config['expiring-secret'], { expiresIn: 15 });
        chai.use(chaiHttp);
        chai.request(server.app)
            .post('/data')
            .set('x-access-token', token)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err, res) => {
            console.log(JSON.stringify(res));
            expect(res).to.have.status(200);
            let response = JSON.parse(res.text);
            let expectedFileLocationPrefix = 'https://s3.amazonaws.com/da-s3-bucket%2FDataExchange%2F' + tenantId;
            let fileLocation = response.data.substr(0, expectedFileLocationPrefix.length);
            expect(fileLocation).to.be.equal(expectedFileLocationPrefix);
            done();
        });
    }
    check_kafka_working(done) {
        let kafkaClient = new kafka.Client(appconfig.kafka_url);
        let kafkaConsumer;
        let payloads = [{ topic: 'varun_test_idaSampleId2', partition: 0 }];
        let options = {
            autoCommit: false,
            sessionTimeout: 4000
        };
        let io = require('socket.io')(http);
        try {
            kafkaConsumer = new kafka.Consumer(kafkaClient, payloads, options);
            this.post_to_ida(done); // makes an api request to IDA with test data and tenant
            // now let's see if Kafka receives anything
            kafkaConsumer.on('message', function (message, err) {
                if (!err) {
                    if ((io)) {
                        io.emit('message', message.value);
                        expect(message).not.to.be.equal(''); // the message is something and not nothing
                        expect(err).to.be.null;
                        done();
                    }
                }
            });
            kafkaConsumer.on('error', function (err) {
                done(new Error(err));
            });
        }
        catch (e) {
            if (e instanceof TS.TimeoutException) {
                done(new Error('Kafka did not receive message on time'));
            }
            else {
                done(new Error('some error: ' + e.toString()));
            }
        }
    }
};
__decorate([
    mocha_typescript_1.test('Posting to a data source through IDA should result in a valid response from Kafka')
], HelloKafka.prototype, "post_to_ida", null);
__decorate([
    mocha_typescript_1.test('Checking if Kafka has received anything')
], HelloKafka.prototype, "check_kafka_working", null);
HelloKafka = __decorate([
    mocha_typescript_1.suite
], HelloKafka);
 /**
 * Created by sxia on 06/02.
 */
//# sourceMappingURL=KafkaTests.js.map