'use strict';

const Cucumber = require('cucumber');
const Request = require('request');
const RootCas = require('ssl-root-cas/latest').create();
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
    var responseCode = 0;
    var responseData = '';
    var invalidToken = 'invalidtokenasdasdasdas';
    var validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluaXN0cmF0b3IiLCJkb21haW5pZCI6ImV4dGVybmfsX3VzZXIiLCJ0ZW5hbnRJZCI6ImV4dGVybmfsX3VzZXIiLCJpYXQiOjE0OTUyMDUyMDAsImV4cCI6MTUwMTIwNTIwMH0.Fyu2Oklpme9GKaUR_nQEou48r13amYaxGkuDz4ofHyg';
    var oldauthorizationToken = '';
    var mobiUrl = "https://cad099.corpss.soti.net/";
    var downAgentId = "b5b4fc4c-2973-4848-97fe-7d4eabb95010";
    var delAgentId1 = "42734935-57d8-4a1d-a2d4-0fd3e98bf4b3";
    var delAgentId2 = "6f3702e2-b3a5-4b09-8d5d-af7928da15dc";
    var devServer = 'https://dev2012r2-sk.sotidev.com:';
    var options  = {
        'url': '',
        'baseUrl': 'https://dev2012r2-sk.sotidev.com:',
        'rejectUnauthorized': false,
        'headers': {
            'Content-Type': 'application/json',
            'Keep-Alive': true,
            'x-access-token': ''
        },
        'form': {   },
        'body': {   },
        'preambleCRLF': '',
        'postambleCRLF': ''
    };

    Given('I set invalid header and body for external_user', function (callback) {
        options.headers["x-access-token"] = invalidToken;
        options.body = {
            'tenantid': "external_user",
            'dataSourceType': "MobiControl",
            'agentid': "asdas",
            'data': {
                'inputName': "mcurl",
                'inputValue': mobiUrl
            }
        };
        callback();
    });

    Given('I set valid header and body for external_user', function (callback) {
        options.headers['x-access-token'] = invalidToken;
        options.body = {
            'tenantid': "external_user",
            'dataSourceType': "MobiControl",
            'agentid': "asdas",
            'data': {
                'inputName': "mcurl",
                'inputValue': mobiUrl
            }
        };
        callback();
    });

    When('I POST :{int} with endpoint {stringInDoubleQuotes}', function (int, stringInDoubleQuotes, callback) {
        options.baseUrl = devServer + int;
        options.url = stringInDoubleQuotes;
        Request.post(options, function (error, response, body) {
            if (error) {
                return console.error('upload failed:', error);
            }
            if(parseInt(response.statusCode) != 204) {
                responseData = body;
                responseCode = response.statusCode;
                callback();
            }
        });
    });

    Then('response message should {stringInDoubleQuotes} {stringInDoubleQuotes}', function (stringInDoubleQuotes, stringInDoubleQuotes2, callback) {
        if(stringInDoubleQuotes == "not be"){
            if (responseData == stringInDoubleQuotes2)
                throw new Error("response message is: "+ responseData);
        }else if(stringInDoubleQuotes == "be"){
            if (responseData != stringInDoubleQuotes2)
                throw new Error("response message is: "+ responseData);
        }
        callback();
    });

    Given('I set invalid header and body for external_user for delete', function (callback) {
        options.headers['x-access-token'] = invalidToken;
        options.body['agentid'] = delAgentId1;
        callback();
    });

    Given('I set valid header and body for external_user for delete', function (callback) {
        options.headers['x-access-token'] = validToken;
        options.body['agentid'] = delAgentId2;
        callback();
    });

    When('I GET :{int} with endpoint {stringInDoubleQuotes} to download credentials', function (int, stringInDoubleQuotes, callback) {
        options.baseUrl = devServer + int;
        options.url = stringInDoubleQuotes + '/' + downAgentId;
        options.preambleCRLF = options.postambleCRLF = true;
        Request.get(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:', error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        });
    });

    Given('I set head and body for handling credentials', function (callback){
        options.headers['x-access-token'] = validToken;
        options.body['agentid'] = delAgentId1;
        callback();
    });

    Then('I GET :{int} with old credentials and endpoint {stringInDoubleQuotes}', function (int, stringInDoubleQuotes, callback) {
        options.preambleCRLF = options.postambleCRLF = true;
        options.url = stringInDoubleQuotes;
        options.headers['x-access-token'] = oldauthorizationToken;

        Request.get(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:', error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        })
    });

    Then('I POST :{int} with endpoint {stringInDoubleQuotes} to reset credentials', function (int, stringInDoubleQuotes, callback) {
        options.preambleCRLF = options.postambleCRLF = true;
        options.url = stringInDoubleQuotes + '/' + downAgentId;
        options.headers['x-access-token'] = oldauthorizationToken;

        Request.post(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:', error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        });
    });

    Then('response body contain some sort of error', function (callback) {
        if(responseData['error'] || responseData['metaData'] == "Error") {
            console.log(jsonObj.metadata);
            throw new Error("This shouldn't pass what the hell");
        }
        callback();
    });

    Then('response code should be {int}', function (int, callback) {
        if(responseCode != int) {
            throw new Error('Response should be :' + int + ', Got:' + responseCode);
        }
        callback();
    });
});