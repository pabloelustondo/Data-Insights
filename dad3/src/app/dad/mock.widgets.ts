/**
 * Created by 6pablo elustondo cd 201
 */
import { DadWidget, DadWidgetType} from './widget.component';
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"

export const WIDGETS: DadWidget[] = [
  {id: 'widget1',
    name:'Device battery during shift',
    type: 0,
    endpoint:'DevicesNotSurvivedShift',
    metrics:[
      {
        Type: DadParameterType.Number,
        Name: "Device Not Lasted Shift",
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
      Type: DadParameterType.String,
      Name: "Date Time Type",
      DataSource: "shiftStartDateTimeAuto"
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
    endpoint:'DevicesNotSurvivedShift',
    metrics:[
      {
        Type: DadParameterType.Number,
        Name: "Device Not Lasted Shift",
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
        shiftStartDateTimeAuto:"yesterday",
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
  {id: 'widget3',
    name:'Device battery during shift',
    type: 0,
    endpoint:'DevicesNotSurvivedShift',
    metrics:[
      {
        Type: DadParameterType.Number,
        Name: "Device Not Lasted Shift",
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
    endpoint:'BatteryMetrics',
    metrics:[
      {
        Type: DadParameterType.String,
        Name: "Device Not Fully Charged",
        DataSource: "countDeviceNotFullyChargedBeforeShift"
      },
      {
        Type: DadParameterType.String,
        Name: "Total Active Devices",
        DataSource: "totalActiveDevices"
      }
    ],
    metricName: "DevicesDidNotLastShift",
    predicates: ["batteryNotFullyChargedBeforeShift"],
    parameters: [
      {
        parameterName: "string",
        parameterValue:"string"
      }],
    uiparameters: [
      {
        Type: DadParameterType.String,
        Name: "Device Not Fully Charged",
        DataSource: "parameterName"
      },
      {
        Type: DadParameterType.String,
        Name: "Total Active Devices",
        DataSource: "parameterValue"
      }
    ]
  }

];
