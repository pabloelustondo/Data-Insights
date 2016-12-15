/**
 * Created by dister on 12/14/2016.
 */
import { DadWidget } from './widget.component';

export const WIDGETS: DadWidget[] = [
  {id: 'widget1',
    name:'Not Lasted Shift',
    endpoint:'DevicesNotSurvivedShift',
    a : 'CountDevicesNotLastedShift',
    b : 'TotalActiveDevices',
    parameters: [
      {
        startTime: "9",
        duration: "30",
        date: "2016-08-25"
      }],
   chart: {id: "chartbarmini2",
    name: 'Range of Battery vs. Number of Devices',
    type: "bar",
    endpoint: "InitialChargeLevels",
    a : 'Rng',
    b : 'NumberOfDevices',
    width: 200,
    height: 200,
    mini:true,
    parameters: [
      {parameterType:"DateRange",
        dateFrom: "2016-08-23",
        dateTo: "2016-08-25"
      }]
  }
  }
];
