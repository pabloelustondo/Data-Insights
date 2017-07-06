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
/**
 * Creates a log request and send it to the handler API.
 * Also attaches a time stamp to the log before sending to the backend.
 *
 * @param {logging} logMessage The message that would be dispatched to the API.
 *
 */
function log(logMessage) {
    var timeStamp = new Date().getTime();
    var message = __assign({}, logMessage, { "timeStamp": timeStamp.toString() });
    var url = logconfig_1.default.url;
    axios_1.default.post(url, message)
        .then(function (response) {
        console.log(response.data);
    })
        .catch(function (error) {
        console.log(error);
    });
    return timeStamp;
}
exports.log = log;
/**
*
* Interpolates the message with the given parameters and returns result back.
* @example "message": "The {{speed}} {{fox.color}} {{mammal[2]}} jumped over the lazy {{mammal[0]}}",
* "params": { "speed": "quick", "fox": { "color": "brown" }, "mammal": ["dog", "cat", "fox"] }
*
* @result 'The quick brown fox jumped over the lazy dog'
* @param {logging} logMessage The message that would be interpolated.
*
*/
function interpolate(logMessage) {
    if (logMessage.hasOwnProperty('params')) {
        return logMessage.message.replace(/{{([^{}]*)}}/g, function (a) { return eval("logMessage.params." + a.slice(2, a.length - 2)); });
    }
    else {
        return logMessage.message;
    }
}
exports.interpolate = interpolate;
//# sourceMappingURL=log.js.map