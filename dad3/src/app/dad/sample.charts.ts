/**
 * Created by pablo elustondo on 2016-12-06.
 */
import { DadChart } from './chart.component';
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"
import { DadMap } from './map.component';

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
        data: [{"countOfDevices":56,"percentage":5},{"countOfDevices":112,"percentage":10},
            {"countOfDevices":20,"percentage":15},{"countOfDevices":6,"percentage":20},
            {"countOfDevices":3,"percentage":25},{"countOfDevices":0,"percentage":30},
            {"countOfDevices":1,"percentage":35},{"countOfDevices":1,"percentage":40},
            {"countOfDevices":2,"percentage":45},{"countOfDevices":0,"percentage":50},
            {"countOfDevices":0,"percentage":55},{"countOfDevices":0,"percentage":60},
            {"countOfDevices":0,"percentage":65},{"countOfDevices":0,"percentage":70},
            {"countOfDevices":0,"percentage":75},{"countOfDevices":0,"percentage":80},
            {"countOfDevices":0,"percentage":85},{"countOfDevices":0,"percentage":90},
            {"countOfDevices":0,"percentage":95},{"countOfDevices":0,"percentage":100}
        ],
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
        name: 'Application Count by Number of Devices',
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
        action: 'drillFromElement',
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
        data: [
            {
                "NumberOfInstallations": 41628,
                "AppId": "android"
            },
            {
                "NumberOfInstallations": 4300,
                "AppId": "com.ebay.mobile"
            },
            {
                "NumberOfInstallations": 60000,
                "AppId": "soti"
            }
        ],
        action: 'drillFromElement',
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
        endpoint:'ListOfDevicesNotSurvivedShift',
        data:[
            {DevId:'vzfsvzfsvzfsvz0', LastBatteryStatus:10, BatteryChargeHistory:JSON.stringify([5,6,5,7,8,9]),os:'iOS', brand:'Apple', model: "iPhone 6" , carrier: "Fido", explodes:"no"},
            {DevId:'vzfsvzfsvzfsvz1', LastBatteryStatus:11, BatteryChargeHistory:JSON.stringify([5,6,6,7,8,9]),os:'iOS', brand:'Apple', model: "iPhone 6", carrier:  "Rogers", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz2', LastBatteryStatus:9, BatteryChargeHistory:JSON.stringify([5,6,7,7,8,9]),os:'Android', brand:'Samsung', model: "Galaxy S7", carrier: "Fido", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz3', LastBatteryStatus:8, BatteryChargeHistory:JSON.stringify([5,6,8,7,8,9]),os:'Android', brand:'Samsung', model: "Note 7", carrier: "Wind" , explodes:"yes" },
            {DevId:'vzfsvzfsvzfsvz4', LastBatteryStatus:7, BatteryChargeHistory:JSON.stringify([5,6,9,7,8,9]),os:'Android', brand:'Google', model: "Nexus 6", carrier: "Rogers", explodes:"no"  },
            {DevId:'vzfsvzfsvzfsvz5', LastBatteryStatus:30, BatteryChargeHistory:JSON.stringify([5,6,10,7,8,9]),os:'Android', brand:'LG', model: "G5", carrier:  "TELUS", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz6', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,11,7,8,9]),os:'Android', brand:'LG', model: "G4", carrier:  "Bell", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz7', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,12,7,8,9]),os:'Android', brand:'Motorola', model: "Z Force Droid", carrier: "Bell" , explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz8', LastBatteryStatus:50, BatteryChargeHistory:JSON.stringify([5,6,13,7,8,9]),os:'Android', brand:'Blackberry', model: "Bold", carrier:  "chatr", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz9', LastBatteryStatus:90, BatteryChargeHistory:JSON.stringify([5,6,14,7,8,9]),os:'Windows', brand:'Nokia', model: "3310", carrier:  "Sears Connect", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz10', LastBatteryStatus:95, BatteryChargeHistory:JSON.stringify([5,6,15,7,8,9]),os:'Android', brand:'Samsung', model: "S5", carrier:  "Sears Connect", explodes:"no"   }
        ],
        reduction:{
            dimension: {attribute: 'os', name:'OS'},
            metric: {attribute:'DevId', op:'count', name:'Number of Devices'}},
        reductions:[
            {dimension: {attribute: 'model', name:'Model'},
                metric: {attribute:'DevId', op:'count', name:'Number of Devices'}},

            {dimension: {attribute: 'carrier', name:'Carrier'},
                metric: {attribute:'DevId', op:'count', name:'Number of Devices'}},

            {dimension: {attribute: 'brand', name:'Brand'},
                metric: {attribute:'DevId', op:'count', name:'Number of Devices'}},

            {dimension: {attribute: 'os', name:'OS'},
                metric: {attribute:'LastBatteryStatus', op:'avg', name:'Average Battery Status'}}
            ],
        dimensions:[
            {attribute: 'model', name:'Model'},
            {attribute: 'carrier', name:'Carrier'},
            {attribute: 'brand', name:'Brand'},
            {attribute: 'os', name:'OS'}
        ],
        metrics:[
            {attribute:'DevId', op:'count', name:'Number of Devices'},
            {attribute:'LastBatteryStatus', op:'avg', name:'Average Battery Status'}
        ],
        a : 'countOfDevices',
        b : 'percentage',
        aname : 'Count Of Devices',
        bname : 'Percentage',
        width: 475,
        height: 400,
        tableId: 'table1',
        action: 'drillFromElement',
        parameters: [
            {
                shiftDuration:8,
                rowsSkip:0,
                rowsTake:1000,
                shiftStartDateTime:"2016-08-25",
                minimumBatteryPercentageThreshold:20
            }],
        uiparameters: [
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
            {
                Type: DadParameterType.Number,
                Name: "Min Battery",
                DataSource: "minimumBatteryPercentageThreshold"
            }
        ]
    },

    {id: "chartpiedrill",
        name: 'Devices & Battery Performance',
        type: "pie",
        endpoint:'ListOfDevicesNotSurvivedShift',
        data:[
            {DevId:'vzfsvzfsvzfsvz0', LastBatteryStatus:10, BatteryChargeHistory:JSON.stringify([5,6,5,7,8,9]),os:'iOS', brand:'Apple', model: "iPhone 6" , carrier: "Fido", explodes:"no"},
            {DevId:'vzfsvzfsvzfsvz1', LastBatteryStatus:11, BatteryChargeHistory:JSON.stringify([5,6,6,7,8,9]),os:'iOS', brand:'Apple', model: "iPhone 6", carrier:  "Rogers", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz2', LastBatteryStatus:9, BatteryChargeHistory:JSON.stringify([5,6,7,7,8,9]),os:'Android', brand:'Samsung', model: "Galaxy S7", carrier: "Fido", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz3', LastBatteryStatus:8, BatteryChargeHistory:JSON.stringify([5,6,8,7,8,9]),os:'Android', brand:'Samsung', model: "Note 7", carrier: "Wind" , explodes:"yes" },
            {DevId:'vzfsvzfsvzfsvz4', LastBatteryStatus:7, BatteryChargeHistory:JSON.stringify([5,6,9,7,8,9]),os:'Android', brand:'Google', model: "Nexus 6", carrier: "Rogers", explodes:"no"  },
            {DevId:'vzfsvzfsvzfsvz5', LastBatteryStatus:30, BatteryChargeHistory:JSON.stringify([5,6,10,7,8,9]),os:'Android', brand:'LG', model: "G5", carrier:  "TELUS", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz6', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,11,7,8,9]),os:'Android', brand:'LG', model: "G4", carrier:  "Bell", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz7', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,12,7,8,9]),os:'Android', brand:'Motorola', model: "Z Force Droid", carrier: "Bell" , explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz8', LastBatteryStatus:50, BatteryChargeHistory:JSON.stringify([5,6,13,7,8,9]),os:'Android', brand:'Blackberry', model: "Bold", carrier:  "chatr", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz9', LastBatteryStatus:90, BatteryChargeHistory:JSON.stringify([5,6,14,7,8,9]),os:'Windows', brand:'Nokia', model: "3310", carrier:  "Sears Connect", explodes:"no" },
            {DevId:'vzfsvzfsvzfsvz10', LastBatteryStatus:95, BatteryChargeHistory:JSON.stringify([5,6,15,7,8,9]),os:'Android', brand:'Samsung', model: "S5", carrier:  "Sears Connect", explodes:"no"   }
        ],
        reduction:{
            dimension: {attribute: 'os', name:'OS'},
            metric: {attribute:'DevId', op:'count', name:'Number of Devices'}},
        reductions:[
            {dimension: {attribute: 'os', name:'OS'},
                metric: {attribute:'DevId', op:'count', name:'Number of Devices'}},

            {dimension: {attribute: 'brand', name:'Brand'},
                metric: {attribute:'DevId', op:'count', name:'Number of Devices'}},

            {dimension: {attribute: 'model', name:'Model'},
                metric: {attribute:'DevId', op:'count', name:'Number of Devices'}},

            {dimension: {attribute: 'carrier', name:'Carrier'},
                metric: {attribute:'DevId', op:'count', name:'Number of Devices'}},
        ],
        dimensions:[
            {attribute: 'model', name:'Model'},
            {attribute: 'carrier', name:'Carrier'},
            {attribute: 'brand', name:'Brand'},
            {attribute: 'os', name:'OS'}
        ],
        metrics:[
            {attribute:'DevId', op:'count', name:'Number of Devices'}
        ],
        a : 'countOfDevices',
        b : 'percentage',
        aname : 'Count Of Devices',
        bname : 'Percentage',
        width: 475,
        height: 400,
        regionM: 30,
        tableId: 'table1',
        action: 'drillFromElement',
        parameters: [
            {
                shiftDuration:8,
                rowsSkip:0,
                rowsTake:1000,
                shiftStartDateTime:"2016-08-25",
                minimumBatteryPercentageThreshold:20
            }],
        uiparameters: [
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
            {
                Type: DadParameterType.Number,
                Name: "Min Battery",
                DataSource: "minimumBatteryPercentageThreshold"
            }
        ]
    },

    {id: "ttcmap",
        name: 'TTC Bus Position',
        type: "map",
        endpoint: "GetLocation",
        lon: 'lon',
        lat: 'lat',
        dataElement: 'vehicle',
        data: [{"id":"1049","lon":"-79.480515","routeTag":"79","predictable":"true","heading":"348","lat":"43.661732","secsSinceReport":"7850"},{"id":"8084","lon":"-79.566063","routeTag":"45","predictable":"true","heading":"161","lat":"43.710251","secsSinceReport":"7850"},{"id":"1406","lon":"-79.4149319","routeTag":"63","predictable":"true","heading":"350","lat":"43.641483","secsSinceReport":"7858"},{"id":"1344","lon":"-79.4412","routeTag":"109","predictable":"true","heading":"164","lat":"43.702301","secsSinceReport":"7853"},{"id":"8126","lon":"-79.290886","routeTag":"24","predictable":"true","heading":"340","lat":"43.697483","secsSinceReport":"7833"},{"id":"1600","lon":"-79.503036","routeTag":"52","predictable":"true","heading":"269","lat":"43.703049","secsSinceReport":"7857"},{"id":"4140","lon":"-79.467247","routeTag":"512","predictable":"true","heading":"253","lat":"43.6726","secsSinceReport":"7858"},{"id":"7698","lon":"-79.298103","routeTag":"43","predictable":"true","heading":"342","lat":"43.803902","secsSinceReport":"7852"},{"id":"4171","lon":"-79.451569","routeTag":"505","predictable":"true","heading":"281","lat":"43.653717","secsSinceReport":"7852"},{"id":"9102","lon":"-79.51825","routeTag":"36","predictable":"true","heading":"83","lat":"43.7570989","secsSinceReport":"7848"},{"id":"4023","lon":"-79.452385","routeTag":"505","predictable":"true","heading":"352","lat":"43.656067","secsSinceReport":"7856"},{"id":"1069","lon":"-79.257233","routeTag":"133","predictable":"true","heading":"216","lat":"43.774216","secsSinceReport":"7845"},{"id":"8555","lon":"-79.460503","routeTag":"84","predictable":"true","heading":"86","lat":"43.750751","secsSinceReport":"7866"},{"id":"7620","lon":"-79.290985","routeTag":"43","predictable":"true","heading":"163","lat":"43.789185","secsSinceReport":"7858"},{"id":"4078","lon":"-79.447037","routeTag":"504","predictable":"true","heading":"344","lat":"43.641033","secsSinceReport":"7859"},{"id":"7558","lon":"-79.323586","routeTag":"22","predictable":"true","heading":"343","lat":"43.683468","secsSinceReport":"7859"},{"id":"8604","lon":"-79.456863","routeTag":"84","predictable":"true","heading":"73","lat":"43.751549","secsSinceReport":"7864"}],
        parameters: [],
        uiparameters: [],
    }
];

