declare var require;

export var appconfig = require("./appconfig.json");
let globalconfig = require("./globalconfig.json");

Object.keys(appconfig).forEach(function(key){
  globalconfig[key] = appconfig[key];
})
appconfig = globalconfig;
console.log(appconfig);
