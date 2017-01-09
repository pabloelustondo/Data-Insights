/**
 * Created by pablo elustondo on 12/7/2016.
 */
import {DadChart} from "./chart.component";
import {DadWidget} from "./widget.component";

export class ChartData{
  Dimension = [];
  Metric = [];
  x = [];
}

export class Mapper{
  map(config:DadChart|DadWidget, data){
  var chartData = new ChartData();
  var index=0;

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
      });
    } else {
      configa = config.a;
      configb = config.b;

      chartData.Metric.push(configa);
      chartData.Dimension.push(configb);

      data.forEach(function (e) {
        chartData.Dimension.push(e[configb]);
        chartData.x.push(e[configa]);
      });
    }


  }
    return chartData;
  }
}
