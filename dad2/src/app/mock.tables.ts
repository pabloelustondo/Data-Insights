/**
 * Created by dister on 12/14/2016.
 */
import { DadTable } from './table.component';
import { DadTableColumn, DadTableColumnType  } from "./table.model"

export const TABLES: DadTable[] = [
  { id: 'table1',
    name:'List of Devices that did not last a shift',
    endpoint:'ListOfDevicesNotSurvivedShift',
    parameters: [
      {
        shiftDuration:8,
        rowsSkip:0,
        rowsTake:100,
        shiftStartDateTime:"2016-08-25"
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
        DataSource: "BatteryChargeHistory",
        MiniChart: {id: "charttable1",
                    name: 'Range of Battery calling with date',
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
                    data:[
                      {NumberOfDevices: "2",
                        Percentage: "0.00236127508854781",
                        Rng: "11-20"},
                      {NumberOfDevices:"5",
                        Percentage: "0.00590318772136953",
                        Rng: "21-30"},
                      {NumberOfDevices:"20",
                        Percentage: "0.00590318772136953",
                        Rng: "31-40"},
                      {NumberOfDevices:"10",
                        Percentage: "0.00590318772136953",
                        Rng: "41-50"},
                      {NumberOfDevices:"34",
                        Percentage: "0.00590318772136953",
                        Rng: "51-60"},
                      {NumberOfDevices:"67",
                        Percentage: "0.00590318772136953",
                        Rng: "61-70"},
                      {NumberOfDevices:"147",
                        Percentage: "0.00590318772136953",
                        Rng: "71-80"}
                    ],
                    mini:true
                  }
      }
    ]
  }
];
