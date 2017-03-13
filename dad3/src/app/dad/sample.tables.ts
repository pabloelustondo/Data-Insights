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
      {DevId:'vzfsvzfsvzfsvz0', LastBatteryStatus:10, BatteryChargeHistory:JSON.stringify([5,6,5,7,8,9]),os:'iOS', brand:'Apple', model: "iPhone 6" , carrier: "Fido"},
      {DevId:'vzfsvzfsvzfsvz1', LastBatteryStatus:11, BatteryChargeHistory:JSON.stringify([5,6,6,7,8,9]),os:'iOS', brand:'Apple', model: "iPhone 6", carrier:  "Rogers" },
      {DevId:'vzfsvzfsvzfsvz2', LastBatteryStatus:9, BatteryChargeHistory:JSON.stringify([5,6,7,7,8,9]),os:'Android', brand:'Samsung', model: "Galaxy S7", carrier: "Fido" },
      {DevId:'vzfsvzfsvzfsvz3', LastBatteryStatus:8, BatteryChargeHistory:JSON.stringify([5,6,8,7,8,9]),os:'Android', brand:'Samsung', model: "Note 7", carrier: "Wind"  },
      {DevId:'vzfsvzfsvzfsvz4', LastBatteryStatus:7, BatteryChargeHistory:JSON.stringify([5,6,9,7,8,9]),os:'Android', brand:'Google', model: "Nexus 6", carrier: "Rogers"  },
      {DevId:'vzfsvzfsvzfsvz5', LastBatteryStatus:30, BatteryChargeHistory:JSON.stringify([5,6,10,7,8,9]),os:'Android', brand:'LG', model: "G5", carrier:  "TELUS" },
      {DevId:'vzfsvzfsvzfsvz6', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,11,7,8,9]),os:'Android', brand:'LG', model: "G4", carrier:  "Bell" },
      {DevId:'vzfsvzfsvzfsvz7', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,12,7,8,9]),os:'Android', brand:'Motorola', model: "Z Force Droid", carrier: "Bell"  },
      {DevId:'vzfsvzfsvzfsvz8', LastBatteryStatus:50, BatteryChargeHistory:JSON.stringify([5,6,13,7,8,9]),os:'Android', brand:'Blackberry', model: "Bold", carrier:  "chatr" },
      {DevId:'vzfsvzfsvzfsvz9', LastBatteryStatus:90, BatteryChargeHistory:JSON.stringify([5,6,14,7,8,9]),os:'Windows', brand:'Nokia', model: "3310", carrier:  "Sears Connect" },
      {DevId:'vzfsvzfsvzfsvz10', LastBatteryStatus:95, BatteryChargeHistory:JSON.stringify([5,6,15,7,8,9]),os:'Android', brand:'Samsung', model: "S5", carrier:  "Sears Connect"  }
    ],
    parameters: [
      {
        shiftDuration:8,
        rowsSkip:0,
        rowsTake:1000,
        shiftStartDateTime:"2016-08-25",
        minimumBatteryPercentageThreshold:20
      }],
    columns: [
      {
        Type: "Number",
        Name: "Device Id",
        DataSource: "DevId"
      },
      {
        Type: "Number",
        Name: "Battery Status",
        DataSource: "LastBatteryStatus"
      },
      {
        Type: "String",
        Name: "Manufacturer",
        DataSource: "brand"
      },
      {
        Type: "String",
        Name: "Model",
        DataSource: "model"
      },
      {
        Type: "String",
        Name: "OS",
        DataSource: "os",
      },
      {
        Type: "String",
        Name: "Carrier Network",
        DataSource: "carrier",
      },
      {
        Type: "MiniChart",
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
    data:[
      {DevId:'vzfsvzfsvzfsvz0', LastBatteryStatus:10, BatteryChargeHistory:JSON.stringify([5,6,5,7,8,9]),os:'iOS', brand:'Apple', model: "iPhone 6" , carrier: "Fido"},
      {DevId:'vzfsvzfsvzfsvz1', LastBatteryStatus:11, BatteryChargeHistory:JSON.stringify([5,6,6,7,8,9]),os:'iOS', brand:'Apple', model: "iPhone 6", carrier:  "Rogers" },
      {DevId:'vzfsvzfsvzfsvz2', LastBatteryStatus:9, BatteryChargeHistory:JSON.stringify([5,6,7,7,8,9]),os:'Android', brand:'Samsung', model: "Galaxy S7", carrier: "Fido" },
      {DevId:'vzfsvzfsvzfsvz3', LastBatteryStatus:8, BatteryChargeHistory:JSON.stringify([5,6,8,7,8,9]),os:'Android', brand:'Samsung', model: "Note 7", carrier: "Wind"  },
      {DevId:'vzfsvzfsvzfsvz4', LastBatteryStatus:7, BatteryChargeHistory:JSON.stringify([5,6,9,7,8,9]),os:'Android', brand:'Google', model: "Nexus 6", carrier: "Rogers"  },
      {DevId:'vzfsvzfsvzfsvz5', LastBatteryStatus:30, BatteryChargeHistory:JSON.stringify([5,6,10,7,8,9]),os:'Android', brand:'LG', model: "G5", carrier:  "TELUS" },
      {DevId:'vzfsvzfsvzfsvz6', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,11,7,8,9]),os:'Android', brand:'LG', model: "G4", carrier:  "Bell" },
      {DevId:'vzfsvzfsvzfsvz7', LastBatteryStatus:40, BatteryChargeHistory:JSON.stringify([5,6,12,7,8,9]),os:'Android', brand:'Motorola', model: "Z Force Droid", carrier: "Bell"  },
      {DevId:'vzfsvzfsvzfsvz8', LastBatteryStatus:50, BatteryChargeHistory:JSON.stringify([5,6,13,7,8,9]),os:'Android', brand:'Blackberry', model: "Bold", carrier:  "chatr" },
      {DevId:'vzfsvzfsvzfsvz9', LastBatteryStatus:90, BatteryChargeHistory:JSON.stringify([5,6,14,7,8,9]),os:'Windows', brand:'Nokia', model: "3310", carrier:  "Sears Connect" },
      {DevId:'vzfsvzfsvzfsvz10', LastBatteryStatus:95, BatteryChargeHistory:JSON.stringify([5,6,15,7,8,9]),os:'Android', brand:'Samsung', model: "S5", carrier:  "Sears Connect"  }
    ],
    parameters: [
      {
        shiftDuration:10,
        rowsSkip:0,
        rowsTake:1000,
        shiftStartDateTime:"2016-08-25T08:00",
        minimumBatteryPercentageThreshold:30
      }],
    columns: [
      {
        Type: "Number",
        Name: "Device Id",
        DataSource: "DevId"
      },
      {
        Type: "Number",
        Name: "Last Known Battery Status",
        DataSource: "LastBatteryStatus"
      }
    ]
  }
];
