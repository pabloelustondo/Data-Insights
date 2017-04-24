/**
 * Created by pabloelustondo on 2017-04-24.
 */
import {MongoClient, Db, Cursor} from "mongodb";
let config = require('./config.json');
let appconfig = require('./appconfig.json');
import {DasDataSet} from "./dsmodel";



export function getData(db, dsdef: DasDataSet){
    let dsid = dsdef["dsid"];

    if (dsdef.merge){
        let col2 = dsdef.merge.dsid;
        return db.collection(dsid).find();
    } else {
        return db.collection(dsid).find();
    }
}
