/**
 * Created by sxia on 6/5/2017.
 */
'use strict';

const Cucumber = require('cucumber');
const Request = require('request');
const FS = require('fs');
const kafka = require('kafka-node');
const jwt  = require('jsonwebtoken');
const globalconfig = require(process.cwd()+'/globalconfig_test.json');
const config = require('..\\..\\ida_config.json');
Cucumber.defineSupportCode(function(context) {
    var Given = context.Given;
    var When = context.When;
    var Then = context.Then;
    var portnumber = 0;
    var responseCode = 0;
    var responseData = '';
    var url = '';
    var options  = {
        "method": "",
        "url": "",
        "baseUrl":"",
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

    Given('grab IDA port number for kafka test', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        var ida_url = globalconfig.ida_url;
        if(ida_url == "" || ida_url == undefined) throw new Error('Cannot get port: ida url not in global config file');
        var port_str = ida_url.match("[0-9]+")[0];
        if(isNaN(port_str)){
            throw new Error('Cannot get port: invalid global config file');
        }else{
            url = ida_url;
            callback();
        }
    });

    Given("Set headers and body for posting data to IDA", function (callback) {
        var projections = ['sensorValue'];
        var testData = {
            metadata  : {
                dataSetId : 'idaSampleId2',
                projections: projections
            },
            data: {
                sensorId : '123',
                sensorValue: '45648946'
            }
        };
        var tenantId = 'varun_test';
        var jwtPayload = {
            tenantid: tenantId,
            agentid: '12345678901234567890'
        };
        var token = jwt.sign(jwtPayload, config['expiring-secret'], {expiresIn: 15});
        options.headers['x-access-token'] = token;
        options.body = testData;
        callback();
    });

    When('I make a POST call to /data', function (callback) {
        options.uri = url + "/data"
        Request(options, function (error, response, body) {
            if (error) {
                throw new Error('upload failed:'+ error);
            }
            responseData = body;
            responseCode = response.statusCode;
            callback();
        });
    });
    Then('response code should equal :{int}', function (int, callback) {
        // Write code here that turns the phrase above into concrete actions
        var resString = JSON.stringify(responseData).toLowerCase();
        if (parseInt(int) != parseInt(responseCode)){
            //console.log('Error: '+ responseData);
            throw new Error('Response code should be ' + int +' but is ' + responseCode +'\n Error:'+ resString);
        }

        callback();
    });

    Then("Kafka should receive some message under topic {stringInDoubleQuotes}", function (stringInDoubleQuotes,callback) {
        var kafka_url = globalconfig.kafka_url;
        kafka_url = kafka_url.replace("http://", "");
        var kafkaClient = new kafka.Client(kafka_url);
        var payloads =  [{ topic: stringInDoubleQuotes, partition: 0 }];
        var options = {
            autoCommit: true,
            sessionTimeout: 4000
        };

        var kafkaConsumer = new kafka.Consumer(kafkaClient, payloads, options);
            // now let's see if Kafka receives anything
            kafkaConsumer.on('message', function (message, err) {
                if (!err && message != undefined && message != "") {
                    callback();
                }else{
                    throw new Error("Kafka did not receive any valid messages");
                }
            });
            kafkaConsumer.on('error', function (err) {
                throw new Error("Something went wrong: " + err);
            });
    });

});
