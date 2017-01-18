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
        parameters: [
            {
                dateFrom: "2016-11-29T20:30:21",
                dateTo: "2016-11-30T20:30:21",
                shiftStartDateTime: "2016-11-29T20:30:21",
                shiftDuration: 8
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
            },
            {
                Type: DadParameterType.DateTime,
                Name: "Shift Start Data & Time",
                DataSource: "shiftStartDateTime"
            },
            {
                Type: DadParameterType.Duration,
                Name: "Shift Duration",
                DataSource: "shiftDuration"
            },
            ],
    },
    /*
    //first endpoint
  {id: "chartbar0",
    name: 'Range of Battery vs. Number of Devices',
    type: "bar",
    endpoint: "InitialChargeLevels",
    a : 'Rng',
    b : 'NumberOfDevices',
    width: 475,
    height: 400,
    parameters: [
      {parameterType:"DateRange",
        dateFrom: "2016-08-23",
        dateTo: "2016-08-25"
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
          }],
  },
    //second endpoint
    {id: "chartbar2",
    name: 'Discharge Rate vs. Number of Devices',
    type: "bar",
    endpoint: "DischargeRate",
    a : 'NumberOfDevices',
    b : 'DischargeRate',
    width: 475,
    height: 400,
    parameters: [
      {parameterType:"DateRange",
       dateFrom: "2016-08-23",
       dateTo: "2016-08-25"
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
            }],
    },
    //first endpoint
    {id: "chartpie1",
    name: 'Range of Battery vs. Number of Devices',
    type:"pie",
    endpoint: "InitialChargeLevels",
    a : 'Rng',
    b : 'NumberOfDevices',
    width: 475,
    height: 400,
    parameters: [
      {parameterType:"DateRange",
       dateFrom: "2016-08-20",
       dateTo: "2016-08-25"
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
            }],
    },
    //second endpoint
    {id: "chartpie2",
    name: 'Discharge Rate vs. Number of Devices',
    type:"pie",
    endpoint: "DischargeRate",
    a : 'NumberOfDevices',
    b : 'DischargeRate',
    width: 475,
    height: 400,
    parameters: [
      {parameterType:"DateRange",
       dateFrom: "2016-08-23",
       dateTo: "2016-08-25"
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
            }],
    },
    //first endpoint
    {id: "chartdot1",
    name: 'Range of Battery vs. Number of Devices',
    endpoint: "InitialChargeLevels",
    a : 'Rng',
    b : 'NumberOfDevices',
    type: "dot",
    width: 475,
    height: 400,
    parameters: [
      {parameterType:"DateRange",
       dateFrom: "2016-08-15",
       dateTo: "2016-08-24"
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
            }],
    },
    //second endpoint
    {id: "chartdot2",
    name: 'Discharge Rate vs. Number of Devices',
    endpoint: "DischargeRate",
    a : 'NumberOfDevices',
    b : 'DischargeRate',
    type: "dot",
    width: 475,
    height: 400,
    parameters: [
      {parameterType:"DateRange",
       dateFrom: "2016-08-15",
       dateTo: "2016-08-24"
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
            }],
    },
    //first endpoint
    {id: "chartspline1",
    name: 'Range of Battery vs. Number of Devices',
    type: "spline",
    endpoint: "InitialChargeLevels",
    a : 'Rng',
    b : 'NumberOfDevices',
    width: 475,
    height: 400,
    parameters: [
      {parameterType:"DateRange",
       dateFrom: "2016-08-23",
       dateTo: "2016-08-24"
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
            }],
    },
    //second endpoint
    {id: "chartspline2",
     name: 'Discharge Rate vs. Number of Devices',
     type: "spline",
     endpoint: "DischargeRate",
     a : 'NumberOfDevices',
     b : 'DischargeRate',
    width: 475,
    height: 400,
     parameters: [
       {parameterType:"DateRange",
        dateFrom: "2016-08-23",
        dateTo: "2016-08-24"
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
            }],
    },
    //first endpoint
    {id: "chartdonut1",
     name: 'Range of Battery vs. Number of Devices',
     type: "donut",
     endpoint: "InitialChargeLevels",
     a : 'Rng',
     b : 'NumberOfDevices',
    width: 475,
    height: 400,
     parameters: [
       {parameterType:"DateRange",
        dateFrom: "2016-08-18",
        dateTo: "2016-08-25"
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
            }],
    },
    //second endpoint
    {id: "chartdonut2",
     name: 'Discharge Rate vs. Number of Devices',
     type: "donut",
     endpoint: "DischargeRate",
     a : 'NumberOfDevices',
     b : 'DischargeRate',
    width: 475,
    height: 400,
     parameters: [
       {parameterType:"DateRange",
       dateFrom: "2016-08-18",
       dateTo: "2016-08-25"
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
            }],
    }
*/
];

