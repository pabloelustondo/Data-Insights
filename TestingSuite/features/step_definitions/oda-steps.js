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

    // Configure Client
    var options  = {
        url: '',
        'baseUrl': 'https://dev2012r2-sk.sotidev.com:3002',
        'rejectUnauthorized': false,
        'headers' : {
            'Content-Type': 'application/json',
            'Keep-Alive': true
        }
    };

    // Step Definitions
    // Scenario: Initial Charge Levels
    Given(/^I Make a GET Call to ~\/Devices\/Battery\/Summary\/InitialChargeLevels$/, function (callback) {
        options.url = '/Devices/Battery/Summary/InitialChargeLevels?dateFrom=2016-01-01&dateTo=2016-12-31';
        Request(options, function  (error, response, body) {
            console.log("Data: " + body);
            console.log("Response: " + JSON.stringify(response));
            if(response.hasOwnProperty('statusCode') && response.statusCode == 200){
                callback();
            } else {
                console.log("Error: " + body('statusCode'));
            }
        }).on('error', function (error) {
            console.log("Error:" + error);
        });
    });

    Given('I make a GET request to ~/query/topics', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback();
    });

    Given('a POST submission with the following request paramaters {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback();
    });
});