'use strict';

var Cucumber = require('cucumber')
    , Request = require('request');

// will work with all https requests will all libraries (i.e. request.js)

Cucumber.defineSupportCode(function(context) {
    const FS = require('fs');
    var Given = context.Given;
    var When = context.When;
    var Then = context.Then;
    var odaPortNumber = 0;
    var responseCode = 0;
    var responseData = '';
    var globalconfig = require(process.cwd()+'\\globalconfig_test.json');
    var accessToken='';
    var url = '';

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

    Given('I grab ODA port number from globalconfig.json', function (callback) {
        //I get ODA's port number from the url in config json file using REGEX
        var oda_url = globalconfig.oda_url;

        if(oda_url == "" || oda_url == undefined)
            throw new Error('Cannot get port: ida url not in global config file');

        var port_str = oda_url.match("[0-9]+")[0];

        if(isNaN(port_str)){
            throw new Error('Cannot get port: invalid global config file');
        }else{
            url = oda_url.substring(0, oda_url.indexOf(odaPortNumber)-1);
            odaPortNumber = parseInt(port_str);
            callback();
        }
    });

    Given(/^I set the xaccesskey for ODA$/, function (callback) {
        FS.readFile("features/assets/PermanentToken", 'utf8', function(err, contents) {
            if (err) return console.log(err);
            accessToken = contents;
            callback();
        });
    });



    Given('I set valid request header and body for POST call to ~/query', function (callback) {
        //prepare header and body for posting to IDA query endpoint
        options.baseUrl = url +":" + odaPortNumber;
        options.headers['content-type'] = 'application/json';
        //set example query in body
        options.body = {
            "dataSetId": "string",
            "from": [
                'vehicleInfo'
            ]
        };
        callback();
    });

    Then('The response message should not include {string}', function (string, callback) {
        // Write code here that turns the phrase above into concrete actions
        var resString = JSON.stringify(responseData).toLowerCase();
        if (resString.includes('query not supported') || !resString.includes('createdat'))
            throw new Error("response message did not includes: " + stringInDoubleQuote);
        callback();
    });

    When('I GET topics', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        resetOptions();
        options.baseUrl = url +":" + odaPortNumber;
        options.headers['content-type'] = 'application/json';
        options.headers['x-access-token'] = accessToken;
        Request.get(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:'+ error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        });
    });

    Given('I set invalid request header and body for POST call to ~/query', function (callback) {
        //prepare header and body for posting to IDA query endpoint
        options.preambleCRLF = options.postambleCRLF = true;
        options.baseUrl = url +":" + odaPortNumber;
        options.headers['content-type'] = 'application/json';
        options.body = {
            "dataSetId": "string",
            "from": [
                'UnicornCollection'
            ]
        };
        callback();
    });

    Given('I make a POST call to query', function (callback) {
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
            throw new Error("error: " + resString);
        callback();
    });

    function resetOptions() {
        options  = {
            "method": "",
            "url": "",
            "rejectUnauthorized": false,
            "headers": {},
            "json": true,
            "body": {},
            "preambleCRLF": true,
            "postambleCRLF": true
        };
    }

});