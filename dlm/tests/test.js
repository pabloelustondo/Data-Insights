var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var IdaCallService = require('../Services/IdaCallService');
var ApiCallService = require ('../Services/ApiCallService');
var JobManagementService = require('../Services/JobManagementService');
var config = require('../appconfig.json');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

describe("Test external API service calls", function() {
    describe("Call API with valid data", function() {
        it('calls Api Call service to Nextbus API', function (done){
            var req = {
                url:  'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
                method: 'GET'
            };
           ApiCallService.send(req, function(result) {
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
                url:  'http://webservices.nextbus.com/services/publicJSONFeed?commmand=vehicleLocations&a=ttc&r=32&t=1488819607',
                method: 'GET'
            };
            ApiCallService.send(req, function(result) {
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
        it('calls Api Call service to Nextbus API', function (done) {
            var testData = {
                'testObj': 'testValue'
            };
            IdaCallService.makeIdaCall(testData, function (result) {
                expect(result).to.not.be.undefined;
                expect(result).to.have.property('createdAt');
                expect(result).to.have.property('metadata');
                expect(result).to.have.property('data');
                done();
            });
        });
    });

    describe("Call IDA API with SampleNextbus Data", function() {
        it('calls Api Call service to Nextbus API Data', function (done){
            var testData = {
                'vehicle' : [
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
            };
            IdaCallService.makeIdaCall(testData, function(result) {
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

                expect(result).to.not.be.undefined;
                expect(result).to.be.number;
                expect(result.length).to.equal(0);
                done();
            });
        });
    });

    describe("Add a new job to schedule for data source", function () {
        it('calls add job to the database', function (done) {
            var testJob = {
                'url': 'testValue',
                'method': 'GET',
                'dataSourceId': 'varun dave test data source',
                'interval': 60
            };
            JobManagementService.addJob(testJob, function (err) {
                expect(err).to.not.null;

                done();
            });
        });
        it('finds the added job in the database', function (done) {

            var dataSourceId = 'varun dave test data source';
            JobManagementService.findJobByDataSource(dataSourceId, function (err, result) {

                var job = result[0];
              //  console.log(job.attrs.name);
                expect(err).to.be.null;

                expect(result).to.not.be.undefined;
                expect(result).to.be.number;
                expect(result.length).to.equal(1);
                expect(result[0].attrs.name).to.equal(config['api_service_job_name']);
                expect(result[0].attrs.data.url).to.equal('testValue');
                done();
            });
        });

    });

    describe ("Verify the added job is running", function () {
        it('verifies we can set up a spy to test other cases', function (done) {

            //create spy to see if API call management service is called
            var req = {
                'hi' : 'hello'
            };
            var spy = chai.spy(ApiCallService.log(req, function () {}));
            expect(spy).to.be.spy;
            spy.should.be.spy;
            done();

        });

        it('ensure the Api call manamgenet is called after setting a task that should be called in 3 seconds ', function (done) {

            //create spy to see if API call management service is called
            var req = {
                'hi' : 'hello'
            };
            var spy = chai.spy(ApiCallService.log(req, function () {}));
            expect(spy).to.be.spy;
            spy.should.be.spy;
            done();

            var testJob = {
                'url': 'testValue2',
                'method': 'GET',
                'dataSourceId': 'varun dave test data source',
                'interval': 1
            };
            JobManagementService.addJob(testJob, function (err) {
                expect(err).to.not.null;

                expect(spy).to.have.been.called();
                spy.should.have.been.called();
                done();
            });


        });

    });


});