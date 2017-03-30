var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var IdaCallService = require('../Services/IdaCallService');
var ApiCallService = require ('../Services/ApiCallService');
var JobManagementService = require('../Services/JobManagementService');
var ManageApiConfigurations = require('../Services/ManageApiConfigurations');
var agenda = require ('../Services/Agenda');
var ManageAgendaConfigurations = require ('../Services/ManageAgendaService');

var config = require('../appconfig.json');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

describe("Test external API service calls", function() {

    describe("Call API with valid data", function() {

        before( function (done) {
                var config1 = {
                    dataSourceId : 'varun dave test data source',
                    tenantId : 'external_test_user',
                    apiUrl : 'varun',
                    interval : 5,
                    permToken : '',
                    expiringToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6ImV4dGVybmFsX3Rlc3RfdXNlciIsImFnZW50aWQiOiJ2YXJ1biB0ZXN0IGRhdGEwLjA1OTc1MDc1MzMyNzQ4NTkyIiwiaWF0IjoxNDg5MTU4MjIwLCJleHAiOjE0ODkxNTk3MjB9.KBh9xzRHG2BpYQUYwcSb2Haxrag4hu8YXuVoSNf9D1U'
                };
                ManageApiConfigurations.addApiConfig(config1, function (){

                    ManageApiConfigurations.printConfigs();
                    done();
                });

            });
        it('calls Api Call service to Nextbus API', function (done){

            var req = {
                attrs : {
                    data: {
                        'url': 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
                        'method': 'GET',
                        'dataSourceId': 'varun dave test data source',
                        'interval': 1,
                        'tenantId': 'varun_dlm_test_2',
                        'expiringToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6ImV4dGVybmFsX3Rlc3RfdXNlciIsImFnZW50aWQiOiJ2YXJ1biB0ZXN0IGRhdGEwLjA1OTc1MDc1MzMyNzQ4NTkyIiwiaWF0IjoxNDg5MTU4MjIwLCJleHAiOjE0ODkxNTk3MjB9.KBh9xzRHG2BpYQUYwcSb2Haxrag4hu8YXuVoSNf9D1U'
                    }
                }
            };
           /* var req = {
                url:  'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
                method: 'GET'
            };*/
           ApiCallService.send(req, function(err, result) {
               expect(result).to.not.be.undefined;
               expect(result).to.have.property('createdAt');
               expect(result).to.have.property('metadata');
               expect(result).to.have.property('data');
               done();
            });
        })
    });

    describe("Call API with invalid api call", function() {
        it('calls Api Call service to Nextbus API', function (done){
            // there is a typo in the command filed. (There is an extra 's' in services)
            var req = {
                attrs : {
                    data: {
                        'url': 'http://webservices.nextbus.com/services/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
                        'method': 'GET',
                        'dataSourceId': 'varun dave test data source',
                        'interval': 1,
                        'tenantId': 'varun_dlm_test_2',
                        'expiringToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6ImV4dGVybmFsX3Rlc3RfdXNlciIsImFnZW50aWQiOiJ2YXJ1biB0ZXN0IGRhdGEwLjA1OTc1MDc1MzMyNzQ4NTkyIiwiaWF0IjoxNDg5MTU4MjIwLCJleHAiOjE0ODkxNTk3MjB9.KBh9xzRHG2BpYQUYwcSb2Haxrag4hu8YXuVoSNf9D1U'
                    }
                }
            };
            ApiCallService.send(req, function(err, result) {
                expect(result).to.not.be.undefined;
                expect(result).to.not.have.property('createdAt');
                expect(result).to.not.have.property('metadata');
                expect(result).to.not.have.property('data');
                done();
            });
        })
    });
});

