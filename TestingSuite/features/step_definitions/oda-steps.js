'use strict';

var Cucumber = require('cucumber')
    , Request = require('request');
var reporter = require('cucumber-html-reporter');

Cucumber.defineSupportCode(function(context) {
    const FS = require('fs');
    var Given = context.Given;
    var When = context.When;
    var Then = context.Then;
    var odaPortNumber = 0;
    var responseCode = 0;
    var responseData = '';
    const globalconfig = require(process.cwd()+'\\globalconfig_test.json');
    var accessToken='';
    var url = '';

    // Configure options
    var options  = {
        "method": "",
        "uri": "",
        "rejectUnauthorized": false,
        "headers": {
            "content-type": "application/json",
            "Keep-Alive": true
        },
        "json": true,
        "body": {},
        "preambleCRLF": true,
        "postambleCRLF": true
    };

    Given('I grab ODA url from globalconfig.json', function (callback) {
        //I get ODA's port number from the url in config json file using REGEX
        var oda_url = globalconfig.oda_url;
        if(oda_url == "" || oda_url == undefined)
            throw new Error('Cannot get port: oda url not in global config file');
        url = oda_url;
        callback();
    });

    //retrieve x-access-token from file. this will be replaced later
    Given(/^I set the xaccesskey for ODA$/, function (callback) {
        FS.readFile("features/assets/PermanentToken", 'utf8', function(err, contents) {
            if (err) throw new Error(err);
            accessToken = contents;
            callback();
        });
    });

    Given('I set valid request header and body for POST call to ~/query with metadata id', function (callback) {
        //prepare header and body for posting to IDA query endpoint
        //set example query in body
        options.body =  {
            "dataSetId": "string",
            "from": ["vehicleInfo"]
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

        resetOptions();
        options.method = "GET";
        options.uri = url+'/query/topics?tenantId=test_user';
        options.headers['x-access-token'] = accessToken;
        Request(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:'+ error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        });
    });

    Given('I set invalid request for POST call to ~/query', function (table, callback) {
        // Write code here that turns the phrase above into concrete actions
        //set example query in body
        options.headers['x-access-token'] = accessToken;
        var tableJson = table.hashes()[0];
        options.body =  {
            "dataSetId": tableJson.dataSetId,
            "from": [tableJson.from]
        };
        callback();
    });

    Given('I make a POST call to ~/query', function (callback) {
        //I post to query and record the response
        options.uri = url+'/Query';
        options.method = 'POST'
        options.headers['x-access-token'] = accessToken;
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
        var resString = JSON.stringify(responseData).toLowerCase();
        //console.log(options);
        if (parseInt(int) != parseInt(responseCode)){
            //console.error('Error: '+ responseData);
            throw new Error('Response code should be ' + int +' but is ' + responseCode +'\n'+ resString);
        }

        callback();
    });
    Given(/^I grab the xaccesskey for ODA from '(.*)'$/, function (variable, callback) {
        FS.readFile("features/assets/"+variable, 'utf8', function(err, contents) {
            if (err) return console.log(err);
            accessToken = contents;
            console.log(accessToken)
            callback();
        });
    });
    Then('The response message should contain error', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        var resString = JSON.stringify(responseData).toLowerCase();
        if (!resString.includes('invalid'))
            throw new Error("response message: " + resString);
        callback();
    });

    Then('The response message should contain the merged dataset', function (callback) {
        var resString = JSON.stringify(responseData).toLowerCase();
        if (resString.includes('query not supported') || !resString.includes('createdat') || !resString.includes('metadata'))
            throw new Error("error: " + resString);
        callback();
    });
    Then('the response doesnt have to be merged', function (callback) {
        if (responseData == undefined)
            throw new Error("error: response body is" + responseData );
        callback();
    });
    Given('I generate report for {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        // Write code here that turns the phrase above into concrete actions
        var options = {
            theme: 'bootstrap',
            jsonFile: 'test\\report\\cucumber_report_'+stringInDoubleQuotes+'.json',
            output: 'test\\report\\cucumber_report_'+stringInDoubleQuotes+'.html',
            reportSuiteAsScenarios: true,
            launchReport: true,
            metadata: {
                "App Version":"0.3.2",
                "Test Environment": "STAGING",
                "Browser": "Chrome  54.0.2840.98",
                "Platform": "Windows 10",
                "Parallel": "Scenarios",
                "Executed": "Remote"
            }
        };
        reporter.generate(options);
        callback();
    });

    Given('I set valid request for posting to ~/query', function (table, callback) {
        // Write code here that turns the phrase above into concrete actions
        //set example query in body
        options.headers['x-access-token'] = accessToken;
        var tableJson = table.hashes()[0];
        options.body =  {
            "dataSetId": tableJson.dataSetId,
            "from": [tableJson.from]
        };
        callback();
    });

    function resetOptions() {
        options  = {
            "method": "",
            "uri": "",
            "rejectUnauthorized": false,
            "headers": {
                "content-type": "application/json",
                "Keep-Alive": true
            },
            "json": true,
            "body": {},
            "preambleCRLF": true,
            "postambleCRLF": true
        };
    }
});