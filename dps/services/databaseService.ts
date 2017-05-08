/**
 * Created by vdave on 5/8/2017.
 */
import {MongoClient, Db} from "mongodb";
var mongodb = require('mongodb').MongoClient;
let config = require('../config.json');
let appconfig = require('../appconfig.json');


export class DatabaseService {

    connectionString: string;
    database: any;
    tenants: any[];

    constructor(ddbUrl: string) {

    }

    public getTenant(tenantId: string) {

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