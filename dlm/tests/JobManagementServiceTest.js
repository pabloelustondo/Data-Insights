/**
 * Created by vdave on 3/15/2017.
 */
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
                        'url': 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=32&t=1488819607',
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
