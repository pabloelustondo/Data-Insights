/**
 * Created by pelustondo on 11/21/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
declare var d3, nv: any;

export class DadChart {
  id: string;
  name: string;
}

@Component({
  selector: 'dad-chart',
  template: require('./iChart.html')
})
export class DadChartComponent implements OnInit {
  @Input() dadchart: DadChart;
  daddata;

  ngOnInit() {
    console.log("CHART starts drawing :" + this.dadchart.id);
    this.daddata = {"status":"ok",
      "request":{"hostname":"2vf2f8xp27.execute-api.us-east-1.amazonaws.com","path":"/test/function_one","method":"GET","headers":{"x-api-key":"DiGyphaBjj10CbsNpqBAM2kLGfRAXRob9XYEchxm","dateFrom":"2016-08-20","dateTo":"2016-08-25"}},
      "result":[
        {"NumberOfDevices":"1","Rng":"0-10","Percentage":"0.00032776138970829"},
        {"NumberOfDevices":"14","Rng":"11-20","Percentage":"0.00458865945591609"},
        {"NumberOfDevices":"13","Rng":"21-30","Percentage":"0.00426089806620780"},
        {"NumberOfDevices":"18","Rng":"31-40","Percentage":"0.00589970501474926"},
        {"NumberOfDevices":"22","Rng":"41-50","Percentage":"0.00721075057358243"},
        {"NumberOfDevices":"42","Rng":"51-60","Percentage":"0.01376597836774827"},
        {"NumberOfDevices":"61","Rng":"61-70","Percentage":"0.01999344477220583"},
        {"NumberOfDevices":"105","Rng":"71-80","Percentage":"0.03441494591937069"},
        {"NumberOfDevices":"295","Rng":"81-90","Percentage":"0.09668960996394624"},
        {"NumberOfDevices":"2480","Rng":"91-100","Percentage":"0.81284824647656506"}
      ]};

    var testdata = [];

    for(let r of this.daddata.result){
      testdata.push({"key":r.Rng,"y":r.NumberOfDevices});
    }

    var width = 300;
    var height = 300;

    function drawChart(chartConfig) {
      nv.addGraph(function () {

        var d3Chart = nv.models.pie()
            .x(function (d) {
              return d.key;
            })
            .y(function (d) {
              return d.y;
            })
            .width(width)
            .height(height)
            .labelType(function (d, i, values) {
              return values.key + ':' + values.value;
            })
          ;

        console.log("CHART is actually drawing:" + "#" + chartConfig.id);
        d3.select("#" + chartConfig.id)
          .datum([testdata])
          .transition().duration(1200)
          .attr('width', width)
          .attr('height', height)
          .call(d3Chart);

        return d3Chart;

      });
    };
    drawChart(this.dadchart);
  }
}

