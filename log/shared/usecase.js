"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var logconfig_1 = require("./logconfig");
var log_1 = require("./log");
var message = { "classifier": "Create_Success", "serverId": "someSeverId", "priority": "Critical", "producer": "DDB", "message": "The {{speed}} {{fox.color}} {{mammal[2]}} jumped over the lazy {{mammal[0]}}", "params": { "speed": "quick", "fox": { "color": "brown" }, "mammal": ["dog", "cat", "fox"] } };
var ts = log_1.log(message);
console.log("ts: " + ts);
var url = logconfig_1.default.url;
axios_1.default.get(url)
    .then(function (response) {
    console.log(log_1.interpolate(response.data.filter(function (a) { return a.timeStamp == ts; })[0]));
})
    .catch(function (error) {
    console.log(error);
});
//# sourceMappingURL=usecase.js.map