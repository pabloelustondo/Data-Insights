import { Component, Input, OnInit, AfterViewInit  } from '@angular/core';
import { DadElementDataService } from './data.service';
import { Mapper } from "./mapper";
import { DadElement } from "./dadmodels";
import { Router, ActivatedRoute } from "@angular/router";
import { config } from "./appconfig";
import { DadTableConfigsService } from "./chart.service";
import { DadFilter } from "./filter";

declare var d3, c3: any;

export class DadChart extends DadElement{
    type: string;
    width?: number;
    height?: number;
    mini?: boolean = false;
    big?: boolean = false;
    horizontal?: boolean = false;
    embeddedChart?: boolean = false;
    regionM?:number;
    aname?: String;
    bname?: String;
    action?: String;
    widgetClickChart?: boolean = false;
    drillchart?:any;
}
@Component({
    selector: 'dadchart',
    providers:[DadElementDataService,DadTableConfigsService],
    template: `
    <div *ngIf="!chart.mini && !chart.embeddedChart" [ngClass]="chartClass()">  
        <div class="inside">
          <div class="content card-inverse card-secondary">    
            <div class="card-block pb-0">
                <div class="content card card-secondary">   
                    <div class="btn-group float-xs-right" dropdown>
                        <button style="color:black;" type="button" class="btn btn-transparent dropdown-toggle p-0" dropdownToggle>
                            <i class="icon-settings"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" dropdownMenu>
                           <button class="dropdown-item" style="cursor:pointer;"> <div (click)="onEdit('lalal')">Edit</div></button>
                           <button class="dropdown-item" style="cursor:pointer;"> <div (click)="onRawData()">See raw fact data</div></button>
                           <button class="dropdown-item" style="cursor:pointer;"> <div (click)="onRefresh()">Refresh</div></button>
                        </div>
                    </div>
                    <div>
                        <div style="color:black;">{{chart.name}}</div><br/><br/><br/>        

                        <div *ngIf="chart.big" style="text-align:center; padding-bottom:70%; height:50%; width:100%;" [id]="chart.id"></div>
                        <div *ngIf="!chart.big" style="text-align:center; height:100%; width:100%;" [id]="chart.id"></div>
                                                
                        <div style="color:black;">
                            <dadparameters [element]="chart" [editMode]="editMode" [onRefresh]="refreshMode" (parametersChanged)="changeConfig()"></dadparameters>
                        </div>
                        <br/>
                    </div>
                </div>
            </div>
          </div>
          <!--If it is mini chart -->
         
        </div>
    </div>
        <div *ngIf="chart.mini" style="text-align:left; height:auto; width:auto;" [id]="chart.id"></div>
        <div *ngIf="chart.embeddedChart"  style="text-align:left; width:auto;" [id]="chart.id"></div>

    `
})
export class DadChartComponent implements OnInit {
    @Input()
    chart: DadChart
    @Input()
    set data(d){
      this._data = d;
      if (this.c3chart){
      let chartData = this.mapper.map(this.chart, this.data);
      this.c3chart.load(chartData);}
    };
    get data(){
       return this._data;
    };
    _data;
    mapper: Mapper = new Mapper();
    colorPalette: any[] = ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e'];
    c3chart: any;
    miniChartWidth: number = 275;
    miniChartHeight: number = 200;
    miniChartColor: any[] = ['#33526e'];
    firstDate: any;
    secondDate: any;
    editMode:boolean = false;
    refreshMode:boolean = false;

  constructor(private dadChartDataService: DadElementDataService,
              private dadTableConfigsService : DadTableConfigsService,
              private router: Router, private route: ActivatedRoute) {}

  onDateChanged(event:any) {
      console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }

  onRawData(message:string):void{
    this.router.navigate(['table', 100, this.chart.id], { relativeTo: this.route});
  }

  onRefresh():void{
    if (!this.refreshMode) this.refreshMode = true;
    else this.refreshMode = false;
  }

  chartClass(){
    if (this.chart.big){
      return 'col-sm-12 col-lg-12';
    } else {
      return 'col-sm-8 col-lg-6';
    }
  }

  ngOnInit() {

    this.miniChartWidth = this.chart.width;
    this.miniChartHeight = this.chart.height;
    console.log("CHART starts drawing ON INIT:" + this.chart.id);
  }

  ngAfterViewInit() {
    console.log("CHART starts drawing AFTER VIEW INIT :" + this.chart.id);

    if (!this.data && this.chart.data && config.testing){
      this.data = this.chart.data;
    }

    if (this.data){
      this.drawChart(this.chart,this.data);
    };

    if (!config.testing && this.chart.endpoint)
    { //at this point we do not have this.data nor we have this.chart.date.. so we need to go to server
      this.dadChartDataService.getElementData(this.chart).then(
        data => {
          this.data = data.data;
          //this.chart.data = data.data;
          this.drawChart(this.chart, this.data);
        }
      ).catch(err => console.log(err.toString()));
    }

  }

  changeConfig(){
      this.dadChartDataService.getElementData(this.chart).then(
        data => {
          this.data = data.data;
          let chartData = this.mapper.map(this.chart, this.data);
          this.c3chart.load(chartData);
        }
      )
    }

  onEdit(message:string):void{
      if (!this.editMode) this.editMode = true;
      else this.editMode = false;
    }

  indexOfRegions(chartData:any){
    let M = this.chart.regionM;
    let Dimension = chartData.columns[0];
    var i;
    for(i=1; i<Dimension.length; i++){
      if( Dimension[i] >= M ) {
        return i-1;
      }
    }
    return 0;
  }

