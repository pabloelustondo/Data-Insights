/**
 * Created by vdave on 5/8/2017.
 */
import {MongoClient, Db} from "mongodb";
var mongodb = require('mongodb').MongoClient;
let config = require('../config.json');
let appconfig = require('../appconfig.json');
let sampletenants = require('../testing/sampleTenants.json');
let _ = require('lodash');
import * as rp from 'request-promise';

export class DatabaseService {

    connectionString: string;
    database: any;
    tenants: any[];

    constructor(ddbUrl: string) {

        if (appconfig.testingmode) {
            this.tenants = sampletenants.tenants;
        } else {
            //TODO: call DDB for this but for now just return  test data
            this.tenants = sampletenants.tenants;
        }
    }

    public start (){

        if (appconfig.testing) {
            this.tenants = sampletenants;
        } else {
            //TODO: provide proper DDB fix
            const headersOptions = {
                'x-api-key': 'kTq3Zu7OohN3R5H59g3Q4PU40Mzuy7J5sU030jPg'
            };

            const options: rp.OptionsWithUrl = {
                json: true,
                method: 'get',
                headers: headersOptions,
                url: 'http://localhost:8000/getAllTenants',
            };
            let data = rp(options);
            this.tenants = [];
        }
    }

    public getTenant(tenantId: string) {
        let value =  _.find(this.tenants, ['tenantId', tenantId]);
        return value;
        /*
            return _.find(this.tenants, function(element: any) {
                return element.tenantId == tenantId;
            })*/
    }

    public findProperty(propertyName: string, propertyValue: string) {
        return _.find(this.tenants, [propertyName, propertyValue]);
    }

    public getUserInfo(userId: string) {
        //TODO: proper implementation

        return {
            userId: "varun",
            tenantId: "varunTenant" + Math.floor(Math.random() * 5 ) + 1
        }
    }


    public callDbAndRespond(req,res,query){
    //this function opens a connection to the tenant db and calls the specific query.
    //when this is do it returns the http response.
    //the inout parameter query contains the actual query to be executed against to db
    var uri = '1234'; // one database per tenant
    //check uri and make sure we have rights
    mongodb.connect(uri,function(err,db:Db){
        if (err) {
            res.send({data:null, status:err });
        }
        else query(req,res,db,function(err,doc){
            if (doc !== null) {
                res.status(200).send(doc);
            }
            else {
                res.status(404).send("No Results are returned");
            }
            db.close();
        });
    });
}
}