describe("Test IDA API service calls", function() {

    describe("ensure ida is up", function () {

        var jwtToken3 = '';
        before( function (done) {
            var config1 = {
                dataSourceId : 'varun dave test data source',
                tenantId : 'external_test_user',
                apiUrl : 'varun',
                interval : 5,
                permToken : '',
                expiringToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6ImV4dGVybmFsX3Rlc3RfdXNlciIsImFnZW50aWQiOiJ2YXJ1biB0ZXN0IGRhdGEwLjA1OTc1MDc1MzMyNzQ4NTkyIiwiaWF0IjoxNDg5MTU4MjIwLCJleHAiOjE0ODkxNTk3MjB9.KBh9xzRHG2BpYQUYwcSb2Haxrag4hu8YXuVoSNf9D1U'
            };
            ManageApiConfigurations.addApiConfig(config1, function (){

                ManageApiConfigurations.getToken(config1.dataSourceId, function (err, result) {
                   jwtToken3 = result.expiringToken;
                });
                done();
            });

        });
        it('calls Api Call service to Nextbus API', function (done) {
            var testData ={
                body : {
                'testObj': 'testValue'
                },
                'expiringToken': jwtToken3

            };
            IdaCallService.makeIdaCall(testData, function (err, result) {
                expect(result).to.not.be.undefined;
                expect(result).to.have.property('createdAt');
                expect(result).to.have.property('metadata');
                expect(result).to.have.property('data');
                done();
            });
        });
    });

    describe("Call IDA API with SampleNextbus Data", function() {
        var jwtToekn2 = '';
        before( function (done) {
            var config1 = {
                dataSourceId : 'varun dave test data source',
                tenantId : 'external_test_user',
                apiUrl : 'varun',
                interval : 5,
                permToken : '',
                expiringToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6ImV4dGVybmFsX3Rlc3RfdXNlciIsImFnZW50aWQiOiJ2YXJ1biB0ZXN0IGRhdGEwLjA1OTc1MDc1MzMyNzQ4NTkyIiwiaWF0IjoxNDg5MTU4MjIwLCJleHAiOjE0ODkxNTk3MjB9.KBh9xzRHG2BpYQUYwcSb2Haxrag4hu8YXuVoSNf9D1U'
            };
            ManageApiConfigurations.addApiConfig(config1, function (){

                ManageApiConfigurations.getToken(config1.dataSourceId, function (err, result) {
                    jwtToekn2 = result.expiringToken;
                });
                done();
            });

        });
        it('calls Api Call service to Nextbus API Data', function (done){
            var testData = {
                'expiringToken' : jwtToekn2,
                body : {
                    'vehicle': [
                        {
                            'id': '9128',
                            'lon': '-79.451569',
                            'routeTag': '36',
                            'predictable': 'true',
                            'dirTag': '36_1_36A',
                            'heading': '254',
                            'lat': '43.772282',
                            'secsSinceReport': '8'
                        },
                        {
                            'id': '9102',
                            'lon': '-79.4153819',
                            'routeTag': '36',
                            'predictable': 'true',
                            'dirTag': '36_0_36A',
                            'heading': '355',
                            'lat': '43.781567',
                            'secsSinceReport': '6'
                        }
                    ]
                }
            };
            IdaCallService.makeIdaCall(testData, function(err, result) {
                expect(result).to.not.be.undefined;
                expect(result).to.have.property('createdAt');
                expect(result).to.have.property('metadata');
                expect(result).to.have.property('data');
                done();
            });
        });
    });

});

describe("Test job scheduler", function () {
    describe("Delete all existing jobs for a current data source", function () {

        it('calls delete jobs in Job Management Service', function (done) {
           var dataSourceId = 'varun dave test data source';
           JobManagementService.deleteJobsByDataSource(dataSourceId, function (err, result) {
               expect(err).to.be.null;

               expect(result).to.not.be.undefined;
               expect(result).to.be.number;
               done();
           });
        });
        it('calls find jobs in Job Management Service', function (done) {
            var dataSourceId = 'varun dave test data source';

            JobManagementService.findJobByDataSource(dataSourceId, function (err, result) {

                expect(err).to.be.null;
                expect(result).to.be.null;
                done();
            });
        });
    });

    describe("Add a new job to schedule for data source", function () {

        before( function (done) {
            var testJob = {
                'url': 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
                'method': 'GET',
                'dataSourceId': 'varun dave test data source',
                'interval': 60,
                'tenantId': 'varun_dlm_test_2',
                'expiringToken' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6ImV4dGVybmFsX3Rlc3RfdXNlciIsImFnZW50aWQiOiJ2YXJ1biB0ZXN0IGRhdGEwLjA1OTc1MDc1MzMyNzQ4NTkyIiwiaWF0IjoxNDg5MTU4MjIwLCJleHAiOjE0ODkxNTk3MjB9.KBh9xzRHG2BpYQUYwcSb2Haxrag4hu8YXuVoSNf9D1U'
            };
            JobManagementService.addJob(testJob, function (err) {
                expect(err).to.be.null;
                done();
            });
        });
        it('finds the added job in the database', function (done) {

            var dataSourceId = 'varun dave test data source';
            JobManagementService.findJobByDataSource(dataSourceId, function (err, result) {


                expect(err).to.be.null;

                expect(result).to.not.be.undefined;
                expect(result).to.be.number;
                expect(result.length).to.equal(1);
                expect(result[0].attrs.name).to.equal(config['api_service_job_name']);
                expect(result[0].attrs.data.url).to.equal('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607');
                done();
            });
        });

    });




});