import { SmlDataSet, SmlParameter } from "./sml";

export const smltestdata: SmlDataSet[] = [
  {
      id:"datasample1",
      data:[
        {time:"2017-06-21T07:00:00", devId:1, battery:40},
        {time:"2017-06-21T08:00:00", devId:1, battery:40},
        {time:"2017-06-21T09:00:00", devId:1, battery:30},
        {time:"2017-06-21T10:00:00", devId:1, battery:20},
        {time:"2017-06-21T11:00:00", devId:1, battery:10},
        {time:"2017-06-21T12:00:00", devId:1, battery:0},
        {time:"2017-06-21T13:00:00", devId:1, battery:0},
        {time:"2017-06-21T14:00:00", devId:1, battery:0},
        {time:"2017-06-21T15:00:00", devId:1, battery:0},
        {time:"2017-06-21T16:00:00", devId:1, battery:0},
        {time:"2017-06-21T17:00:00", devId:1, battery:0},

        {time:"2017-06-21T07:00:00", devId:2, battery:100},
        {time:"2017-06-21T08:00:00", devId:2, battery:90},
        {time:"2017-06-21T09:00:00", devId:2, battery:80},
        {time:"2017-06-21T10:00:00", devId:2, battery:70},
        {time:"2017-06-21T11:00:00", devId:2, battery:60},
        {time:"2017-06-21T12:00:00", devId:2, battery:50},
        {time:"2017-06-21T13:00:00", devId:2, battery:40},
        {time:"2017-06-21T14:00:00", devId:2, battery:30},
        {time:"2017-06-21T15:00:00", devId:2, battery:20},
        {time:"2017-06-21T16:00:00", devId:2, battery:10},
        {time:"2017-06-21T17:00:00", devId:2, battery:10}
      ]
  }, {
    id:"datasample2",
    data:[
      {devId:1, time:"2017-06-21T07:00:00", traffic:10, appname:"google"},
      {devId:2, time:"2017-06-21T07:00:00", traffic:20, appname:"yahoo"},
      {devId:1, time:"2017-06-21T09:00:00", traffic:30, appname:"google"},
      {devId:2, time:"2017-06-21T09:00:00", traffic:40, appname:"yahoo"}
    ]

  }
];
