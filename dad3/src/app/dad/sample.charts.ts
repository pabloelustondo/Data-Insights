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
    {id: "chartbardrill",
        name: 'Drill Test',
        type: "bar",
        endpoint: "AverageDischargeRate",
        data:[
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:10, BatteryChargeHistory:JSON.stringify([5,6,5,7,8,9]),os:'iOS', brand:'Apple' },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:11, BatteryChargeHistory:JSON.stringify([5,6,6,7,8,9]),os:'iOS', brand:'Apple'  },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:9, BatteryChargeHistory:JSON.stringify([5,6,7,7,8,9]),os:'Android', brand:'Samsung' },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:8, BatteryChargeHistory:JSON.stringify([5,6,8,7,8,9]),os:'Android', brand:'Samsung'  },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:7, BatteryChargeHistory:JSON.stringify([5,6,9,7,8,9]),os:'Android', brand:'Google'  },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:30, BatteryChargeHistory:JSON.stringify([5,6,10,7,8,9]),os:'Android', brand:'LG'  },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,11,7,8,9]),os:'Android', brand:'LG'  },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,12,7,8,9]),os:'Android', brand:'Motorola'  },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:50, BatteryChargeHistory:JSON.stringify([5,6,13,7,8,9]),os:'Android', brand:'Blackberry'  },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:90, BatteryChargeHistory:JSON.stringify([5,6,14,7,8,9]),os:'Windows', brand:'Nokia'  },
            {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:95, BatteryChargeHistory:JSON.stringify([5,6,15,7,8,9]),os:'Android', brand:'Samsung'  }
        ],
        reduction: {test:true},
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
    }

];

