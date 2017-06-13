"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var logConfig_1 = require("./logConfig");
function log(logMessage) {
    var url = logConfig_1.default.url;
    var message = __assign({}, logMessage, { time: new Date().getTime() });
    axios_1.default.post(url, message)
        .then(function (response) {
        console.log(response);
    })
        .catch(function (error) {
        console.log(error);
    });
}
exports.default = log;
//# sourceMappingURL=log.js.map