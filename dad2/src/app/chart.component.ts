/**
 * Created by dister on 12/05/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
import { DadChartDataService } from './data.service'
import {Mapper} from "./mapper";
import transform = d3.transform;

declare var d3, c3: any;

export class DadChart {
    id: string;
    name: string;
    type: string;
    parameters: any[];
    endpoint:string;
    a : string;
    b : string;

}

@Component({
    selector: 'dadchart',
    providers:[DadChartDataService],
    template: ` <!--  BEGIN CHART COMPONENT -->
     <table id="dashboardTable">
     <th><div id="chartName">{{chart.name}}</div> <br/><br/><br/></th>
        <tr> 
            <td><div style= "text-align:center; height:700px;  width:700px" [id]="chart.id"></div></td>
            <td><button (click)="changeConfig($event)">Change Data Range</button></td>
        </tr>
    </table>
    <br/><br/><br/>

    <!--  END CHART COMPONENT -->`
})
export class DadChartComponent implements OnInit {
    @Input()
    chart: DadChart
    data;
    mapper: Mapper = new Mapper();
    c3chart: any;

    constructor(private dadChartDataService: DadChartDataService) { }

    changeConfig(event){
      this.chart.parameters[0].dateFrom = "2016-08-20";
      this.chart.name =  " (dateFrom: 2016-08-20 ) ";
      this.dadChartDataService.getChartData(this.chart).then(
        data => {
          this.data = data.data;
          //let chartData = this.mapper.map(this.chart, this.data);
          this.c3chart.load(data);
        }
      )
    }

    drawChartBar(chartConfig:DadChart, data){
        let chartData = this.mapper.map(chartConfig, data);

        d3.selectAll(".c3-axis-x .tick").filter(function(d) {
          return d === 0;
        }).remove();

        this.c3chart = c3.generate({
          size: {
            height: 400,
            width: 475
          },
          bindto: '#' + chartConfig.id,
          data: {
            json: [chartData.Dimension],
            keys: {
              value: chartData.Metric
            },
            type: 'bar',
          },
          color: {
            pattern: ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e']
          },
          tooltip: {
            grouped: false,
            format: {
              title: function () {
                return ([chartConfig.a]);
              },
            }
          },
          axis: {
            x: {
              label: {
                text: [chartConfig.b],
                position: 'outer-right'
              }
            },
            y: {
              label: {
                text: [chartConfig.a],
                position: 'outer-top'
              }
            }
          },
          grid: {
            x: {
              show: false
            },
            y: {
              show: true
            }
          },
          zoom: {
            enabled: true
          },
          subchart: {
            show: true
          }
    })}

    drawChartPie(chartConfig:DadChart, data) {
      let chartData = this.mapper.map(chartConfig, data);

      c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [ chartData.Dimension ],
                keys: {
                    value: chartData.Metric
                },
                type:'pie',
            },
            color: {
              pattern: ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e']
            },
            zoom: {
              enabled: true
            }
        });
    };

    drawChartDot(chartConfig:DadChart, data) {
      let chartData = this.mapper.map(chartConfig, data);


      d3.selectAll(".c3-axis-x .tick").filter(function(d) {
          return d === 0;
        }).remove();

        c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [chartData.Dimension],
                keys: {
                    value: chartData.Metric
                },
                type: 'spline',
            },
            color: {
              pattern: ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e']
            },
            grid: {
              x: {
                show: true
              },
              y: {
                show: true
              }
            },
            tooltip: {
              grouped: false,
              format: {
                    title: function () {
                        return ([chartConfig.b]);
                    },
                }
            },
            axis: {
                x: {
                    label: {
                        text: [chartConfig.b],
                        position: 'outer-right'
                    }
                },
                y: {
                    label: {
                        text: [chartConfig.a],
                        position: 'outer-top'
                    }
                }
            },
            zoom: {
              enabled: true
            },
            subchart: {
              show: true
            }
        });
    };

    drawChartSpline(chartConfig:DadChart, data){
      let chartData = this.mapper.map(chartConfig, data);

      d3.selectAll(".c3-axis-x .tick").filter(function(d) {
          return d === 0;
        }).remove();

        c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                columns:[
                   ['Number of Devices',30,40,500,0],
                   ['Range of Devices', 1, 10, 90, 70, 85, 5, 100]
                ],
                keys: {
                    value: chartData.Metric
                },
                type: 'spline',
            },
            grid: {
              x: {
                show: true
              },
              y: {
                show: true
              }
            },
            color: {
              pattern: ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e']
            },
            axis: {
              x: {
                label: {
                  text: [chartConfig.b],
                  position: 'outer-right'
                }
              },
              y: {
                label: {
                  text: [chartConfig.a],
                  position: 'outer-top'
                }
              }
            },
            zoom: {
              enabled: true
            },
            subchart: {
              show: true
            }
        });
    }

    drawChartDonut(chartConfig:DadChart, data) {
      let chartData = this.mapper.map(chartConfig, data);

      c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [ chartData.Dimension ],
                keys: {
                    value: chartData.Metric
                },
                type:'donut',
            },
            color: {
              pattern: ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e']
            },
        });
    };

    drawChart(chartConfig:DadChart, data) {
        if (chartConfig.type === 'bar') this.drawChartBar(chartConfig, data);
        if (chartConfig.type === 'pie') this.drawChartPie(chartConfig, data);
        if (chartConfig.type === 'dot') this.drawChartDot(chartConfig, data);
        if (chartConfig.type === 'spline') this.drawChartSpline(chartConfig, data);
        if (chartConfig.type === 'donut') this.drawChartDonut(chartConfig, data);
    }

    ngOnInit() {
        console.log("CHART starts drawing :" + this.chart.id);

        this.dadChartDataService.getChartData(this.chart).then(
            data => {
                this.data = data.data;
                this.drawChart(this.chart,this.data);
            }
        ).catch(err => console.log(err.toString()));


        /*
        this.dadChartDataService.getChartData().then(data => {
            this.dadDrawChart(this.chart,data);
        });
    */

    }
}

