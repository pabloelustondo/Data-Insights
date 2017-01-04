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
        Name: "Devices not lasted shift",
        DataSource: "CountDevicesNotLastedShift",
        Value:null
      },
      {
        Type: DadParameterType.Number,
        Name: "Total Active Devices",
        DataSource: "CountTotalActiveDevices",
        Value:null
      },
      {
        Type: DadParameterType.Number,
        Name: "Devices lasted shift",
        DataSource: "CountDevicesLastedShift",
        Value:null
      },
      {
        Type: DadParameterType.Number,
        Name: "Devices charging entire shift",
        DataSource: "CountDevicesChargingEntireShift",
        Value:null
      }
    ],
    parameters: [
  {
    shiftStartDateTime:"2016-08-25T09:00",
    shiftDuration: "12.5",
    minimumBatteryPercentageThreshold: 40
  }],
  uiparameters: [
  {
    Type: DadParameterType.DateTime,
    Name: "Shift Start",
    DataSource: "shiftStartDateTime",
    Value:"2016-08-15T07:00"
  },
    {
      Type: DadParameterType.Duration,
      Name: "Shift Duration",
      DataSource: "shiftDuration",
      Value:"08:00"
    },
    {
      Type: DadParameterType.Number,
      Name: "Min Battery",
      DataSource: "minimumBatteryPercentageThreshold",
      Value:5
    }
  ]
  },

  {id: 'widget2',
    name:'Widget Example',
    type: DadWidgetType.Example,
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
        Value:null
      }
    ],
    parameters: [
      {
        shiftStartDateTime:"2016-08-25T09:00",
        shiftDuration: "12.5",
        minimumBatteryPercentageThreshold: 40
      }],
    uiparameters: [
      {
        Type: DadParameterType.DateTime,
        Name: "Shift Start",
        DataSource: "shiftStartDateTime",
        Value:"2016-08-25T09:00"
      },
      {
        Type: DadParameterType.Duration,
        Name: "Shift Duration",
        DataSource: "shiftDuration",
        Value:"12:30"
      },
      {
        Type: DadParameterType.Number,
        Name: "Min Battery",
        DataSource: " minimumBatteryPercentageThreshold",
        Value:40
      }
    ]
  }


];
