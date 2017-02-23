/**
 * Created by pablo elustondo on 2016-12-06.
 */
import { DadChart } from './chart.component';
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"

export const CHARTS: DadChart[] = [
    {id: "chartbar",
        name: 'Average Battery Discharge Rate',
        type: "bar",
        endpoint: "AverageDischargeRate",
        a : 'countOfDevices',
        b : 'percentage',
        aname : 'Count Of Devices',
        bname : 'Percentage',
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
                Type: DadParameterType.Date,
                Name: "Date To",
                DataSource: "dateTo"
            },
            {
                Type: DadParameterType.DateTime,
                Name: "Shift Start Date & Time",
                DataSource: "shiftStartDateTime"
            },
            {
                Type: DadParameterType.Duration,
                Name: "Shift Duration",
                DataSource: "shiftDuration"
            },
            ],
    },

    {id: "charthorizontal",
        name: 'Average Battery Discharge Rate',
        type: "bar",
        endpoint: "ApplicationDeploymentCount",
        a : 'ExecutionTimeMinutes',
        b : 'AppId',
        aname : 'Execution Minutes',
        bname : 'Application ID',
        width: 475,
        height: 400,
        horizontal: true,
        transformations : [{sort: true}],
        data: [
            {
                "ExecutionTimeMinutes": 41628,
                "AppId": "android"
            },
            {
                "ExecutionTimeMinutes": 43,
                "AppId": "com.ebay.mobile"
            },
            {
                "ExecutionTimeMinutes": 60000,
                "AppId": "soti"
            }
        ],
        parameters: [
            {
                dateFrom: "2017-01-24T20:30:21",
                dateTo: "2017-01-25T20:30:21"
            }],
        uiparameters: [
            {
                Type: DadParameterType.Date,
                Name: "Date From",
                DataSource: "dateFrom"
            },
            {
                Type: DadParameterType.Date,
                Name: "Date To",
                DataSource: "dateTo"
            }
        ],
    },
    {id: "charthorizontal2",
        name: 'Application Popularity',
        type: "bar",
        endpoint: "NumberOfInstallations",
        a : 'NumberOfInstallations',
        b : 'AppId',
        aname : 'Number of Installations',
        bname : 'Application ID',
        width: 475,
        height: 400,
        horizontal: true,
        transformations : [{sort: true}],
        parameters: [
            {
                dateFrom: "2017-01-24T20:30:21",
                dateTo: "2017-01-27T09:30:21"
            }],
        uiparameters: [
            {
                Type: DadParameterType.Date,
                Name: "Date From",
                DataSource: "dateFrom"
            },
            {
                Type: DadParameterType.Date,
                Name: "Date To",
                DataSource: "dateTo"
            }
        ],
    },
/*
    {id: "chartpie",
        name: 'Test Pie',
        type:"pie",
        endpoint: "AverageDischargeRate",
        a : 'countOfDevices',
        b : 'percentage',
        width: 475,
        height: 400,
        uiparameters: [
            {
                Type: DadParameterType.Date,
                Name: "Date To",
                DataSource: "dateTo"
            },
            {
                Type: DadParameterType.DateTime,
                Name: "Shift Start Date & Time",
                DataSource: "shiftStartDateTime"
            },
            {
                Type: DadParameterType.Duration,
                Name: "Shift Duration",
                DataSource: "shiftDuration"
            },
        ],
    },
*/


];

