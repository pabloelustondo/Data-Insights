'use strict';

const Cucumber = require('cucumber');
const Request = require('request');
const RootCas = require('ssl-root-cas/latest').create();
const FS = require('fs');

require('ssl-root-cas').inject();

// Certificate Handling
RootCas
    .addFile(__dirname + '/dev2012r2-sk.sotidev.com.cer')
    .addFile(__dirname + '/root.p7b');
require('https').globalAgent.options.ca = RootCas;

Cucumber.defineSupportCode(function(context) {
    var Given = context.Given;
    var When = context.When;
    var Then = context.Then;

    // Testing Values
    var testResponse;
    var testBody;
    var testJWT;
    var newUser;
    Request.debug = false;

    // Request Structure
    var options  = {
        'url': '',
        'rejectUnauthorized': false,
        'headers' : {
            'Content-Type': 'application/json',
            'Keep-Alive': true,
        },
        'form': {
        }
    };

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     Step Definitions
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    Then(/^The HTTP Code should be (.*)$/, function (httpCode, callback) {
        if(httpCode) {
            callback();
        } else {
            console.error('Expected httpCode: ' + httpCode
                + ', but received: ' + testResponse.statusCode);
            console.error('Error Response :' + testBody);
        }
    });

    Then(/^The response should contain '(.*)'$/, function (response, callback) {
        if(testBody === response) {
            callback();
        } else {
            console.error('Expected response: ' + response
                + ', but received: ' + testBody);
        }
    });

    Given(/^I submit using valid values$/, function (callback) {
        resetOptions('/enrollments');

        Request.post(options, function (error, response, body) {
            testBody = body;
            testResponse = response;
            testJWT = response.id_token || '';
            callback();
        }).on('error', function (error) {
            console.log("Error with Request:" + error);
        });
    });

    Given(/^I submit using previously enrolled values$/, function (callback) {
        resetOptions('/enrollments');
        resetFormOldValues();

        Request.post(options, function (error, response, body) {
            testBody = body;
            testResponse = response;
            callback();
        }).on('error', function (error) {
            console.log("Error with Request:" + error);
        });
    });

    Given(/^I submit with missing (.*)$/, function (variable, callback) {
        resetOptions('/enrollments');
        options.form[variable] = '';

        Request.post(options, function (error, response, body) {
            testBody = body;
            testResponse = response;

            callback();
        }).on('error', function (error) {
            console.log("Error with Request:" + error);
        });
    });

    Given(/^I submit with invalid (.*) value: (.*)$/, function (variable, value, callback) {
        resetOptions('/enrollments');
        options.form[variable.toLowerCase()] = value;

        Request.post(options, function (error, response, body) {
            testBody = body;
            testResponse = response;

            callback();
        }).on('error', function (error) {
            console.log("Error with Request:" + error);
        });
    });

    Given(/^I do a '(.*)' request with valid values$/, function(httpCall, callback){
        resetFormValid('/enrollments');

        //options.baseUrl = 'https://dev2012r2-sk.sotidev.com:3003/#/';

        Request[httpCall.toLowerCase()](options, function (error, response, body) {
            testBody = body;
            testResponse = response;
            testJWT = JSON.stringify(testBody) || '';

            callback();
        }).on('error', function (error) {
            console.log("Error with Request:" + error);
        });
    });

    Then(/^The response should be a HTML Document -> (.*)$/, function (fileName, callback) {
        FS.readFile(fileName, 'utf8', function(error, contents) {
            if (error) {
                console.log( error);
                return;
            }

            //Remove Whitespace issues while comparing
            if (contents.toString().replace(/\s/g, "") === testBody.toString().replace(/\s/g, "")) {
                callback();
            }
        })
    });

    Then(/^The response\'s id_token should be valid$/, function (callback) {
        if(testJWT.includes("id_token")) {
            callback();
        } else {
            console.error('Token was not found in response: ' + JSON.stringify(testBody));
        }
    });

    Given(/^I do a '(.*)' request with valid login values$/, function (httpCall, callback) {
        resetFormValid('/login');
        options.form = {
            'domainid': newUser
        };

        Request[httpCall.toLowerCase()](options, function (error, response, body) {
            testBody = body;
            testResponse = response;

            callback();
        }).on('error', function (error) {
            console.log("Error with Request:" + error);
        });
    });

    Given(/^I do a '(.*)' request with no login values$/, function (httpCall, callback) {
        resetFormValid('/login');
        options.form = {
            'domainid': ''
        };
        Request[httpCall.toLowerCase()](options, function (error, response, body) {
            testBody = body;
            testResponse = response;

            callback();
        }).on('error', function (error) {
            console.log("Error with Request:" + error);
        });
    });
    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     UTILITIES
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function resetFormValid() {
        //Fake Characters
        newUser = "";
        var wordChoice = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';

        // Create New User
        for(var i = 0; i < 13; i++) {
            newUser += wordChoice[Math.floor(Math.random() * (i + 31)) % 72];
        }
        newUser = newUser.replace('undefined', '').replace(/\s/, '');
        newUser = 'bdd_user_' + newUser;

        options.form = {
            accountid: 'ray.gervais@rgervais.net',
            apikey: '244cc44394ba4efd8fe38297ee8213d3',
            clientsecret: '1',
            domainid: newUser,
            mcurl: 'https://cad099.corp.soti.net/MobiControl',
            password: '1',
            username: 'administrator'
        };
    }

    function resetFormOldValues() {
        options.form = {
            accountid: 'external_user',
            apikey: '244cc44394ba4efd8fe38297ee8213d3',
            clientsecret: '1',
            domainid: 'bdd_old_account',
            mcurl: 'https://cad099.corp.soti.net/MobiControl',
            password: '1',
            username: 'administrator',
            tenantid: 'bdd_old_account'
        };
    }

    function resetOptions(url) {
        options  = {
            'url': url,
            'baseUrl': 'https://10.0.91.25:3004/',
            'rejectUnauthorized': false,
            'headers' : {
                'Content-Type': 'application/json',
                'Keep-Alive': true,
                'Accept-Encoding': 'gzip,deflate'
            }
        };
        resetFormValid();
    }
});