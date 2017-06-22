import axios from "axios";
import config from "./logconfig";

import {log, interpolate, logging} from "./log";


var message: logging = {"classifier":"Read_Success", "producer": "DDB", "message": "The {{speed}} {{fox.color}} {{mammal[2]}} jumped over the lazy {{mammal[0]}}", "params": { "speed": "quick", "fox": { "color": "brown" }, "mammal": ["dog", "cat", "fox"] } }; 

var ts = log(message);

console.log("ts: " + ts);

var url = config.url;

axios.get(url)
.then(function (response) {
    console.log(interpolate(response.data.filter(a => a.timeStamp == ts)[0]));
})
.catch(function (error) {
    console.log(error);
});
