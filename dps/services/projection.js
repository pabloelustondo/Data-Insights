"use strict";
let config = require('../config.json');
let appconfig = require('../appconfig.json');
function DataProjections(data, projections) {
    return new Promise((resolve, reject) => {
        let _data = {};
        if (projections.length > 0 && projections[0] !== '') {
            projections.forEach((item, index) => {
                _data[item] = data[item];
            });
        }
        else {
            _data = data;
        }
        resolve(_data);
    });
}
exports.DataProjections = DataProjections;
//# sourceMappingURL=projection.js.map