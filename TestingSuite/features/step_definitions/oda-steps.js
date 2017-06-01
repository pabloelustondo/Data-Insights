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

    Given('grab ODA port number', function (callback) {
        // Write code here that turns the phrase above into concrete actions

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

    Given('I set request header and body to query {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        // Write code here that turns the phrase above into concrete actions
        options.preambleCRLF = options.postambleCRLF = true;
        options.baseUrl = 'https://dev2012r2-sk.sotidev.com:' + portNumber;
        options.url = '/query';
        options.headers['content-type'] = 'application/json';
        options.body = {
            "dataSetId": "string",
            "from": [
                stringInDoubleQuotes
            ]
        };
        callback();
    });

    Given('I make a POST call to ~/query', function (callback) {
        // Write code here that turns the phrase above into concrete actions
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

    Then('The response message should not include {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        // Write code here that turns the phrase above into concrete actions
        var resString = JSON.stringify(responseData).toLowerCase();
        if (resString.includes(stringInDoubleQuote))
            throw new Error("response message includes: " + stringInDoubleQuote);
        callback();
    });

    Then('The response message should include {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        // Write code here that turns the phrase above into concrete actions
        var resString = JSON.stringify(responseData).toLowerCase();
        if (!resString.includes(stringInDoubleQuote))
            throw new Error("response message did not includes: " + stringInDoubleQuote);
        callback();
    });




});