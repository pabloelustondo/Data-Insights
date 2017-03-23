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
  map(config:DadChart|DadWidget, data):any{
  var chartData = new ChartData();
  var dataForChart:any;
  var index=0;

  if (config.reduction){
    let reducer = new DadReducer();
    data = reducer.reduce(config, data);
  }

    let configa:string;
    let configb:string;


    if (!config.a && !config.b && !config.lat && !config.lon) {
      configa = "a" ;
      configb = "b";
      chartData.Metric.push(configa);
      chartData.Dimension.push(configb);

      data.forEach(function (e) {
        chartData.Dimension.push(e);
        chartData.Metric.push(e);
      });

    }
    else if(config.lon && config.lat && !config.a && !config.b) {
      chartData.Metric.push('lon');
      chartData.Dimension.push('lat');

      let mapData = data[config.dataElement];
      mapData.forEach(function (e) {
        chartData.Dimension.push(e['lat']);
        chartData.Metric.push(e['lon']);
      });
    }
   else {
      configa = config.a;
      configb = config.b;

      chartData.Metric.push(configa);
      chartData.Dimension.push(configb);

      data.forEach(function (e) {
        chartData.Dimension.push(e[configb]);
        chartData.Metric.push(e[configa]);
      });

    }


  if ( config.type === 'bar' || config.type === 'spline')  {
    dataForChart = {
      x: config.b,
      columns: [chartData.Dimension, chartData.Metric],
      type:  config.type
    }
  }

  if ( config.type === 'pie') {
    dataForChart = {
     columns: [],
      type: config.type
    };
    for(let i = 1; i < chartData.Dimension.length; i++){
      dataForChart.columns.push([chartData.Dimension[i], chartData.Metric[i]])
    }
  }


  if( config.type === 'map' || config.type === 'map2') {
    dataForChart = {
      columns: [],
      type: config.type
    };
    for(let i = 1; i < chartData.Dimension.length; i++){

      dataForChart.columns.push([parseFloat(chartData.Dimension[i]) ,  parseFloat(chartData.Metric[i])]);
    }

  }


    let transformer = new DadTransformer();
    config.mappedData = transformer.transformAll(config, dataForChart);

    return config.mappedData;
  }
}
