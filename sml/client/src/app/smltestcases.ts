import { SmlDataSet, SmlParameter } from "../../../common/sml";

export class SMLDataSetTestCase {
  dataset: SmlDataSet;
  parameters?: SmlParameter[];

}

export const smltestcases: SMLDataSetTestCase[] = [

  {
    dataset:{
        id:"DevicesNotLastedShift_JS_FunctionTrue",
        from:[{id:"datasample1"}],
        parameters:[
         { name:"threshold",
           type:"Percent",
           value:10
         }
        ],
        transformations:[
          { type: "AddRowBasedFeature",
            def: {name:"DeviceNotLasted", func:"true" }}
        ]
    }
  },
  {
    dataset:{
      id:"DevicesNotLastedShift_JS_FunctionThreshold",
      from:[{id:"datasample1"}],
      parameters:[
        { name:"threshold",
          type:"Percent",
          value:10
        }
      ],
      transformations:[
        { type: "AddRowBasedFeature",
          def: {name:"DeviceNotLasted", func:"battery < threshold" }}
      ]
    }
  }
  ,
  {
    dataset:{
      id:"DevicesNotLastedShift_PY_FullScript",
      from:["devstasts1"],
      parameters:[
        { name:"threshold",
          type:"Percent",
          value:10
        }
      ],
      transformations:[
        {processData: {
          lang:"Python",
          code:`
          cols = data.select_dtypes(['object'])
          data[cols.columns] = cols.apply(lambda x: x.str.strip())
          data['time_stamp'] = pd.to_datetime(data['time_stamp'], format='%Y-%m-%d %H:%M:%S')
          data.set_index(['devid', 'time_stamp'], inplace=True)
          data.sort_index(level=1, inplace=True)
          dischargedGroup = (data.groupby(level=0, sort=False)['intvalue'].apply(list))
          threshold = 10
          def check(line):
          oldval = 100
          for i in line:
          if (i > oldval) | (i < threshold):
          return 1
          break
          else:
          oldval = i
          return 0
          discharged = dischargedGroup.apply(check)
          `
        }}
      ]
    }
  }

];
