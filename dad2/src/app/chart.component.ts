/**
 * Created by dister on 12/05/2016.
 */
import { Component, Input, OnInit, AfterViewInit  } from '@angular/core';
import { DadChartDataService } from './data.service'
import {Mapper} from "./mapper";

declare var d3, c3: any;

export class DadChart {
    id: string;
    name?: string;
    type: string;
    parameters?: any[];
    endpoint?:string;
    a?: string;
    b?: string;
    width: number;
    height: number;
    mini?: boolean = false;
    data?:any;
}
@Component({
    selector: 'dadchart',
    providers:[DadChartDataService],
    template: ` <!--  BEGIN CHART COMPONENT -->
     <div *ngIf="chart.mini" style= "text-align:center; height:700px;  width:700px" [id]="chart.id"></div>
     <table *ngIf="!chart.mini" id="dashboardTable">
     <th><div id="chartName">{{chart.name}}</div> <br/><br/><br/></th>
        <tr> 
            <td><div style= "text-align:center; height:700px;  width:700px" [id]="chart.id"></div></td>
            <!-- Date From input -->
            <div>
              <label style="color: #0A0A0A">Date From: </label>
             <ng2-datepicker style="color: black" [(ngModel)]="firstDate"></ng2-datepicker>
             <!--<input [(ngModel)]="chart.parameters[0].dateFrom" placeholder=" yyyy-mm-dd">-->

            </div>
            <!-- Date To input -->
            <div>
              <label style="color: #0A0A0A">Date To: </label>
              <!--<input [(ngModel)]="chart.parameters[0].dateTo" placeholder=" yyyy-mm-dd">-->
              <ng2-datepicker style="color: black;" [(ngModel)]="secondDate"></ng2-datepicker>
            </div>
            <!-- refresh button -->
            <br/>
            <div>
                <button (click)="changeConfig($event)">Refresh</button>
            </div>
        </tr>
        <br/><br/><br/>
    </table>


    <!--  END CHART COMPONENT -->`
})
export class DadChartComponent implements OnInit {
    @Input()
    chart: DadChart
    @Input()
    data;
    mapper: Mapper = new Mapper();
    colorPalette: any[] = ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e'];
    c3chart: any;
    miniChartWidth: number = 275;
    miniChartHeight: number = 200;
    miniChartColor: any[] = ['#33526e'];
    firstDate: any;
    secondDate: any;

    constructor(private dadChartDataService: DadChartDataService) { }
    onDateChanged(event:any) {
      console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    }

  ngOnInit() {

    this.miniChartWidth = this.chart.width;
    this.miniChartHeight = this.chart.height;
    console.log("CHART starts drawing ON INIT:" + this.chart.id);
  }

  ngAfterViewInit() {
    console.log("CHART starts drawing AFTER VIEW INIT :" + this.chart.id);

    if (!this.data && this.chart.data){
      this.data = this.chart.data;
    }

    if (this.data){
      this.drawChart(this.chart,this.data);
    }
    else
    { //at this point we do not have this.data nor we have this.chart.date.. so we need to go to server
      this.dadChartDataService.getChartData(this.chart).then(
        data => {
          this.data = data.data;
          this.drawChart(this.chart, this.data);
        }
      ).catch(err => console.log(err.toString()));
    }

  }

