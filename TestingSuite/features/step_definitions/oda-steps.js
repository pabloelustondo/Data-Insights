'use strict';

var Cucumber = require('cucumber')
    , Request = require('request');
var RootCas = require('ssl-root-cas/latest').create();
require('ssl-root-cas').inject();

RootCas
    .addFile(__dirname + '/dev2012r2-sk.sotidev.com.cer')
    .addFile(__dirname + '/root.p7b');

// will work with all https requests will all libraries (i.e. request.js)
require('https').globalAgent.options.ca = RootCas;

Cucumber.defineSupportCode(function(context) {
    var setWorldConstructor = context.setWorldConstructor;
    var Given = context.Given;
    var When = context.When;
    var Then = context.Then;
    var portNumber = 0;
    var responseCode = 0;
    var responseData = '';
    var appconfig = require(process.cwd()+'/../globalconfig.json');
    // Configure Client
    var options  = {
        "method": "",
        "url": "",
        "rejectUnauthorized": false,
        "headers": {},
        "json": true,
        "body": {},
        "preambleCRLF": true,
        "postambleCRLF": true
    };

    // Step Definitions
    // Scenario: Initial Charge Levels

    Given('grab ODA port number from globalconfig.json', function (callback) {
        //I get ODA's port number from the url in config json file using REGEX
        var oda_url = appconfig.oda_url;
        if(oda_url == "" || oda_url == undefined) throw new Error('Cannot get port: ida url not in global config file');
        var port_str = oda_url.match("[0-9]+")[0];
        if(isNaN(port_str)){
            throw new Error('Cannot get port: invalid global config file');
        }else{
            portNumber = parseInt(port_str);
            callback();
        }
    });

    Given('I set valid request header and body for POST call to ~/query', function (stringInDoubleQuotes, callback) {
        //prepare header and body for posting to IDA query endpoint
        options.preambleCRLF = options.postambleCRLF = true;
        options.baseUrl = 'https://dev2012r2-sk.sotidev.com:' + portNumber;
        options.headers['content-type'] = 'application/json';
        options.body = {
            "dataSetId": "string",
            "from": [
                'vehicleInfo'
            ]
        };
        callback();
    });

    Given('I set invalid request header and body for POST call to ~/query', function (stringInDoubleQuotes, callback) {
        //prepare header and body for posting to IDA query endpoint
        options.preambleCRLF = options.postambleCRLF = true;
        options.baseUrl = 'https://dev2012r2-sk.sotidev.com:' + portNumber;
        options.headers['content-type'] = 'application/json';
        options.body = {
            "dataSetId": "string",
            "from": [
                'UnicornCollection'
            ]
        };
        callback();
    });

    Given('I make a POST call to ~/query', function (callback) {
        //I post to query and record the response
        options.url = '/query';
        Request.post(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:'+ error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        });
    });

    Then('response code is :{int}', function (int, callback) {
        // Write code here that turns the phrase above into concrete actions
        if (parseInt(int) != parseInt(responseCode))
            throw new Error('Response should be ' + response +' but is ' + responseCode);
        callback();
    });

    Given('I make a GET request to ~/query/topics', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback();
    });

    Then('The response message should contain error', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        var resString = JSON.stringify(responseData).toLowerCase();
        if (!resString.includes('query not supported'))
            throw new Error("response message: " + stringInDoubleQuote);
        callback();
    });

    Then('The response message should contain the merged dataset', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        var resString = JSON.stringify(responseData).toLowerCase();
        if (resString.includes('query not supported') || !resString.includes('createdat'))
            throw new Error("response message did not includes: " + stringInDoubleQuote);
        callback();
    });


});