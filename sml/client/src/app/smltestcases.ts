import { SmlDataSet, SmlParameter } from "./sml";

export class SMLDataSetTestCase {
  dataset: SmlDataSet;
  parameters?: SmlParameter[];

}

export const smltestcases: SMLDataSetTestCase[] = [

  {
    dataset:{
        id:"DevicesNotLastedShift_FunctionTrue",
        from:["datasample1"],
        parameters:[
         { name:"thresh·old",
           type:"Percent",
           value:10
         }
        ],
        features:[
          {name:"DeviceNotLasted", func:"true" }
        ]
    }
  },
  {
    dataset:{
      id:"DevicesNotLastedShift_FunctionThreshold",
      from:["datasample1"],
      parameters:[
        { name:"threshold",
          type:"Percent",
          value:10
        }
      ],
      features:[
        {name:"DeviceNotLasted", func:"battery < threshold" }
      ]
    }
  }

];
