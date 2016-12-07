/**
 * Created by dister on 12/7/2016.
 */
import {DadChart} from "./chart.component";

export class ChartData{
  Dimension = {};
  Metric = [];
}

export class Mapper{
  map(chartConfig:DadChart, data){
  var chartData = new ChartData();
  data.forEach(function(e) {
    chartData.Metric.push(e[chartConfig.a]);
    chartData.Dimension[e[chartConfig.a]] = e[chartConfig.b];
  });
    return chartData;
  }
}
