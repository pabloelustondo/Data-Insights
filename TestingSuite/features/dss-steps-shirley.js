'use strict';

const Cucumber = require('cucumber');
const Request = require('request');

Cucumber.defineSupportCode(function(context) {
    var Given = context.Given;
    var When = context.When;
    var Then = context.Then;
    var responseCode = 0;
    var responseData = '';
    var invalidToken = 'invalidtokenasdasdasdas';
    var validToken = '';
    var oldauthorizationToken = '';
    //some necessary evil for things that cannot be retrieved from API
    var mobiUrl = "https://cad099.corpss.soti.net/";
    var downAgentId = "b5b4fc4c-2973-4848-97fe-7d4eabb95010";
    var delAgentId1 = "42734935-57d8-4a1d-a2d4-0fd3e98bf4b3";
    var delAgentId2 = "6f3702e2-b3a5-4b09-8d5d-af7928da15dc";
    //-------------------------------------------------------------
    var url = '';
    var portnumber = 0;
    var idaportnumber = 0;
    var globalconfig = require(process.cwd()+'\\globalconfig_test.json');
    var options2  = {
        'url': '',
        'baseUrl': '',
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
        options2.headers["x-access-token"] = invalidToken;
        options2.body = {
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

    Given("grab IDA's port number", function (callback) {
        // Write code here that turns the phrase above into concrete actions
        var ida_url = appconfig.ida_url;
        if(ida_url == "" || ida_url == undefined) throw new Error('Cannot get port: ida url not in global config file');
        var port_str = ida_url.match("[0-9]+")[0];
        if(isNaN(port_str)){
            throw new Error('Cannot get port: invalid global config file');
        }else{
            url = ida_url.substring(0,ida_url.indexOf(idaportnumber)-1);
            console.log(url);
            idaportnumber = parseInt(port_str);
            callback();
        }
    });
    Given('grab DSS port number and url', function (callback) {
        // Write code here that turns the phrase above into concrete actions0
        var dss_url = globalconfig.dss_url;
        if(dss_url == "" || dss_url == undefined) throw new Error('Cannot get port: ida url not in global config file');
        var port_str = dss_url.match("[0-9]+")[0];
        if(isNaN(port_str)){
            throw new Error('Cannot get port: invalid global config file');
        }else{
            portnumber = parseInt(port_str);
            callback();
        }
    });


    Given('I set valid header and body for external_user', function (callback) {
        options2.headers['x-access-token'] = invalidToken;
        options2.body = {
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

    When('I POST :portnumber with endpoint {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        options2.baseUrl = url + ':' + portnumber;
        options2.url = stringInDoubleQuotes;
        Request.post(options2, function (error, response, body) {
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
        options2.headers['x-access-token'] = invalidToken;
        options2.body['agentid'] = delAgentId1;
        callback();
    });

    Given('I set valid header and body for external_user for delete', function (callback) {
        FS.readFile("features/assets/PermanentToken", 'utf8', function(err, contents) {
            if (err) return console.log(err);
            validToken = contents;
            callback();
        });
        options2.headers['x-access-token'] = validToken;
        options2.body['agentid'] = delAgentId2;
        callback();
    });

    When('I GET :portnumber with endpoint {stringInDoubleQuotes} to download credentials', function (stringInDoubleQuotes, callback) {
        options2.baseUrl = url + ':' + portnumber;
        options2.url = stringInDoubleQuotes + '/' + downAgentId;
        options2.preambleCRLF = options2.postambleCRLF = true;
        Request.get(options2, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:', error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        });
    });

    Given('I set head and body for handling credentials', function (callback){
        options2.headers['x-access-token'] = validToken;
        options2.body['agentid'] = delAgentId1;
        callback();
    });

    Then('I GET :idaportnumber with old credentials and endpoint {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        options2.preambleCRLF = options2.postambleCRLF = true;
        options2.url = stringInDoubleQuotes;
        options2.headers['x-access-token'] = oldauthorizationToken;
        options2.baseUrl = url + ':' + portnumber;
        Request.get(options2, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:', error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        })
    });

    Then('I POST :portnumber with endpoint {stringInDoubleQuotes} to reset credentials', function (int, stringInDoubleQuotes, callback) {
        options2.preambleCRLF = options2.postambleCRLF = true;
        options2.url = stringInDoubleQuotes + '/' + downAgentId;
        options2.headers['x-access-token'] = oldauthorizationToken;
        options2.baseUrl = url + ':' + portnumber;
        Request.post(options2, function (error, response, body) {
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