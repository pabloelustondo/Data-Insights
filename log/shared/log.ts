import axios from "axios";
import config from "./logconfig";

function log(url: string, logMessage: Object): void {
  var message = { ...logMessage, ...{ timeStamp: new Date().getTime() } };

  axios.post(url, message)
    .then(function (response) {
      //console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function local(logMessage: Object): void {
  var url = config.localUrl;
  log(url, logMessage);
}

export function server(logMessage: Object): void {
  var url = config.serverUrl;
  log(url, logMessage);
}
