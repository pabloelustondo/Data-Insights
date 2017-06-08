/**
 * Created by sxia on 6/8/2017.
 */
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
    const globalconfig = require(process.cwd() + '\\globalconfig_test.json');
    // const globalconfig = require(process.cwd()+'\\..\\globalconfigs\\globalconfig_dev.json');
    var accessToken = '';
    var url = '';

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

    Given('grab tmm port number', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        var tmm_url = globalconfig.tmmback_url;
        if(tmm_url == "" || tmm_url == undefined) throw new Error('Cannot get port: tmmback_url not in global config file');
        var port_str = tmm_url.match("[0-9]+")[0];
        if(isNaN(port_str)){
            throw new Error('Cannot get port: invalid global config file');
        }else{
            url = tmm_url;
            callback();
        }
    });

});