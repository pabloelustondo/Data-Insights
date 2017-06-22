/**
 * Created by sxia on 6/8/2017.
 */
"use strict";

var Cucumber = require("cucumber")
    , Request = require("request");

// will work with all https requests will all libraries (i.e. request.js)

Cucumber.defineSupportCode(function(context) {
    const FS = require("fs");
    var Given = context.Given;
    var When = context.When;
    var Then = context.Then;
    var tenant_data = {};
    var responseCode = 0;
    var responseData = "";
    const globalconfig = require(process.cwd() + "\\globalconfig_test.json");
    var tenantId = '';
    var url = "";

    // Configure Client
    var options = {
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

    Given("I grab tmm backend url from the config file", function (callback) {
        // Write code here that turns the phrase above into concrete actions
        var tmm_url = globalconfig.tmmback_url;
        if(tmm_url == "" || tmm_url == undefined) throw new Error("Cannot get port: tmmback_url not in global config file");
        var port_str = tmm_url.match("[0-9]+")[0];
        if(isNaN(port_str)){
            throw new Error("Cannot get port: invalid global config file");
        }else{
            url = tmm_url;
            callback();
        }
    });

    Given("I grab tmm frontend url from the config file", function (callback) {
        // Write code here that turns the phrase above into concrete actions
        var tmm_url = globalconfig.tmm_url;
        if(tmm_url == "" || tmm_url == undefined) throw new Error("Cannot get port: tmmback_url not in global config file");
        var port_str = tmm_url.match("[0-9]+")[0];
        if(isNaN(port_str)){
            throw new Error("Cannot get port: invalid global config file");
        }else{
            url = tmm_url;
            callback();
        }
    });

    Given(/^I create a new Tenant Metadata Object for tenant (.*)$/, function (variable, table, callback) {
        // Write code here that turns the phrase above into concrete action
        tenantId = variable;
        tenant_data = {
            id: 'Doga',  //id of the metadata
            name: 'Data Source',
            tenantId: variable,
            dataSets: [{
                "id": "nextBus",
                "name": "nextBus",
                "from": [
                    "nextBus"
                ],
                "persist": true,
                "filter": "",
                "merge": "",
                "projections": "",
                "metadata": [
                    "data"
                ]
            }],
            dataSource: [{
            id: '10-23-1',
            name: 'Test Data Set 01',
            type: 'TestMockData',
            active: true,
            properties: ['Test', 'Doga', 'Is', 'AWesome']
        }, {
            id: '10-23-1',
            name: 'Test Data Set 02',
            type: 'TestMockData',
            active: true,
            properties: ['Test', 'Ray', 'Is', 'Bae']}
        ],
            users: [{
            id: '10-24-1',
            name: 'Test Data Set 01',
            permissions: ['Write', 'Read', 'Execute'],
            status: 'Admin'
        }, {
            id: '32-1',
            name: 'Test Data Set 02',
            permissions: ['Write', 'Read'],
            status: 'User'
        }],
            idpInformation: [{
            id: '10-25-02',
            name: 'idap Main Config',
            endpoint: 'localhost:1023/endPointFTW',
            configurations: [{
                method: 'GET',
                secure: 'x-access'
            }]
        },
            {
                id: '10-25-02',
                name: 'idap Main Config 2',
                endpoint: 'localhost:1023/endPointFTW',
                configurations: [{
                    method: 'POST',
                    secure: 'y-access 4 pizza'
                }]
            }]
    };
        callback();
    });

    Then("I setup request for posting to tmm backend", function (callback) {
        // Write code here that turns the phrase above into concrete actions
        options.body = tenant_data;
        options.body.tenantId = tenantId;

        callback();
    });

    When("I POST to {stringInDoubleQuotes}", function (stringInDoubleQuotes,callback) {
        // Write code here that turns the phrase above into concrete actions
        options.uri = url + stringInDoubleQuotes;
        Request.post(options, function (error, response, body) {
            if (error) {
                throw new Error("upload failed:"+ error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        });
    });

    Then('The response code needs to be \'{int}\'', function (int, callback) {
        // Write code here that turns the phrase above into concrete actions
        var resString = JSON.stringify(responseData).toLowerCase();
        if (int != parseInt(responseCode)) {
            //console.log("Error: "+ responseData);
            throw new Error('Response code should be ' + int +' but is ' + responseCode +'\n Error:'+  resString);

        };
        callback();
    });

    Then("The response body should contain an array of valid meta data objects", function (callback) {
        // Write code here that turns the phrase above into concrete actions

        if (responseData == undefined || responseData.ok == undefined) {
            throw new Error("did not get a response back");
        }
        callback();
    });

    Given("I modify a Tenant Metadata Object such that it remains valid", function (callback) {
        // Write code here that turns the phrase above into concrete actions
        options.dataSets = [];
        callback();
    });

    Then('The response body should contain statusCode {int}', function (int, callback) {
        // Write code here that turns the phrase above into concrete actions
        if (responseData.statusCode != int) {
            throw new Error("response body should contain statusCode : "+int +" but instead contains: "+ JSON.stringify(responseData));
        }
        callback();
    });

    Given('I modify the Tenant Metadata Object tenantid to {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        tenant_data.tenantId = stringInDoubleQuotes;
        callback();
    });

    Then('The response body should contain the error {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        if (responseData == undefined || responseData.error != stringInDoubleQuotes) {
            throw new Error("response body should contain error: "+stringInDoubleQuotes +" but instead contains: "+ JSON.stringify(responseData));
        }
        callback();
    });

    Then('I set header for making a get request to tmm', function (callback) {
        resetOptions();
        callback();
    });

    When('I GET {stringInDoubleQuotes}', function (stringInDoubleQuotes, callback) {
        options.uri = url + stringInDoubleQuotes;
        Request.get(options, function (error, response, body) {
            if (error) {
                throw new Error("upload failed:"+ error);
            }
            responseData = body;
            //console.log(body);
            responseCode = response.statusCode;
            callback();
        });
    });

    Then('the response body should be an array with at least 1 Tenant Metadata Object with the correct tenantid', function (callback) {
        var resString = JSON.stringify(responseData);
        if (responseData == undefined || responseData.length ==0 ||!resString.includes(tenantId)) {
            throw new Error("Did not receive list of tenant metadata objects. "+ responseData);
        }
        callback();
    });

    Then('I set header for making get to tmm with non-existent tenantId', function (callback) {
        resetOptions();
        //tenantId = "testtenant-unicorn";
        callback();
    });

    Then('The response body should be an empty array', function (callback) {
        if (responseData == undefined ||  responseData.length!=0) {
            throw new Error("The response body either undefined or not empty");
        }
        callback();
    });

    function resetOptions() {
        options  =  {
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