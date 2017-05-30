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

    //Request.debug = true;

    var accessToken = '';
    var authorizationToken = '';
    var responseCode = 0;
    var responseData = 0;

    // Request Structure
    var options  = {
        "method": "",
        "url": "",
        "rejectUnauthorized": false,
        "headers": {
            "content-type": "application/json",
            "Keep-Alive": true,
            "x-access-token": ""
        },
        "json": true,
        "body": {},
        "preambleCRLF": true,
        "postambleCRLF": true
    };

    //Retrieve permanent access token from file
    Given(/^I set the xaccesskey$/, function (callback) {
        FS.readFile("features/assets/PermanentToken", 'utf8', function(err, contents) {
            if (err) return console.log(err);
            accessToken = contents;
            callback();
        });

    });

    //make get request to IDA with permanent token to retrieve temporary token
    When(/^I Get :(\d+)$/, function (arg1, callback) {
        options.baseUrl = 'https://dev2012r2-sk.sotidev.com:' + arg1;
        options.url = '/Security/getAuthorizationToken';
        options.headers['x-access-token'] = accessToken;


        //send a GET request to arg1 with accessToken as param
        Request.get(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:'+ error);
            }

            responseCode = response.statusCode;
            //var xaccess = obj.session_token;
            responseData = body;
            //console.log(body);
            authorizationToken = body.session_token;
            callback();
        })
    });
    Given('I set the temporary AuthorizationToken', function (callback) {
        FS.readFile("features/assets/AuthorizationToken", 'utf8', function(err, contents) {
            if (err) return console.log(err);
            authorizationToken = contents;
            callback();
        });
    });
    When('I Post :{int} with example data', function (arg1, callback) {
        options.preambleCRLF = options.postabmelCRLF = true;
        options.url = '/data';
        options.headers['x-access-token'] = authorizationToken;
        options.headers['content-type'] = 'application/json';
        options.method = "POST";
        options.body = {
            'metadata': {
                'dataSetId' : 'idaSampleId2',
                'projections': '[]' },
            'data': {
                'sensorId' : '123',
                'sensorValue' : '45648946'}
        };
        Request(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:'+ error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        });
    });

    Then('AuthorizationToken is not empty', function (callback) {
        if (authorizationToken == undefined || authorizationToken == "")
            throw new Error(responseData.error);
        callback();
    });

    Then('response body should be error-free', function (callback) {

        var resString = JSON.stringify(responseData).toLowerCase();
        if (resString.includes('error'))
            throw new Error(resString);
        callback();
    });

    Then('response body should be a valid IDA-POST response', function (callback) {

        var resString = JSON.stringify(responseData).toLowerCase();
         if (resString.includes('error') && !resString.includes('createdat') && !resString.includes('awsresponse'))
            throw new Error(resString);
        callback();
    });

    //store temporary authorization token for data source in file
    Then(/^I store the returned value in file named AuthorizationToken$/, function (callback) {
        //console.log(authorizationToken);
        FS.writeFile("features/assets/AuthorizationToken", authorizationToken, function(err) {
            if(err) {
                throw new Error(err);
            }
            //console.log("The file was saved!");
            callback();
        });
    });

    //check response code
    Then(/^response code must be (.*)$/, function (response, callback) {
        //console.log(JSON.stringify(responseData));
        if (parseInt(response) != parseInt(responseCode))
            throw new Error('Response should be ' + response +' but is ' + responseCode);
        callback();
    });


    Given('I set the AuthorizationToken to PermanentToken', function (callback) {
        authorizationToken = accessToken;
        callback();
    });

    Then('response body should be empty or contain error', function (callback) {
        if (responseData == undefined){
            callback();
        }else{
            var resString = JSON.stringify(responseData).toLowerCase();
            if (!resString.includes('error') && resString != ''){
                throw new Error(resString);
            }
            callback();
        }

    });

    Given('I set the xaccesskey to a modified JWT', function (callback) {
        accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzNywidXNlcm5hbWUiOiJqb2huLmRvZSJ9.EvTdOJSfbffGHLyND3BMDwWE22zUBOCRspPZEHlNEw';
        callback();
    });
});

