/**
 * Created by pelustondo on 11/23/2016.
 */

export const config = {
    "testing":false,
    "authorizationserver":'http://localhost:3003',
    "InitialChargeLevels":"https://localhost:3002/Devices/Battery/Summary/InitialChargeLevels",
    "DischargeRate":"https://localhost:3002/Devices/Battery/Summary/DischargeRate",
    "DevicesNotSurvivedShift": "https://localhost:3002/Devices/Battery/Summary/countOfDevicesDidNotSurviveShift",
    "ListOfDevicesNotSurvivedShift": "https://localhost:3002/Devices/Battery/List/DevicesDidNotSurviveShift",
    "BatteryMetrics": {url:"https://localhost:3002/Devices/Battery/getMetrics", method:"post"},
    "AverageDischargeRate": "https://localhost:3002/Devices/Battery/Summary/AverageDischargeRate",
    "ApplicationDeploymentCount": "https://localhost:3002/Devices/Application/executionTime",
    "NumberOfInstallations": "https://localhost:3002/Devices/Application/numberOfInstallations"
};
