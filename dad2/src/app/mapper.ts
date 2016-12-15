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
  data.forEach(function(e) {
    chartData.Metric.push(e[config.a]);
    chartData.Dimension[e[config.a]] = e[config.b];
  });
    return chartData;
  }
}
