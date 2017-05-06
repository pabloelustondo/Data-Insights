/**
 * Created by pabloelustondo on 2017-04-24.
 */
import {MongoClient, Db, Cursor} from "mongodb";
let config = require('./config.json');
let appconfig = require('./appconfig.json');
import {DasDataSet, DasRelationship} from "./dsmodel";
import {ExtensibleDasDataSet} from "./dsmodel";

var aggreagateFunction = function () {

};

var reduceFunction = function () {

};

export function getExtensibleData (db, dsDef: ExtensibleDasDataSet, next) {

    let dsName = dsDef.dsName;
    let dsId = dsDef.dsId;
    let persist = dsDef.persist;

    var relationships = dsDef.relationships;

    for (let relIndex in relationships){
        let relationship: DasRelationship = relationships[relIndex];

        for (let opIndex in relationship) {
            let operations = relationship[opIndex];

            for (let opI in operations) {
                let operation = operations[opI];
                console.log(JSON.stringify(operation));

                // operation is available now
                let operationAction = operation.type;

                console.log(operationAction);
                if (operationAction === 'join') {

                    let query = [];
                    var initialDb = operation.dataSets[0].dataSourceId;
                    for (var i = 1; i < operation.dataSets.length; i++) {
                        var dataSourceId = operation.dataSets[i].dataSourceId;
                        var foreignField = operation.dataSets[i].fields[0];
                        var localField = operation.dataSets[i-1].fields[0];

                        var lookup = {
                            $lookup : {
                                from : dataSourceId,
                                localField : localField,
                                foreignField : foreignField,
                                as : "tb" + i
                            }
                        };
                        var unwind = {
                            $unwind : {
                                path : "$tb" + i,
                                preserveNullAndEmptyArrays: true
                            }
                        };
                        query.push(lookup);
//                        query.push(unwind);

                        console.log(dataSourceId + ' - ' + foreignField);
                    }
                    console.log("query = \n  " + JSON.stringify(query));
                    db.collection(initialDb).aggregate(query).toArray(next);
                }

                else {
                    next(new Error ('invalid operation'));
                }
            }
        }
    }
   // next();
}


export function getData(db, dsdef: DasDataSet, next){
    let dsid = dsdef["dsid"];

    let targetDataSourceId = dsdef['dataSourceId'];
    if (dsdef.merge) {

        var lookup = {
            from : dsdef.merge.dsid,
            localField : dsdef.parameters[0].name,
            foreignField : dsdef.merge.commonFeature,
            as : dsid
        };

        db.collection(dsdef.dataSourceId).aggregate([
            {
                $lookup : {
                    from : dsdef.merge.dsid,
                    localField : dsdef.parameters[0].name,
                    foreignField : dsdef.merge.commonFeature,
                    as : dsid
                }
            }
        ]).toArray(next);

    } else {
        return db.collection(dsid).find();
    }
}

