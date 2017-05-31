/**
 * Created by vdave on 2/27/2017.
 */
import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from './models/user';
const config = require('../config.json');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
let expect = chai.expect;
const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZ2VudGlkIjoiMjEzIiwidGVuYW50aWQiOiJ4eXphMTIiLCJpYXQiOjE0ODc4Nzk1NTcsImV4cCI6MTQ5NTA3OTU1N30.TnX4J-xSBGxvgSd2CO5CCMZvQ4TBHJX5Ne4Ioy6A2Kk';

@suite class TestUploadLargeDataSet {

    @test('put json data in aws in large file')
    public test_put_large_json_file(done: Function) {

        const testData = {
            'file' : config['large-data-set']
        };

        console.log('testing positive case');
        chai.use(chaiHttp);
        chai.request('https://localhost:3010')
            .post('/Data/LargeDataSets')
            .set('x-access-token', testToken )
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err: any, res: any) => {
                expect(err).to.be.null;
                expect(res).to.be.json;
                expect(res).to.have.status(200);
                done();
            });
    }

    @test('Check to see if non json format data and non json test data is inserterted')
    public non_json_body_type(done: Function) {

        const testData = 'hello';

        console.log('testing non json type ');
        chai.use(chaiHttp);
        chai.request('https://localhost:3010')
            .post('/Data/LargeDataSets')
            .set('x-access-token', testToken )
            .set('Content-Type', 'application/text')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);
                expect(err).to.not.be.null;
                done();
            });
    }

    @test('fail non json data')
    public non_json_body_data(done: Function) {

        const testData = 'hello';

        console.log('testing non json body');
        chai.use(chaiHttp);
        chai.request('https://localhost:3010')
            .post('/Data/LargeDataSets')
            .set('x-access-token', testToken )
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err: any, res: any) => {
                expect(res).to.have.status(400);
                expect(err).to.not.be.null;
                done();
            });
    }

    @test('Valid json data with invalid content type')
    public non_json_body_type_and_text(done: Function) {

        const testData = 	'{\"a\"  : \"dasfsadsfa\" }';

        console.log('testing non json type ');
        chai.use(chaiHttp);
        chai.request('https://localhost:3010')
            .post('/Data/LargeDataSets')
            .set('x-access-token', testToken )
            .set('Content-Type', 'application/text')
            .set('Accept', 'application/json')
            .send(testData)
            .end((err: any, res: any) => {
                expect(res).to.have.status(500);
                expect(err).to.not.be.null;
                done();
            });
    }

}