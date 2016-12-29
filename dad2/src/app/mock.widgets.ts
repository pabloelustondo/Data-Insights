/**
 * Created by 6pablo elustondo cd 201
 */
import { DadWidget } from './widget.component';
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"

export const WIDGETS: DadWidget[] = [
  {id: 'widget1',
    name:'Number of Devices that Did Not Last the Shift',
    endpoint:'DevicesNotSurvivedShift',
    metrics:[
      {
        Type: DadParameterType.Number,
        Name: "#devices not lasted",
        DataSource: "CountDevicesNotLastedShift",
        Value:null,
        Dimensions: [
          {
            Type: DadDimensionType.Number,
            Name: "By Dimension 1",
            DataSource: "Dim1",
            Value:null
          },
          {
            Type: DadDimensionType.Number,
            Name: "By Dimension 2",
            DataSource: "Dim2",
            Value: null
          }
        ]
      },
      {
        Type: DadParameterType.Number,
        Name: "#total active devices ",
        DataSource: "CountTotalActiveDevices",
        Value:null,
        Dimensions: [
          {
            Type: DadDimensionType.Number,
            Name: "By Dimension 1",
            DataSource: "Dim1",
            Value:null
          },
          {
            Type: DadDimensionType.Number,
            Name: "By Dimension 2",
            DataSource: "Dim2",
            Value: null
          }
        ]
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
    Type: DadParameterType.Date,
    Name: "Shift Start Date Time",
    DataSource: "shiftStartDateTime"
  }]
  }
];
