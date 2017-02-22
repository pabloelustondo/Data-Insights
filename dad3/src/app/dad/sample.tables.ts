/**
 * Created by pablo elustondo on 12/14/2016.
 */
import { DadTable } from './table.component';
import { DadTableColumn, DadTableColumnType  } from "./table.model"

export const TABLES: DadTable[] = [
  { id: 'table1',
    name:'List of Devices That Did Not Last a Shift',
    endpoint:'ListOfDevicesNotSurvivedShift',
    data:[
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:10, BatteryChargeHistory:JSON.stringify([5,6,5,7,8,9]),os:'iOS', brand:'Apple' },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:11, BatteryChargeHistory:JSON.stringify([5,6,6,7,8,9]),os:'iOS', brand:'Apple'  },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:9, BatteryChargeHistory:JSON.stringify([5,6,7,7,8,9]),os:'Android', brand:'Samsung' },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:8, BatteryChargeHistory:JSON.stringify([5,6,8,7,8,9]),os:'Android', brand:'Samsung'  },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:7, BatteryChargeHistory:JSON.stringify([5,6,9,7,8,9]),os:'Android', brand:'Google'  },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:30, BatteryChargeHistory:JSON.stringify([5,6,10,7,8,9]),os:'Android', brand:'LG'  },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,11,7,8,9]),os:'Android', brand:'LG'  },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,12,7,8,9]),os:'Android', brand:'Motorola'  },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:50, BatteryChargeHistory:JSON.stringify([5,6,13,7,8,9]),os:'Android', brand:'Blackberry'  },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:90, BatteryChargeHistory:JSON.stringify([5,6,14,7,8,9]),os:'Windows', brand:'Nokia'  },
      {DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:95, BatteryChargeHistory:JSON.stringify([5,6,15,7,8,9]),os:'Android', brand:'Samsung'  }
    ],
    parameters: [
      {
        shiftDuration:8,
        rowsSkip:0,
        rowsTake:10,
        shiftStartDateTime:"2016-08-25",
        minimumBatteryPercentageThreshold:20
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
                    name:"",
                    type: "bar",
                    width: 150,
                    height: 30,
                    mini:true
                  }
      }
    ]
  },

  { id: 'table2',
    name:'List of Devices That Did Not Last a Shift and Battery Not Fully Charged',
    endpoint:'ListOfDevicesNotSurvivedShift',
    parameters: [
      {
        shiftDuration:10,
        rowsSkip:0,
        rowsTake:10,
        shiftStartDateTime:"2016-08-25T08:00",
        minimumBatteryPercentageThreshold:30
      }],
    columns: [
      {
        Type: DadTableColumnType.Number,
        Name: "Device Id",
        DataSource: "DevId"
      },
      {
        Type: DadTableColumnType.String,
        Name: "Last Known Battery Status",
        DataSource: "LastBatteryStatus"
      }
    ]
  }
];
