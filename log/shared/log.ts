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
                  "System Failure";

type logging = {classifier: Classifier, mesasage: string, tenenatId: String, parameters: Object};

function log(url: string, logMessage: logging): void {
  var message = { ...logMessage, ...{ timeStamp: new Date().getTime() } };

  axios.post(url, message)
    .then(function (response) {
      return(true);
    })
    .catch(function (error) {
      return(false);
    });
}

export function client(logMessage: logging): void {
  var url = config.clientUrl;
  log(url, logMessage);
}

export function server(logMessage: logging): void {
  var url = config.serverUrl;
  log(url, logMessage);
}
