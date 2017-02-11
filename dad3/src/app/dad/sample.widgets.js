"use strict";
var dadmodels_1 = require("./dadmodels");
exports.WIDGETS = [
    { id: 'widget1',
        name: 'Device battery during shift',
        type: 0,
        tableId: 'table1',
        endpoint: 'DevicesNotSurvivedShift',
        metrics: [
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Devices Not Lasted a Shift",
                DataSource: "CountDevicesNotLastedShift"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Total Active",
                DataSource: "CountTotalActiveDevices"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Device Lasted Shift",
                DataSource: "CountDevicesLastedShift"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Device Charging Entire Shift",
                DataSource: "CountDevicesChargingEntireShift"
            }
        ],
        parameters: [
            {
                shiftStartDateTimeAuto: "custom",
                shiftStartDateTime: "2016-08-15T13:00:00.000Z",
                shiftDuration: "8",
                minimumBatteryPercentageThreshold: 20
            }],
        uiparameters: [
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
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Min Battery",
                DataSource: "minimumBatteryPercentageThreshold"
            }
        ]
    },
    { id: 'widget2',
        name: 'Device battery during shift',
        type: 0,
        tableId: "table1",
        endpoint: 'DevicesNotSurvivedShift',
        metrics: [
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Devices Not Lasted a Shift",
                DataSource: "CountDevicesNotLastedShift"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Total Active",
                DataSource: "CountTotalActiveDevices"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Device Lasted Shift",
                DataSource: "CountDevicesLastedShift"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Device Charging Entire Shift",
                DataSource: "CountDevicesChargingEntireShift"
            }
        ],
        parameters: [
            {
                shiftStartDateTimeAuto: "yesterday",
                shiftStartDateTime: "2016-08-25T13:00:00.000Z",
                shiftDuration: "8",
                minimumBatteryPercentageThreshold: 20
            }],
        uiparameters: [
            {
                Type: dadmodels_1.DadParameterType.String,
                Name: "Date Time Type",
                DataSource: "shiftStartDateTimeAuto"
            },
            {
                Type: dadmodels_1.DadParameterType.DateTime,
                Name: "Shift Start",
                DataSource: "shiftStartDateTime"
            },
            {
                Type: dadmodels_1.DadParameterType.Duration,
                Name: "Shift Duration",
                DataSource: "shiftDuration"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Min Battery",
                DataSource: "minimumBatteryPercentageThreshold"
            }
        ]
    },
    { id: 'widget3',
        name: 'Devices Not Lasted a Shift',
        type: 0,
        tableId: "table1",
        endpoint: 'DevicesNotSurvivedShift',
        metrics: [
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Devices Not Lasted Shift",
                DataSource: "CountDevicesNotLastedShift"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Total Active",
                DataSource: "CountTotalActiveDevices"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Device Lasted Shift",
                DataSource: "CountDevicesLastedShift"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Device Charging Entire Shift",
                DataSource: "CountDevicesChargingEntireShift"
            }
        ],
        parameters: [
            {
                shiftStartDateTimeAuto: "custom",
                shiftStartDateTime: "2016-08-25T13:00:00.000Z",
                shiftDuration: "8",
                minimumBatteryPercentageThreshold: 20
            }],
        uiparameters: [
            {
                Type: dadmodels_1.DadParameterType.String,
                Name: "Date Time Type",
                DataSource: "shiftStartDateTimeAuto"
            },
            {
                Type: dadmodels_1.DadParameterType.DateTime,
                Name: "Shift Start",
                DataSource: "shiftStartDateTime"
            },
            {
                Type: dadmodels_1.DadParameterType.Duration,
                Name: "Shift Duration",
                DataSource: "shiftDuration"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Min Battery",
                DataSource: "minimumBatteryPercentageThreshold"
            }
        ]
    },
    { id: 'widget4',
        name: 'Battery Metrics',
        type: 0,
        tableId: 'table1',
        endpoint: 'BatteryMetrics',
        metrics: [
            {
                Type: dadmodels_1.DadParameterType.String,
                Name: "Devices Not Fully Charged",
                DataSource: "CountDevicesNotFullyCharged"
            },
            {
                Type: dadmodels_1.DadParameterType.String,
                Name: "Total Devices Not Lasted Shift",
                DataSource: "CountDevicesNotLastedShift"
            }
        ],
        metricName: "DevicesDidNotLastShift",
        predicates: ["batteryNotFullyChargedBeforeShift"],
        parameters: [
            {
                shiftStartDateTime: "2016-08-24T19:19:26.581Z",
                endDate: "2016-08-25T19:19:26.581",
                shiftDuration: 8,
                minimumBatteryPercentageThreshold: 20
            }],
        uiparameters: [
            {
                Type: dadmodels_1.DadParameterType.DateTime,
                Name: "Shift Start Date & Time",
                DataSource: "shiftStartDateTime"
            },
            {
                Type: dadmodels_1.DadParameterType.Date,
                Name: "End Date",
                DataSource: "endDate"
            },
            {
                Type: dadmodels_1.DadParameterType.Duration,
                Name: "Shift Duration",
                DataSource: "shiftDuration"
            },
            {
                Type: dadmodels_1.DadParameterType.Number,
                Name: "Min Battery",
                DataSource: "minimumBatteryPercentageThreshold"
            }
        ]
    },
    { id: 'widget_chart1',
        name: 'Application Deployment Count by Number of Devices',
        type: 1,
        endpoint: "ApplicationDeploymentCount",
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
        chart: { id: "charthorizontal",
            type: "bar",
            a: 'ExecutionTimeMinutes',
            b: 'AppId',
            aname: 'Execution Minutes',
            bname: 'Application ID',
            width: 275,
            height: 200,
            embeddedChart: true,
            horizontal: true,
            action: 'grow'
        }
    },
    { id: 'widget_chart2',
        name: 'Application Popularity',
        type: 1,
        endpoint: "AverageDischargeRate",
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
        chart: { id: "charthorizontal2",
            type: "bar",
            a: 'countOfDevices',
            b: 'percentage',
            aname: 'Count Of Devices',
            bname: 'Percentage',
            width: 275,
            height: 200,
            embeddedChart: true,
            horizontal: true,
            action: 'grow'
        }
    }
];
