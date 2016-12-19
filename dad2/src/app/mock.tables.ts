/**
 * Created by dister on 12/14/2016.
 */
import { DadTable } from './table.component';

export const TABLES: DadTable[] = [
  {id: 'table1',
    name:'List of Devices that did not last a shift',
    endpoint:'ListOfDevicesNotSurvivedShift',
    a : 'DevId',
    b : 'LastBatteryStatus',
    parameters: [
      {
        shiftDuration:8,
        rowsSkip:0,
        rowsTake:100,
        shiftStartDateTime:"2016-08-15"
      }]
  }
];

