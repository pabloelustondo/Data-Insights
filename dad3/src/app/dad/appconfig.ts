/**
 * Created by pelustondo on 11/23/2016.
 */

export const config = {
    "testing":false,
    "InitialChargeLevels":"http://localhost:3002/Devices/Battery/Summary/InitialChargeLevels",
    "DischargeRate":"http://localhost:3002/Devices/Battery/Summary/DischargeRate",
    "DevicesNotSurvivedShift": "http://localhost:3002/Devices/Battery/Summary/countOfDevicesDidNotSurviveShift",
    "ListOfDevicesNotSurvivedShift": "http://localhost:3002/Devices/Battery/List/DevicesDidNotSurviveShift",
    "BatteryMetrics": {url:"http://localhost:3002/Devices/Battery/getMetrics", method:"post"},
    "AverageDischargeRate": "http://localhost:3002/Devices/Battery/Summary/AverageDischargeRate"
}
