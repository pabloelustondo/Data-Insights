/**
 * Created by vdave on 12/2/2016.
 */
import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from './models/user';
const config = require('../appconfig.json');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
let expect = chai.expect;

const testData =  {
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

@suite class Hello {

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


}
/**
 * Created by vdave on 12/5/2016.
 */
