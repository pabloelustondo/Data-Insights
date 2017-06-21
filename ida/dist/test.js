"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by vdave on 12/2/2016.
 */
const mocha_typescript_1 = require('mocha-typescript');
const config = require('../config.json');
let jwt = require('jsonwebtoken');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
let expect = chai.expect;
const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZ2VudGlkIjoiMjEzIiwidGVuYW50aWQiOiJ4eXphMTIiLCJpYXQiOjE0ODc4Nzk1NTcsImV4cCI6MTQ5NTA3OTU1N30.TnX4J-xSBGxvgSd2CO5CCMZvQ4TBHJX5Ne4Ioy6A2Kk';
const testData = {
    'createdAt': '2016-12-02T17:28:44.996Z',
    'metadata': 'To Be Defined',
    'data': [{
            'NumberOfDevices': '8',
            'DischargeRate': 3
        }, {
            'NumberOfDevices': '30',
            'DischargeRate': 4
        }, {
            'NumberOfDevices': '71',
            'DischargeRate': 5
        }, {
            'NumberOfDevices': '62',
            'DischargeRate': 6
        }, {
            'NumberOfDevices': '31',
            'DischargeRate': 7
        }, {
            'NumberOfDevices': '15',
            'DischargeRate': 8
        }, {
            'NumberOfDevices': '2',
            'DischargeRate': 9
        }, {
            'NumberOfDevices': '2',
            'DischargeRate': 10
        }, {
            'NumberOfDevices': '4',
            'DischargeRate': 11
        }, {
            'NumberOfDevices': '2',
            'DischargeRate': 12
        }, {
            'NumberOfDevices': '1',
            'DischargeRate': 14
        }, {
            'NumberOfDevices': '1',
            'DischargeRate': 17
        }, {
            'NumberOfDevices': '1',
            'DischargeRate': 19
        }]
};
let Hello = class Hello {
    /*
    @test('should pass async tests')
    public assert_pass_async(done: Function) {
        setTimeout(() => done(), 1);
    }

    @test('should fail async when given error')
    public assert_fail_async(done: Function) {
        setTimeout(() => done(new Error('Oops...')), 1);
    }

    @test('should pass put data to /DATA api')
    public assert_pass_putSampleData(done: Function ) {

        const testPutData = {
            'dev_id': '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
            'server_time_stamp':  new Date(),
            'int_value': 191231231319,
            'stat_type': 12345,
            'time_stamp': new Date()
        };
        chai.use(chaiHttp);
        chai.request(server.app)
            .post('/Data')
            .set('X-API-key', config['aws-x-api-key'])
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testPutData)
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(err).to.be.null;
                done();
            });
    }

    @test('should fail put data to /DATA api due to malformed input - typo in metadata')
    public assert_fail_putSampleData(done: Function ) {

        const testPutData = {
            'metadaata': 'here is where metadata explaining the data should go',
            'createdAt': '2016-08-08',
            'data': [
                'aaa',
                'bbb',
                'ccc'
            ]
        };
        chai.use(chaiHttp);
        chai.request(server.app)
            .post('/Data')
            .set('X-API-key', config['aws-x-api-key'])
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testPutData)
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);
                done();
            });
    }

    @test('should fail put data to /DATA api due to wrong data type')
    public assert_fail_missingApiKey(done: Function ) {

        const testPutData = {
            'metadata': 'here is where metadata explaining the data should go',
            'createdAt': '2016-08-08',
            'data': [
                'aaa',
                'bbb',
                'ccc'
            ]
        };
        chai.use(chaiHttp);
        chai.request(server.app)
            .post('/Data')
            .set('X-API-key', 'aaaa')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testPutData)
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);
                done();
            });
    }

    */
    test_put_large_json_file(done) {
        const testData = {
            'file': config['large-data-set']
        };
        console.log('testing');
        let tenantId = 'varun_test';
        let jwtPayload = {
            tenantid: tenantId,
            agentid: '12345678901234567890'
        };
        let token = jwt.sign(jwtPayload, config['expiring-secret'], { expiresIn: 150000 });
        console.log(JSON.stringify(token));
        chai.use(chaiHttp);
        chai.request('http://localhost:3010')
            .post('/Data/LargeDataSets')
            .set('x-access-token', testToken)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            done();
        });
    }
    call_dps_from_ida(done) {
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
        console.log(JSON.stringify(token));
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
};
__decorate([
    mocha_typescript_1.test('put json data in aws in large file. It makes a call with a test tenant, test data source and self-signed jwt')
], Hello.prototype, "test_put_large_json_file", null);
__decorate([
    mocha_typescript_1.test('make one call to DPS to process data')
], Hello.prototype, "call_dps_from_ida", null);
Hello = __decorate([
    mocha_typescript_1.suite
], Hello);
/**
 * Created by vdave on 12/5/2016.
 */
//# sourceMappingURL=test.js.map