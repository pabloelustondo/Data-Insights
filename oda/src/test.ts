/**
 * Created by vdave on 12/2/2016.
 */
import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from './models/user';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
let expect = chai.expect;
@suite class Hello {


    @test('should pass async tests')
    public assert_pass_async(done: Function) {
        setTimeout(() => done(), 1);
    }

    @test('should fail async when given error')
    public assert_fail_async(done: Function) {
        setTimeout(() => done(new Error('Oops...')), 1);
    }

    @test('should pass getBatteryDischarge code')
    public assert_pass_getBatteryDischarge(done: Function ) {
        chai.use(chaiHttp);
        chai.request(server.app).get('/Devices/Battery/Summary/DischargeRate?dateFrom=2016-08-15&dateTo=2016-08-25')
            .end((err: any, res: any) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    }

    @test('should pass getBatteryDischarge code')
    public assert_pass_getBatteryDischarge_data(done: Function ) {

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


        chai.use(chaiHttp);
        chai.request(server.app).get('/Devices/Battery/Summary/DischargeRate?dateFrom=2016-08-15&dateTo=2016-08-25')
            .end((err: any, res: any) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                done();
            });
    }

    @test('should fail getBatteryDischarge code')
    public assert_fail_getBatteryDischarge(done: Function ) {
        chai.use(chaiHttp);


        chai.request(server.app).get('/Devices/Battery/Summary/DischargeRate')
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);
                done(new Error('Input parameters not defined'));
            });
    }

    @test('should fail getNumberOfDevices method')
    public assert_fail_getNumberOfDevices(done: Function ){
        chai.use(chaiHttp);

        chai.request(server.app).get('/Devices/Battery/Summary/InitialChargeLevels')
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);
                done(new Error('No date provided test case failed'));
            });
    }

    @test('should pass getNumberOfDevices method without dates')
    public assert_pass_getNumberOfDevices(done: Function ){
        chai.use(chaiHttp);

        chai.request(server.app).get('/Devices/Battery/Summary/InitialChargeLevels?dateFrom=2016-08-15&dateTo=2016-08-25')
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(err).to.be.null;
                done();
            });
    }

}
