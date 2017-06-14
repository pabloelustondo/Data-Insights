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
var logconfig_1 = require("./logconfig");
function log(url, logMessage) {
    var message = __assign({}, logMessage, { timeStamp: new Date().getTime() });
    axios_1.default.post(url, message)
        .then(function (response) {
        return (true);
    })
        .catch(function (error) {
        return (false);
    });
}
function client(logMessage) {
    var url = logconfig_1.default.clientUrl;
    log(url, logMessage);
}
exports.client = client;
function server(logMessage) {
    var url = logconfig_1.default.serverUrl;
    log(url, logMessage);
}
exports.server = server;
//# sourceMappingURL=log.js.map