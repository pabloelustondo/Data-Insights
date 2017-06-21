/**
 * Created by pelustondo on 11/23/2016.
 */

let appconfig = require("../../../appconfig.json");
let globalconfig = require("../../../globalconfig.json");

Object.keys(appconfig).forEach(function(key){
    globalconfig[key] = appconfig[key];
})
appconfig = globalconfig;
console.log(appconfig);

export const config = {
    "testing":appconfig.testingmode,
    "dss_url":appconfig.dss_url,
    "oda_url":appconfig.oda_url,
    "dad_url":appconfig.dad_url,
    "dadback_url":appconfig.dadback_url,
    "authorizationserver":appconfig.dss_url,
    "InitialChargeLevels":appconfig.oda_url + "/Devices/Battery/Summary/InitialChargeLevels",
    "DischargeRate":appconfig.oda_url + "/Devices/Battery/Summary/DischargeRate",
    "DevicesNotSurvivedShift": appconfig.oda_url +  "/Devices/Battery/Summary/countOfDevicesDidNotSurviveShift",
    "ListOfDevicesNotSurvivedShift": appconfig.oda_url + "/Devices/Battery/List/DevicesDidNotSurviveShift",
    "BatteryMetrics": {url: appconfig.oda_url + "/Devices/Battery/getMetrics", method:"post"},
    "AverageDischargeRate": appconfig.oda_url + "/Devices/Battery/Summary/AverageDischargeRate",
    "ApplicationDeploymentCount": appconfig.oda_url + "/Devices/Application/executionTime",
    "NumberOfInstallations": appconfig.oda_url + "/Devices/Application/numberOfInstallations",
    "GetLocation": appconfig.oda_url + "/Vehicles/Data/GetLocations",
};

