import axios from "axios";
import config from "./logConfig";

export default function log (logMessage) {
  var url = config.url;

  var message = { ...logMessage, ...{ time: new Date().getTime() } };

  axios.post(url, message)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

