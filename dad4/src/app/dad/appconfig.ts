/**
 * Created by pelustondo on 11/23/2016.
 */

let appconfig = require("../../../appconfig.json");

export const config = {
    "testing":appconfig.testingmode,
    "authorizationserver":appconfig.dss,
    "InitialChargeLevels":appconfig.oda + "/Devices/Battery/Summary/InitialChargeLevels",
    "DischargeRate":appconfig.oda + "/Devices/Battery/Summary/DischargeRate",
    "DevicesNotSurvivedShift": appconfig.oda +  "/Devices/Battery/Summary/countOfDevicesDidNotSurviveShift",
    "ListOfDevicesNotSurvivedShift": appconfig.oda + "/Devices/Battery/List/DevicesDidNotSurviveShift",
    "BatteryMetrics": {url: appconfig.oda + "/Devices/Battery/getMetrics", method:"post"},
    "AverageDischargeRate": appconfig.oda + "/Devices/Battery/Summary/AverageDischargeRate",
    "ApplicationDeploymentCount": appconfig.oda + "/Devices/Application/executionTime",
    "NumberOfInstallations": appconfig.oda + "/Devices/Application/numberOfInstallations",
    "GetLocation": appconfig.oda + "/Vehicles/Data/GetLocations"
};
