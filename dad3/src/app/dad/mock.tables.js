"use strict";
var table_model_1 = require("./table.model");
exports.TABLES = [
    { id: 'table1',
        name: 'List of Devices That Did Not Last a Shift',
        endpoint: 'ListOfDevicesNotSurvivedShift',
        parameters: [
            {
                shiftDuration: 8,
                rowsSkip: 0,
                rowsTake: 10,
                shiftStartDateTime: "2016-08-25",
                minimumBatteryPercentageThreshold: 20
            }],
        columns: [
            {
                Type: table_model_1.DadTableColumnType.Number,
                Name: "Device Id",
                DataSource: "DevId"
            },
            {
                Type: table_model_1.DadTableColumnType.String,
                Name: "Battery Status",
                DataSource: "LastBatteryStatus"
            },
            {
                Type: table_model_1.DadTableColumnType.MiniChart,
                Name: "Battery Charge History",
                DataSource: "BatteryChargeHistory",
                MiniChart: { id: "charttable1",
                    name: "",
                    type: "bar",
                    width: 150,
                    height: 30,
                    mini: true
                }
            }
        ]
    },
    { id: 'table2',
        name: 'List of Devices That Did Not Last a Shift and Battery Not Fully Charged',
        endpoint: 'ListOfDevicesNotSurvivedShift',
        parameters: [
            {
                shiftDuration: 10,
                rowsSkip: 0,
                rowsTake: 10,
                shiftStartDateTime: "2016-08-25T08:00",
                minimumBatteryPercentageThreshold: 30
            }],
        columns: [
            {
                Type: table_model_1.DadTableColumnType.Number,
                Name: "Device Id",
                DataSource: "DevId"
            },
            {
                Type: table_model_1.DadTableColumnType.String,
                Name: "Last Known Battery Status",
                DataSource: "LastBatteryStatus"
            }
        ]
    }
];
