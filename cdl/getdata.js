"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require('./config.json');
var appconfig = require('./appconfig.json');
var aggreagateFunction = function () {
};
var reduceFunction = function () {
};
function getExtensibleData(db, dsDef, next) {
    var dsName = dsDef.dsName;
    var dsId = dsDef.dsId;
    var persist = dsDef.persist;
    var relationships = dsDef.relationships;
    for (var relIndex in relationships) {
        var relationship = relationships[relIndex];
        for (var opIndex in relationship) {
            var operations = relationship[opIndex];
            for (var opI in operations) {
                var operation = operations[opI];
                console.log(JSON.stringify(operation));
                // operation is available now
                var operationAction = operation.type;
                console.log(operationAction);
                if (operationAction === 'join') {
                    var query = [];
                    var initialDb = operation.dataSets[0].dataSourceId;
                    for (var i = 1; i < operation.dataSets.length; i++) {
                        var dataSourceId = operation.dataSets[i].dataSourceId;
                        var foreignField = operation.dataSets[i].fields[0];
                        var localField = operation.dataSets[i - 1].fields[0];
                        var lookup = {
                            $lookup: {
                                from: dataSourceId,
                                localField: localField,
                                foreignField: foreignField,
                                as: "tb" + i
                            }
                        };
                        var unwind = {
                            $unwind: {
                                path: "$tb" + i,
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
                    next(new Error('invalid operation'));
                }
            }
        }
    }
    // next();
}
exports.getExtensibleData = getExtensibleData;
function getData(db, dsdef, next) {
    var dsid = dsdef["dsid"];
    var targetDataSourceId = dsdef['dataSourceId'];
    if (dsdef.merge) {
        var lookup = {
            from: dsdef.merge.dsid,
            localField: dsdef.parameters[0].name,
            foreignField: dsdef.merge.commonFeature,
            as: dsid
        };
        db.collection(dsdef.dataSourceId).aggregate([
            {
                $lookup: {
                    from: dsdef.merge.dsid,
                    localField: dsdef.parameters[0].name,
                    foreignField: dsdef.merge.commonFeature,
                    as: dsid
                }
            }
        ]).toArray(next);
    }
    else {
        return db.collection(dsid).find();
    }
}
exports.getData = getData;
