var chai = require('chai')
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;
var IdaCallService = require('../Services/IdaCallService');
var ApiCallService = require ('../Services/ApiCallService');
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