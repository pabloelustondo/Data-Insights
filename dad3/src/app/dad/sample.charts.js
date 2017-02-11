"use strict";
var dadmodels_1 = require("./dadmodels");
exports.CHARTS = [
    { id: "chartbar",
        name: 'Average Battery Discharge Rate',
        type: "bar",
        endpoint: "AverageDischargeRate",
        a: 'countOfDevices',
        b: 'percentage',
        aname: 'Count Of Devices',
        bname: 'Percentage',
        width: 475,
        height: 400,
        regionM: 30,
        tableId: 'table2',
        action: 'drill',
        parameters: [
            {
                dateTo: "2016-08-25T20:30:21",
                shiftStartDateTime: "2016-08-24T20:30:21",
                shiftDuration: 8
            }],
        uiparameters: [
            {
                Type: dadmodels_1.DadParameterType.Date,
                Name: "Date To",
                DataSource: "dateTo"
            },
            {
                Type: dadmodels_1.DadParameterType.DateTime,
                Name: "Shift Start Date & Time",
                DataSource: "shiftStartDateTime"
            },
            {
                Type: dadmodels_1.DadParameterType.Duration,
                Name: "Shift Duration",
                DataSource: "shiftDuration"
            },
        ],
    },
    { id: "charthorizontal",
        name: 'Average Battery Discharge Rate',
        type: "bar",
        endpoint: "ApplicationDeploymentCount",
        a: 'ExecutionTimeMinutes',
        b: 'AppId',
        aname: 'Execution Minutes',
        bname: 'Application ID',
        width: 475,
        height: 400,
        horizontal: true,
        parameters: [
            {
                dateFrom: "2017-01-24T20:30:21",
                dateTo: "2017-01-25T20:30:21"
            }],
        uiparameters: [
            {
                Type: dadmodels_1.DadParameterType.Date,
                Name: "Date From",
                DataSource: "dateFrom"
            },
            {
                Type: dadmodels_1.DadParameterType.Date,
                Name: "Date To",
                DataSource: "dateTo"
            }
        ],
    },
    { id: "charthorizontal2",
        name: 'Average Battery Discharge Rate',
        type: "bar",
        endpoint: "AverageDischargeRate",
        a: 'countOfDevices',
        b: 'percentage',
        aname: 'Count Of Devices',
        bname: 'Percentage',
        width: 475,
        height: 400,
        horizontal: true,
        parameters: [
            {
                dateTo: "2016-08-25T20:30:21",
                shiftStartDateTime: "2016-08-24T20:30:21",
                shiftDuration: 8
            }],
        uiparameters: [
            {
                Type: dadmodels_1.DadParameterType.Date,
                Name: "Date To",
                DataSource: "dateTo"
            },
            {
                Type: dadmodels_1.DadParameterType.DateTime,
                Name: "Shift Start Date & Time",
                DataSource: "shiftStartDateTime"
            },
            {
                Type: dadmodels_1.DadParameterType.Duration,
                Name: "Shift Duration",
                DataSource: "shiftDuration"
            },
        ],
    }
];
