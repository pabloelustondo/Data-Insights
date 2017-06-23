import kafka = require('kafka-node');
import axios from "axios";
import config from "./logconfig";

type Classifier = "Create_Sucess" |
                  "Create_Sucess" |
                  "Read_Success" |
                  "Read_Error" |
                  "Update_Success" |
                  "Update_Error" |
                  "Delete_Success" |
                  "Delete_Error" |                  
                  "Server_Success" |
                  "Server_Error" |
                  "System_Failure" |
                  "Test_Log";

type Component = "CDL" | "DAD" | "DDB" | "DOS" | "DPS" | "DSS" | "IDA" | "LOG" | "ODA" | "TMM";
type Agent = "MCDP" | "DLM";

interface Parameter {
    tenenatId?: string;
    [others: string]: any;
}

type Producer = Component | Agent | "Tenant";

/**
 * Mesages are like this: "Deleted {{numRows}} rows of dimention {{dimention}} form the tenant Id {{tenantId}}" 
 */
export type logging = {"classifier": Classifier, "message": string, "producer": Producer, "params"?: Parameter};

/**
 * Creates a log request and send it to the handler API.
 * Also attaches a time stamp to the log before sending to the backend.
 *
 * @param {logging} logMessage The message that would be dispatched to the API.
 * 
 */

export function log(logMessage: logging): number {

    var timeStamp = new Date().getTime();
    var message = { ...logMessage, ...{ "timeStamp": timeStamp.toString() } };
    var url = config.url;
    
    axios.post(url, message)
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });
    return timeStamp;
}

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
export function interpolate(logMessage: logging): string {

    if (logMessage.hasOwnProperty('params')) {
        return logMessage.message.replace(/{{([^{}]*)}}/g, a => eval("logMessage.params." + a.slice(2, a.length-2)));                
    }
    else {
        return logMessage.message;
    }    
}
