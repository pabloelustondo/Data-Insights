/**
 * Created by dister on 12/14/2016.
 */
import { DadTable } from './table.component';
import { DadTableColumn, DadTableColumnType  } from "./table.model"

export const TABLES: DadTable[] = [
  {id: 'table1',
    name:'List of Devices that did not last a shift',
    endpoint:'ListOfDevicesNotSurvivedShift',
    parameters: [
      {
        shiftDuration:8,
        rowsSkip:0,
        rowsTake:100,
        shiftStartDateTime:"2016-08-15"
      }],
    columns: [
      {
        Type: DadTableColumnType.Number,
        Name: "Device Id",
        DataSource: "DevId"
      },
      {
        Type: DadTableColumnType.String,
        Name: "Battery Status",
        DataSource: "LastBatteryStatus"
      },
      {
        Type: DadTableColumnType.MiniChart,
        Name: "Battery Charge History",
        DataSource: "BatteryChargeHistory"
      }
    ]
  }
];
