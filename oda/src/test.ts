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

    @test('should fail getBatteryDischarge code - no date provided.')
    public assert_fail_getBatteryDischarge(done: Function ) {
        chai.use(chaiHttp);


        chai.request(server.app).get('/Devices/Battery/Summary/DischargeRate')
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);
                done(new Error('Input parameters not defined'));
            });
    }

    @test('should fail getNumberOfDevices method - no dates provided')
    public assert_fail_getNumberOfDevices(done: Function ) {
        chai.use(chaiHttp);

        chai.request(server.app).get('/Devices/Battery/Summary/InitialChargeLevels')
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);
                done(new Error('No date provided test case failed'));
            });
    }


    @test('should pass getNumberOfDevices method with out of range date values')
    public assert_pass_getNumberOfDevices(done: Function ) {
        chai.use(chaiHttp);

        chai.request(server.app).get('/Devices/Battery/Summary/InitialChargeLevels?dateFrom=2019-08-15&dateTo=2019-08-25')
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(err).to.be.null;
                done();
            });
    }


    @test('Should pass devicesDidNotSurviveShift call status 200 - with shift duration as double')
    public assert_fail_getDevicesNotLastedShift_status_double(done: Function ) {
        chai.use(chaiHttp);
        chai.request(server.app).get('/Devices/Battery/Summary/DevicesNotSurvivedShift?duration=12.5')
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);

                done();
            });
    }

    @test('Should pass devicesDidNotSurviveShift call status 200 - with shift duration as double')
    public assert_fail_getDevicesNotLastedShift_status_int(done: Function ) {
        chai.use(chaiHttp);

        chai.request(server.app).get('/Devices/Battery/Summary/DevicesNotSurvivedShift?duration=12.5')
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);
                done();
            });
    }

    @test('Should pass devicesDidNotSurviveShift call status 200 - with both parameters provided')
    public assert_pass_getDevicesNotLastedShift_status_dateTime(done: Function ) {
        chai.use(chaiHttp);

        chai.request(server.app).get('/Devices/Battery/Summary/DevicesNotSurvivedShift?duration=12.2&shiftStartTime=2016-08-24T08%3A00%3A00.000Z')
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                done();
            });
    }

    @test('Should pass devicesDidNotSurviveShift call status 200 - with both parameters provided')
    public assert_pass_getDevicesNotLastedShift_content_dateTime(done: Function ) {

        chai.request(server.app).get('/Devices/Battery/Summary/DevicesNotSurvivedShift?duration=12.2&shiftStartTime=2016-08-24T08%3A00%3A00.000Z')
            .end((err: any, res: any) => {
                expect(res).to.be.json;
                let jsonResponse = res.body;
                let responseText = jsonResponse['data'];
                let expectedJSONString  = '[{"CountDevicesNotLastedShift":"62","TotalActiveDevices":"219"}]';
                expect(JSON.stringify(responseText)).to.equal(expectedJSONString);
                expect(err).to.be.null;
                done();
            });
    }



}
