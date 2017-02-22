/**
 * Created by doga ister on 12/7/2016.
 */
import {DadChart} from "./chart.component";
import {DadWidget} from "./widget.component";
import {DadTransformer } from "./transformer";
import {DadReducer } from "./reducer";

export class ChartData{
  Dimension = [];
  Metric = [];
}

export class Mapper{
  map(config:DadChart|DadWidget, data){
  var chartData = new ChartData();
  var dataForChart:any;
  var index=0;


  if (config.reduction){
    let reducer = new DadReducer();
    data = reducer.reduce(config, data);
  }


  if ( config.type !== 'bar' && config.type !== 'spline') {
    data.forEach(function (e) {

      //need to review this idea.. works for now b==metric a=dimension

      if (!config.a && !config.b) {
        chartData.Metric.push("#" + index);
        chartData.Dimension["#" + index] = e;
      }

      if (config.a && config.b) {
        chartData.Metric.push(e[config.a]);
        chartData.Dimension[e[config.a]] = e[config.b];
      }
      index++;
    });

      dataForChart = {
        json: [chartData.Dimension],
        keys: {
          value: chartData.Metric
        },
        selection:{
          enabled:true
        },
        type:  config.type
      };

  } else {

    let configa:string;
    let configb:string;

    if (!config.a && !config.b) {
      configa = "a" ;
      configb = "b";
      chartData.Metric.push(configa);
      chartData.Dimension.push(configb);

      data.forEach(function (e) {
        chartData.Dimension.push(e);
        chartData.Metric.push(e);
      });

    } else {
      configa = config.a;
      configb = config.b;

      chartData.Metric.push(configa);
      chartData.Dimension.push(configb);

      data.forEach(function (e) {
        chartData.Dimension.push(e[configb]);
        chartData.Metric.push(e[configa]);
      });

    }

    dataForChart = {
      x: config.b,
      columns: [chartData.Dimension, chartData.Metric],
      type:  config.type
    }
  }
    let transformer = new DadTransformer();
    return transformer.transformAll(config, dataForChart);
  }
}