  drillFromElement(data){
    if (this.chart.action = 'drillFromElement') {

      let self = this;
      let eventHandler = this.goToTable;
      let chart = this.chart;
      let route = this.route;
      let router = this.router;

      data.onclick = function (d, element) {
        eventHandler(d, chart, router, route, self);
      };
    }
  }

  //mini applied
  drawChartBar(chartConfig:DadChart, data) {
    let bardata = this.mapper.map(chartConfig, data);

    bardata.selection = {
      enabled: true,
    };

    this.drillFromElement(bardata);

    d3.selectAll(".c3-axis-x .tick").filter(function (d) {
      return d === 0;
    }).remove();

    let c3Config:any= {
      bindto: '#' + chartConfig.id,
      size:{},
      data: bardata,
      color: {
        pattern: this.colorPalette,
      },
      tooltip: {
        grouped: false,
        format: {
          title: function () {
            return ([chartConfig.aname]);
          },
        }
      },
      axis: {
        rotated : false,
        x: {
          type: 'category',
          show: true,
          label: {
            text: [chartConfig.bname],
            position: 'outer-right'
          },
          tick: {
            multiline: false,
          }
        },
        y: {
          show: true,
          label: {
            text: [chartConfig.aname],
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
      legend: {
        show: false
      },
      interaction: {
        enabled: true
      },
      bar: {
        width: {
          ratio: 0.7
        }
      }
    };

if (chartConfig.regionM){
    c3Config.regions =[
      {start: this.indexOfRegions(bardata)},
    ];
}

    if (chartConfig.mini) {
      c3Config.size = {};
      c3Config.size.width = this.miniChartWidth;
      c3Config.size.height = this.miniChartHeight;
      c3Config.legend.show = false;
      c3Config.axis.x.show = false;
      c3Config.axis.y.show = false;
      //c3Config.subchart.show = false;
      c3Config.zoom.enabled = false;
      c3Config.grid.y.show = false;
      c3Config.color.pattern = this.miniChartColor;
      c3Config.interaction.enabled = false;
      c3Config.regions = [{'start': 100}];
      c3Config.data.color = function (color, d) {
        return d.value === 100 ? "#007F00" : color && d.value <= 30 ? "#FF0000" : color;
      };
    }
    if (chartConfig.embeddedChart) {
      c3Config.regions = [{'start': 100}]
      c3Config.axis.x.label.text = [];
      c3Config.axis.y.label.text = [];
      c3Config.size.height = 200;
      c3Config.legend.show = false;
      c3Config.axis.y.show = false;
      c3Config.grid.y.show = false;
    };

    if (chartConfig.horizontal) {
      c3Config.axis.rotated = true;
    }
    this.c3chart = c3.generate(c3Config);

    if(chartConfig.action === 'drill') {
      let eventHandler = this.goToTable;
      let chart = this.chart;
      let route = this.route;
      let router = this.router;

      this.c3chart.internal.main.on('click', function (d) {
            eventHandler(d, chart, router, route, self);
          }
      );
    };

    if(!chartConfig.action || chartConfig.action === 'grow') {
      let eventHandler = this.growIt;
      let chart = this.chart;
      let route = this.route;
      let router = this.router;

        this.c3chart.internal.main.on('click', function (d) {
          eventHandler(d, chart, router, route);
      })
    }
  };

  growIt(d,chart,router,route){
    router.navigate(['bigchart', chart.id], { relativeTo: route});
  };

  goToTable(d,chart:DadChart,router,route, self){

    //create the table
    let table = self.dadTableConfigsService.getTableConfig(self.chart.tableId);
    let tableConfig = JSON.parse(JSON.stringify(table)); //to clone object

    tableConfig.id += self.chart.id + d.id;
    tableConfig.filter = { } ;

    //let find the attribute   come in the reducer dimensin

    let attribute = chart.reduction.dimension.attribute;

    let value;

    if (chart.type === 'pie') value = d.id;
    if (chart.type === 'bar') {
        value = chart.mappedData.columns[0][d.x + 1];
    }

    tableConfig.filter[attribute] = value;

    self.dadTableConfigsService.saveOne(tableConfig);

    //go to that table
    router.navigate(['table', chart.mappedData.columns[0].length, chart.id,  tableConfig.id], { relativeTo: route});
};

  //mini applied
  drawChartPie(chartConfig:DadChart, data) {
    let piedata = this.mapper.map(chartConfig, data);

    piedata.selection = {
      enabled: true
    };

    this.drillFromElement(piedata);

    let c3Config:any = {
      size: {},
      bindto: '#' + chartConfig.id,
      data: piedata,
      color: {
        pattern: this.colorPalette,
      },
      tooltip: {
        grouped: false,
        format: {
          title: function () {
            return ([chartConfig.aname]);
          },
        }
      },
      zoom: {
        enabled: true
      },
      legend: {
        show : true
      },
      interaction: {
        enabled: true
      }
    };

    if(chartConfig.mini){
      c3Config.size.width = this.miniChartWidth;
      c3Config.size.height = this.miniChartHeight;
      c3Config.legend.show = false;
      c3Config.interaction.enabled = false;
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
      data: chartData,
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

    let splinedata = chartData;
    splinedata.selection={
      enabled:true
    };

    d3.selectAll(".c3-axis-x .tick").filter(function(d) {
        return d === 0;
      }).remove();
    let c3Config = {
      size: {
        height: chartConfig.height,
        width: chartConfig.width
      },
      bindto: '#' + chartConfig.id,
      data: splinedata,
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
          type: 'category',
          categories: chartData.x,
          show: true,
          label: {
            text: [chartConfig.a],
            position: 'outer-right'
          }
        },
        y: {
          show: true,
          label: {
            text: [chartConfig.b],
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
      data: chartData,
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


