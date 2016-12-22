/**
 * Created by dister on 12/7/2016.
 */
import {DadChart} from "./chart.component";
import {DadWidget} from "./widget.component";

export class ChartData{
  Dimension = {};
  Metric = [];
}

export class Mapper{
  map(config:DadChart|DadWidget, data){
  var chartData = new ChartData();
  var index=0;
  data.forEach(function(e) {

    //need to review this idea.. works for now b==metric a=dimension

    if (!config.a && !config.b){
      chartData.Metric.push("#"+index);
      chartData.Dimension["#"+index] = e;}

    if (config.a && config.b){
    chartData.Metric.push(e[config.a]);
    chartData.Dimension[e[config.a]] = e[config.b];}
    index++;
  });
    return chartData;
  }
}
