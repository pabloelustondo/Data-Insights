/**
 * Created by dister on 12/05/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
import { DadChartDataService } from './data.service'


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
     <th><div id="chartName">{{chart.name}}</div></th>
        <tr> 
            <td><div style= "text-align:center; height:700px;  width:700px" [id]="chart.id"></div></td>
        </tr>
    </table>
    <br/><br/><br/>

    <!--  END CHART COMPONENT -->`
})
export class DadChartComponent implements OnInit {
    @Input()
    chart: DadChart
    data;

    constructor(private dadChartDataService: DadChartDataService) { }
    drawChartBar(chartConfig:DadChart, data){
        var barData = {};
        var battery = [];
        data.forEach(function(e) {
          battery.push(e[chartConfig.a]);
          barData[e[chartConfig.a]] = e[chartConfig.b];
        });

        c3.generate({
          size: {
            height: 400,
            width: 475
          },
          bindto: '#' + chartConfig.id,
          data: {
            json: [barData],
            keys: {
              value: battery
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
                return ('Range of Battery Levels');
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
    })}

    drawChartPie(chartConfig:DadChart, data) {
        var pieData = {};
        var battery = [];
        data.forEach(function(e) {
          battery.push(e[chartConfig.a]);
          pieData[e[chartConfig.a]] = e[chartConfig.b];
        });

        c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [ pieData ],
                keys: {
                    value: battery
                },
                type:'pie',
            },
            color: {
              pattern: ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e']
            },
        });
    };

    drawChartDot(chartConfig:DadChart, data) {
        var dotData = {};
        var battery = [];
        data.forEach(function (e) {
          battery.push(e[chartConfig.a]);
          dotData[e[chartConfig.a]] = e[chartConfig.b];
        });

        c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [dotData],
                keys: {
                    value: battery
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
                        return ('Range of Battery Levels');
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
        });
    };

    drawChartSpline(chartConfig:DadChart, data){
        var data1 = {};
        var battery = [];
        data.forEach(function(e) {
          battery.push(e[chartConfig.a]);
          data1[e[chartConfig.a]] = e[chartConfig.b];
        });

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
                    value: battery
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
        });
    }

    drawChartDonut(chartConfig:DadChart, data) {
        var donutData = {};
        var battery = [];
        data.forEach(function(e) {
          battery.push(e[chartConfig.a]);
          donutData[e[chartConfig.a]] = e[chartConfig.b];
        })

        c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [ donutData ],
                keys: {
                    value: battery
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

