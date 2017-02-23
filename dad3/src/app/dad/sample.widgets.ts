/**
 * Created by 6pablo elustondo cd 201
 */
import { DadWidget, DadWidgetType} from './widget.component';
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"
import {TABLES} from './sample.tables'

export const WIDGETS: DadWidget[] = [
  {id: 'widget1',
    name:'Device battery during shift',
    type: 0,
    tableId: 'table1',
    endpoint:'DevicesNotSurvivedShift',
    drillTo: 'chartbardrill',
    data:[{
      CountDevicesNotLastedShift:50,
      CountTotalActiveDevices: 100,
      CountDevicesLastedShift: 40,
      CountDevicesChargingEntireShift: 10
    }],
    metrics:[
      {
        Type: DadParameterType.Number,
        Name: "Devices Not Lasted a Shift",
        DataSource: "CountDevicesNotLastedShift"
      },
      {
        Type: DadParameterType.Number,
        Name: "Total Active",
        DataSource: "CountTotalActiveDevices"
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Lasted Shift",
        DataSource: "CountDevicesLastedShift"
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Charging Entire Shift",
        DataSource: "CountDevicesChargingEntireShift"
      }
    ],
    parameters: [
  {
    shiftStartDateTimeAuto:"custom",
    shiftStartDateTime:"2016-08-15T13:00:00.000Z",
    shiftDuration: "8",
    minimumBatteryPercentageThreshold: 20
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
  {id: 'widget2',
    name:'Device battery during shift',
    type: 0,
    tableId: "table1",
    endpoint:'DevicesNotSurvivedShift',
    drillTo: 'chartpiedrill',
    data:[{
      CountDevicesNotLastedShift:60,
      CountTotalActiveDevices: 120,
      CountDevicesLastedShift: 55,
      CountDevicesChargingEntireShift: 15
    }],
    metrics:[
      {
        Type: DadParameterType.Number,
        Name: "Devices Not Lasted a Shift",
        DataSource: "CountDevicesNotLastedShift"
      },
      {
        Type: DadParameterType.Number,
        Name: "Total Active",
        DataSource: "CountTotalActiveDevices"
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Lasted Shift",
        DataSource: "CountDevicesLastedShift"
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Charging Entire Shift",
        DataSource: "CountDevicesChargingEntireShift"
      }
    ],
    parameters: [
      {
        shiftStartDateTime:"2016-08-25T13:00:00.000Z",
        shiftDuration: "8",
        minimumBatteryPercentageThreshold: 20
      }],
    uiparameters: [
      {
        Type: DadParameterType.DateTime,
        Name: "Shift Start",
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
  {id: 'widget3',
    name:'Devices Not Lasted a Shift',
    type: 0,
    tableId: "table1",
    endpoint:'DevicesNotSurvivedShift',
    data:[{
      CountDevicesNotLastedShift:50,
      CountTotalActiveDevices: 90,
      CountDevicesLastedShift: 45,
      CountDevicesChargingEntireShift: 20
    }],
    metrics:[
      {
        Type: DadParameterType.Number,
        Name: "Devices Not Lasted Shift",
        DataSource: "CountDevicesNotLastedShift"
      },
      {
        Type: DadParameterType.Number,
        Name: "Total Active",
        DataSource: "CountTotalActiveDevices"
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Lasted Shift",
        DataSource: "CountDevicesLastedShift"
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Charging Entire Shift",
        DataSource: "CountDevicesChargingEntireShift"
      }
    ],
    parameters: [
      {
        shiftStartDateTimeAuto:"custom",
        shiftStartDateTime:"2016-08-25T13:00:00.000Z",
        shiftDuration: "8",
        minimumBatteryPercentageThreshold: 20
      }],
    uiparameters: [
      {
        Type: DadParameterType.String,
        Name: "Date Time Type",
        DataSource: "shiftStartDateTimeAuto"
      },
      {
        Type: DadParameterType.DateTime,
        Name: "Shift Start",
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
  {id: 'widget4',
    name:'Battery Metrics',
    type: 0,
    tableId: 'table1',
    endpoint:'BatteryMetrics',
    data:[{
      CountDevicesNotLastedShift:200,
      CountDevicesNotFullyCharged: 80,
    }],
    metrics:[
      {
        Type: DadParameterType.String,
        Name: "Devices Not Fully Charged",
        DataSource: "CountDevicesNotFullyCharged"
      },
      {
        Type: DadParameterType.String,
        Name: "Total Devices Not Lasted Shift",
        DataSource: "CountDevicesNotLastedShift"
      }
    ],
    metricName: "DevicesDidNotLastShift",
    predicates: ["batteryNotFullyChargedBeforeShift"],
    parameters:[
      {
        shiftStartDateTime: "2016-08-24T19:19:26.581Z",
        endDate: "2016-08-25T19:19:26.581",
        shiftDuration: 8,
        minimumBatteryPercentageThreshold: 20

      }],
    uiparameters: [
      {
        Type: DadParameterType.DateTime,
        Name: "Shift Start Date & Time",
        DataSource: "shiftStartDateTime"
      },
      {
        Type: DadParameterType.Date,
        Name: "End Date",
        DataSource: "endDate"
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
  {id: 'widget_chart1',
    name:'Application Count by Number of Devices',
    type: 1,
    endpoint: "ApplicationDeploymentCount",
    data: [
      {
        "ExecutionTimeMinutes": 41628,
        "AppId": "android",
        "NumberOfDevices": 127
      },
      {
        "ExecutionTimeMinutes": 43,
        "AppId": "com.ebay.mobile",
        "NumberOfDevices": 156
      },
      {
        "ExecutionTimeMinutes": 55000,
        "AppId": "soti",
        "NumberOfDevices": 189
      }
    ],
    parameters:[
      {
        dateFrom: "2017-01-24T20:30:21",
        dateTo: "2017-01-25T20:30:21"
      }],
    uiparameters: [
      {
        Type: DadParameterType.DateTime,
        Name: "Date From",
        DataSource: "dateFrom"
      },
      {
        Type: DadParameterType.Date,
        Name: "Date To",
        DataSource: "dateTo"
      }
    ],
    chart:{id: "charthorizontal",
      type: "bar",
      a : 'ExecutionTimeMinutes',
      b : 'AppId',
      aname : 'Execution Minutes',
      bname : 'Application ID',
      width: 275,
      height: 250,
      embeddedChart: true,
      horizontal: true,
      action: 'grow',
      transformations : [{sort: true}, {top:5}]
      }
  },
  {id: 'widget_chart2',
    name:'Application Popularity',
    type: 1,
    endpoint: "NumberOfInstallations",
    data: [
      {
        "NumberOfInstallations": 2923,
        "AppId": "com.amazon.windowshop"
      },
      {
        "NumberOfInstallations": 2922,
        "AppId": "com.brainium.solitairefree"
      },
      {
        "NumberOfInstallations": 2912,
        "AppId": "com.game.BubbleShooter"
      }
    ],
    parameters:[
      {
        dateFrom: "2017-01-24T20:30:21",
        dateTo: "2017-01-27T20:30:21"
      }],
    uiparameters: [
      {
        Type: DadParameterType.DateTime,
        Name: "Date From",
        DataSource: "dateFrom"
      },
      {
        Type: DadParameterType.Date,
        Name: "Date To",
        DataSource: "dateTo"
      }
    ],
    chart:{id: "charthorizontal2",
      type: "bar",
      a : 'NumberOfInstallations',
      b : 'AppId',
      aname : 'Number Of Installations',
      bname : 'Application ID',
      width: 275,
      height: 250,
      embeddedChart: true,
      horizontal: true,
      action: 'grow',
      transformations : [{sort: true}, {top:5}]
    }
  }
];
