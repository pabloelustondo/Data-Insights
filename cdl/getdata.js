"use strict";
var config = require('./config.json');
var appconfig = require('./appconfig.json');
function getData(db, dsdef) {
    var dsid = dsdef["dsid"];
    if (dsdef.merge) {
        var col2 = dsdef.merge.dsid;
        return db.collection(dsid).find();
    }
    else {
        return db.collection(dsid).find();
    }
}
exports.getData = getData;
