"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by vdave on 2/27/2017.
 */
const mocha_typescript_1 = require('mocha-typescript');
const config = require('../config.json');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
let expect = chai.expect;
const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZ2VudGlkIjoiMjEzIiwidGVuYW50aWQiOiJ4eXphMTIiLCJpYXQiOjE0ODc4Nzk1NTcsImV4cCI6MTQ5NTA3OTU1N30.TnX4J-xSBGxvgSd2CO5CCMZvQ4TBHJX5Ne4Ioy6A2Kk';
let TestUploadLargeDataSet = class TestUploadLargeDataSet {
    test_put_large_json_file(done) {
        const testData = {
            'file': config['large-data-set']
        };
        console.log('testing positive case');
        chai.use(chaiHttp);
        chai.request('https://localhost:3010')
            .post('/Data/LargeDataSets')
            .set('x-access-token', testToken)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            done();
        });
    }
    non_json_body_type(done) {
        const testData = 'hello';
        console.log('testing non json type ');
        chai.use(chaiHttp);
        chai.request('https://localhost:3010')
            .post('/Data/LargeDataSets')
            .set('x-access-token', testToken)
            .set('Content-Type', 'application/text')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err, res) => {
            expect(res).to.have.status(400);
            expect(err).to.not.be.null;
            done();
        });
    }
    non_json_body_data(done) {
        const testData = 'hello';
        console.log('testing non json body');
        chai.use(chaiHttp);
        chai.request('https://localhost:3010')
            .post('/Data/LargeDataSets')
            .set('x-access-token', testToken)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err, res) => {
            expect(res).to.have.status(400);
            expect(err).to.not.be.null;
            done();
        });
    }
    non_json_body_type_and_text(done) {
        const testData = '{\"a\"  : \"dasfsadsfa\" }';
        console.log('testing non json type ');
        chai.use(chaiHttp);
        chai.request('https://localhost:3010')
            .post('/Data/LargeDataSets')
            .set('x-access-token', testToken)
            .set('Content-Type', 'application/text')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err, res) => {
            expect(res).to.have.status(500);
            expect(err).to.not.be.null;
            done();
        });
    }
};
__decorate([
    mocha_typescript_1.test('put json data in aws in large file')
], TestUploadLargeDataSet.prototype, "test_put_large_json_file", null);
__decorate([
    mocha_typescript_1.test('Check to see if non json format data and non json test data is inserterted')
], TestUploadLargeDataSet.prototype, "non_json_body_type", null);
__decorate([
    mocha_typescript_1.test('fail non json data')
], TestUploadLargeDataSet.prototype, "non_json_body_data", null);
__decorate([
    mocha_typescript_1.test('Valid json data with invalid content type')
], TestUploadLargeDataSet.prototype, "non_json_body_type_and_text", null);
TestUploadLargeDataSet = __decorate([
    mocha_typescript_1.suite
], TestUploadLargeDataSet);
//# sourceMappingURL=test_uploadLargeDataSet.js.map