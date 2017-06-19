'use strict';

const Cucumber = require('cucumber');
const Request = require('request');
const RootCas = require('ssl-root-cas/latest').create();
const FS = require('fs');
const jwt = require('jsonwebtoken');
const globalconfig = require(process.cwd()+'\\globalconfig_test.json');
const config = require('..\\..\\ida_config.json');

require('https').globalAgent.options.ca = RootCas;

Cucumber.defineSupportCode(function(context) {
    var Given = context.Given;
    var When = context.When;
    var Then = context.Then;

    //Request.debug = true;

    var xaccessToken = '';
    var authorizationToken = '';
    var responseCode = 0;
    var responseData = 0;
    var idaPortNumber = 0;
    var url = '';
    var agentID = '';
    // Request Structure
    var options  = {
        "method": "",
        "uri": "",
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
    Given(/^I grab '(.*)' url from the config file$/, function (variable, callback) {
        // Write code here that turns the phrase above into concrete actions
        var tmp_url = globalconfig[variable+'_url'];
        if(tmp_url == "" || tmp_url == undefined) throw new Error(variable + ' url not in global config file');
        url = tmp_url
        callback();
    });

    //Retrieve permanent access token from file
    Given(/^I grab the xaccesskey from '(.*)'$/, function (variable, callback) {
        FS.readFile("features/assets/"+variable, 'utf8', function(err, contents) {
            if (err) return console.log(err);
            xaccessToken = contents;
            callback();
        });
    });

    Given('I set up request for making get call to /getDataSources', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        options.headers['x-access-token'] = xaccessToken;
        options['uri'] = url+'/getDataSources';
        options['method'] = 'GET';
        callback();
    });

    Given('response body should contain a temporary token', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        if(responseData['session_token']!=undefined){
            responseData = responseData.session_token;
            callback();
        }else{
            console.error('Response body does not contain temp token');
            return new Error('Response body does not contain temp token');
        }
    });

    Given(/^I set up request for making get call to '(.*)'$/, function (variable, callback) {
        // Write code here that turns the phrase above into concrete actions
        options.headers['x-access-token'] = xaccessToken;
        options['uri'] = url+variable;
        options['method'] = 'GET';
        callback();
    });

    //make get request to IDA with permanent token to retrieve temporary token
    Then('I make a GET call', function (callback) {
        //send a GET request to arg1 with xaccessToken as param
        Request.get(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:'+ error);
            }
            responseCode = response.statusCode;
            responseData = body;
            //console.log(body);
            callback();
        })
    });

    Then('I get the agentID of a data source', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        if(responseData[0] == undefined || responseData[0].agentId == undefined){
            console.log(responseData);
            console.error("data sources undefined");
        }
        agentID = responseData[0].agentId;
        callback();
    });

    Then('I set up request for making get call to get permanent token for the data source', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        options.headers['x-access-token'] = xaccessToken;
        options.uri = url+'/sourceCredentials/'+agentID;
        callback();
    });

    When('I make a POST call', function (callback) {
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
        if (resString.includes('error') || resString.includes('invalid'))
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

    Then(/^I store the response in '(.*)'$/, function (variable, callback) {
        //console.log(authorizationToken);
        FS.writeFile("features/assets/"+variable, responseData, function(err) {
            if(err) {
                throw new Error(err);
            }
            callback();
        });
    });

    //check response code
    Then(/^response code must be (.*)$/, function (response, callback) {
        var resString = JSON.stringify(responseData).toLowerCase();
        if (parseInt(response) != parseInt(responseCode)) {
            //console.log('Error: '+ responseData);
            console.log('Response code should be ' + response +' but is ' + responseCode +'\n '+ resString);
            throw new Error('Response code should be ' + response +' but is ' + responseCode +'\n '+ resString);
        };
        callback();
    });

    Given('I set the AuthorizationToken to invalid token', function (callback) {
        authorizationToken = "iasdlkjaskdjklajsdklajsdkljaskldjaskldjaskldjaskldjlaskdjlaks.asjdhajkdhajksdhjkashdjkahskdjhakjshkjasd.asdhgasdhgashdjasghdhjsgahj";
        callback();
    });

    Then('response body should be empty or contain error', function (callback) {
        if (responseData == undefined || responseData == ""){
            callback();
        }else{
            var resString = JSON.stringify(responseData).toLowerCase();
            if (!resString.includes('error') && resString != '' && !resString.includes('invalid signature')){
                throw new Error("response body should be empty or contain error but is: "+resString);
            }
            callback();
        }
    });

    Given('I modify the xaccesskey to an invalid JWT', function (callback) {
        var tenantId = 'Varun_is_lame';
        var jwtPayload = {
            tenantid: tenantId,
            agentid: '12345678901234567890'
        };
        xaccessToken = jwt.sign(jwtPayload, config['expiring-secret'], {expiresIn: 15});
        callback();
    });

    Given(/^I set up request for making post call to '(.*)'$/, function (variable, callback) {
        // Write code here that turns the phrase above into concrete actions
        options.preambleCRLF = options.postambleCRLF = true;
        options.uri = url+variable;
        options.headers['x-access-token'] = xaccessToken;
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
        callback();
    });

});

