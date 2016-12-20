/**
 * Created by dister on 2016-12-06.
 */
import { DadChart } from './chart.component';

export const CHARTS: DadChart[] = [
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
      }]
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
      }]
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
      }]
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
      }]
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
      }]
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
      }]
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
      }]
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
       }]
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
       }]
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
       }]
    }
];

