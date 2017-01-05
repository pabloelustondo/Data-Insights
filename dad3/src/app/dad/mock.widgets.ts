/**
 * Created by 6pablo elustondo cd 201
 */
import { DadWidget, DadWidgetType} from './widget.component';
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"
import {TimeInterval} from "rxjs";

export const WIDGETS: DadWidget[] = [
  {id: 'widget1',
    name:'Device battery during shift',
    type: DadWidgetType.OneNumber,
    endpoint:'DevicesNotSurvivedShift',
    metrics:[
      {
        Type: DadParameterType.Number,
        Name: "Device Not Lasted Shift",
        DataSource: "CountDevicesNotLastedShift",
        Value:null
      },
      {
        Type: DadParameterType.Number,
        Name: "Total Active",
        DataSource: "CountTotalActiveDevices",
        Value: null
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Lasted Shift",
        DataSource: "CountDevicesLastedShift",
        Value:null
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Charging Entire Shift",
        DataSource: "CountDevicesChargingEntireShift",
        Value:null
      }
    ],
    parameters: [
  {
    shiftStartDateTime:"2016-08-25T09:00:00",
    shiftDuration: "12.5",
    minimumBatteryPercentageThreshold: 20
  }],
  uiparameters: [
  {
    Type: DadParameterType.DateTime,
    Name: "Shift Start",
    DataSource: "shiftStartDateTime",
    Value:"2000-08-25T01:01"
  },
    {
      Type: DadParameterType.Duration,
      Name: "Shift Duration",
      DataSource: "shiftDuration",
      Value:"01:01"
    },
    {
      Type: DadParameterType.Number,
      Name: "Min Battery",
      DataSource: "minimumBatteryPercentageThreshold",
      Value:25
    }
  ]
  },
  {id: 'widget2',
    name:'Device battery during shift',
    type: DadWidgetType.OneNumber,
    endpoint:'DevicesNotSurvivedShift',
    metrics:[
      {
        Type: DadParameterType.Number,
        Name: "Device Not Lasted Shift",
        DataSource: "CountDevicesNotLastedShift",
        Value:null
      },
      {
        Type: DadParameterType.Number,
        Name: "Total Active",
        DataSource: "CountTotalActiveDevices",
        Value: null
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Lasted Shift",
        DataSource: "CountDevicesLastedShift",
        Value:null
      },
      {
        Type: DadParameterType.Number,
        Name: "Device Charging Entire Shift",
        DataSource: "CountDevicesChargingEntireShift",
        Value:null
      }
    ],
    parameters: [
      {
        shiftStartDateTimeAuto:"yesterday",
        shiftStartDateTime:"2016-08-25T09:00:00",
        shiftDuration: "12.5",
        minimumBatteryPercentageThreshold: 20
      }],
    uiparameters: [
      {
        Type: DadParameterType.DateTime,
        Name: "Shift Start",
        DataSource: "shiftStartDateTime",
        Value:"2000-08-25T01:01"
      },
      {
        Type: DadParameterType.Duration,
        Name: "Shift Duration",
        DataSource: "shiftDuration",
        Value:"01:01"
      },
      {
        Type: DadParameterType.Number,
        Name: "Min Battery",
        DataSource: "minimumBatteryPercentageThreshold",
        Value:25
      }
    ]
  }



];