    changeConfig(event){
      //please remove this code from here
      this.chart.parameters[0].dateFrom = this.firstDate.formatted;
      this.chart.parameters[0].dateTo = this.secondDate.formatted;


      this.dadChartDataService.getChartData(this.chart).then(
        data => {
          this.data = data.data;
          let chartData = this.mapper.map(this.chart, this.data);
          this.c3chart.load(
            {
              json: [chartData.Dimension],
              keys: {
                value: chartData.Metric
              },
              unload: true,
            });
        }
      )
    }
    //mini applied
    drawChartBar(chartConfig:DadChart, data){
        let chartData = this.mapper.map(chartConfig, data);

        d3.selectAll(".c3-axis-x .tick").filter(function(d) {
          return d === 0;
        }).remove();
        let c3Config = {
        size: {
          height: chartConfig.height,
          width: chartConfig.width
        },
        bindto: '#' + chartConfig.id,
        data: {
          json: [chartData.Dimension],
          keys: {
            value: chartData.Metric
          },
          selection:{
            enabled:true
          },
          type: 'bar',
        },
        color: {
          pattern: this.colorPalette,
        },
        tooltip: {
          grouped: false,
            format: {
              title: function () {
                return ([chartConfig.a]);
              }
            }
        },
        axis: {
          x: {
            show : true,
            label: {
              text: [chartConfig.b],
                position: 'outer-right'
            }
          },
          y: {
            show : true,
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
          },
          focus: {
            show: false
          }
        },
        zoom: {
          enabled: true
        },
        subchart: {
          show: true
        },
        legend: {
          show: true
        }
      };
      if(chartConfig.mini){
        c3Config.size.width = this.miniChartWidth;
        c3Config.size.height = this.miniChartHeight;
        c3Config.legend.show = false;
        c3Config.axis.x.show = false;
        c3Config.axis.y.show = false;
        c3Config.subchart.show = false;
        c3Config.zoom.enabled = false;
        c3Config.grid.y.show = false;
        c3Config.color.pattern = this.miniChartColor;
      };
      this.c3chart = c3.generate(c3Config);
    };
    //mini applied
    drawChartPie(chartConfig:DadChart, data) {
      let chartData = this.mapper.map(chartConfig, data);
      let c3Config = {
        size: {
          height: chartConfig.height,
          width: chartConfig.width
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
          pattern: this.colorPalette,
        },
        zoom: {
          enabled: true
        },
        legend: {
          show : true
        }
      };
      if(chartConfig.mini){
        c3Config.size.width = this.miniChartWidth;
        c3Config.size.height = this.miniChartHeight;
        c3Config.legend.show = false;
      };
      this.c3chart = c3.generate(c3Config);
    };
    //mini applied
    drawChartDot(chartConfig:DadChart, data) {
      let chartData = this.mapper.map(chartConfig, data);

      d3.selectAll(".c3-axis-x .tick").filter(function(d) {
          return d === 0;
        }).remove();
      let c3Config = {
        size: {
          height: chartConfig.height,
          width: chartConfig.width
        },
        bindto: '#' + chartConfig.id,
        data: {
          json: [chartData.Dimension],
          keys: {
            value: chartData.Metric
          },
          selection:{
            enabled:true
          },
          type: 'spline',
        },

        color: {
          pattern: this.colorPalette,
        },
        grid: {
          focus: {
            show:true
          },
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
            show: true,
            label: {
              text: [chartConfig.b],
              position: 'outer-right'
            }
          },
          y: {
            show: true,
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
        },
        legend: {
          show: true
        }
      };
      if(chartConfig.mini){
        c3Config.size.width = this.miniChartWidth;
        c3Config.size.height = this.miniChartHeight;
        c3Config.legend.show = false;
        c3Config.axis.x.show = false;
        c3Config.axis.y.show = false;
        c3Config.subchart.show = false;
        c3Config.zoom.enabled = false;
        c3Config.grid.y.show = false;
        c3Config.grid.focus.show = false;
      };
      this.c3chart = c3.generate(c3Config);
    };
    //mini applied
    drawChartSpline(chartConfig:DadChart, data){
      let chartData = this.mapper.map(chartConfig, data);

      d3.selectAll(".c3-axis-x .tick").filter(function(d) {
          return d === 0;
        }).remove();
      let c3Config = {
        size: {
          height: chartConfig.height,
          width: chartConfig.width
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
          selection:{
            enabled:true
          },
          type: 'spline',
        },
        grid: {
          x: {
            show: true
          },
          y: {
            show: true
          },
          focus: {
            show: true
          }
        },
        color: {
          pattern: this.colorPalette,
        },
        axis: {
          x: {
            show: true,
            label: {
              text: [chartConfig.b],
              position: 'outer-right'
            }
          },
          y: {
            show: true,
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
        },
        legend: {
          show: true
        }
      };
      if(chartConfig.mini){
        c3Config.size.width = this.miniChartWidth;
        c3Config.size.height = this.miniChartHeight;
        c3Config.legend.show = false;
        c3Config.axis.x.show = false;
        c3Config.axis.y.show = false;
        c3Config.subchart.show = false;
        c3Config.zoom.enabled = false;
        c3Config.grid.y.show = false;
        c3Config.grid.focus.show = false;
      };
      this.c3chart = c3.generate(c3Config);
    }
    //mini applied
    drawChartDonut(chartConfig:DadChart, data) {
      let chartData = this.mapper.map(chartConfig, data);
      let c3Config = {
        size: {
          height: chartConfig.height,
          width: chartConfig.width
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
          pattern: this.colorPalette,
        },
        legend: {
          show: true
        }
      };
      if(chartConfig.mini){
        c3Config.size.width = this.miniChartWidth;
        c3Config.size.height = this.miniChartHeight;
        c3Config.legend.show = false;
      };
      this.c3chart = c3.generate(c3Config);
    };

    drawChart(chartConfig:DadChart, data) {
        if (chartConfig.type === 'bar') this.drawChartBar(chartConfig, data);
        if (chartConfig.type === 'pie') this.drawChartPie(chartConfig, data);
        if (chartConfig.type === 'dot') this.drawChartDot(chartConfig, data);
        if (chartConfig.type === 'spline') this.drawChartSpline(chartConfig, data);
        if (chartConfig.type === 'donut') this.drawChartDonut(chartConfig, data);
    }
}


