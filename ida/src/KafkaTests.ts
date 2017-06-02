import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from './models/user';
import * as express from 'express';
import * as methodOverride from 'method-override';

import * as https from 'https';
import * as fs from 'fs';
let localDynamo = require('local-dynamo');

import {RegisterRoutes} from './routes';
const expressWinston = require('express-winston');

let helmet = require('helmet');


const app = express();
const swaggerPath =  __dirname + '/swagger.json';

var http = require('http').Server(app);

var path = require('path');
let config = require('../config.json');
let appconfig = require('../appconfig.json');
let globalconfig = require('../globalconfig.json');

const config = require('../config.json');
let jwt  = require('jsonwebtoken');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
let expect = chai.expect;

const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZ2VudGlkIjoiMjEzIiwidGVuYW50aWQiOiJ4eXphMTIiLCJpYXQiOjE0ODc4Nzk1NTcsImV4cCI6MTQ5NTA3OTU1N30.TnX4J-xSBGxvgSd2CO5CCMZvQ4TBHJX5Ne4Ioy6A2Kk';

globalconfig.hostname = "localhost";  //this can be overwritten by app config if necessary
//our app config will be the result of taking all global configurations and overwritting them with the local configurations
Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
})
globalconfig.port = globalconfig[globalconfig.id+"_url"].split(":")[2];

appconfig = globalconfig;

console.log("configuration");
console.log(appconfig);

exports.config = config;
exports.appconfig = appconfig;


var kafka = require('kafka-node');
var kafkaClient = new kafka.Client(appconfig.kafka_url);
@suite class HelloKafka {

@test('Posting to a data source through IDA should result in a valid response from Kafka')

}