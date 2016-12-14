/**
 * Created by dister on 12/14/2016.
 */
import { DadWidget } from './widget.component';

export const WIDGETS: DadWidget[] = [
  {id: "widget1",
    name: 'Range of Battery vs. Number of Devices',
    type: "bar",
    endpoint: "InitialChargeLevels",
    a : 'Rng',
    b : 'NumberOfDevices',
    parameters: [
      {parameterType:"DateRange",
        dateFrom: "2016-08-23",
        dateTo: "2016-08-25"
      }]
  },

  {id: "widget2",
    name: 'Range of Battery vs. Number of Devices',
    type: "bar",
    endpoint: "InitialChargeLevels",
    a : 'Rng',
    b : 'NumberOfDevices',
    parameters: [
      {parameterType:"DateRange",
        dateFrom: "2016-08-23",
        dateTo: "2016-08-25"
      }]
  },

  ];
