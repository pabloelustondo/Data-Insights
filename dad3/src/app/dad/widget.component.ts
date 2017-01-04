/**
 * Created by pablo elustondo on 12/14/2016.
 */
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadWidgetDataService } from "./data.service";
import { Mapper } from "./mapper";
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"

export enum DadWidgetType { OneNumber, Example};

export class DadWidget {
  id: string;
  name: string;
  type: DadWidgetType;
  parameters: any[];
  uiparameters?: DadParameter[];
  a?:string;
  b?:string;
  parameterMappers?:any[];
  endpoint: string;
  chart?: DadChart;
  metrics?: DadMetric[];
  dimensions?: DadDimension[];
}

@Component({
  selector: 'dadwidget',
  providers:[DadWidgetDataService],
  template: ` 
  <div *ngIf="widget.type==dadWidgetType.OneNumber"  class="col-sm-6 col-lg-3">          
     <div class="card card-inverse card-primary">
                <div class="card-block pb-0">
                    <div class="btn-group float-xs-right" dropdown>
                        <button type="button" class="btn btn-transparent dropdown-toggle p-0" dropdownToggle>
                            <i class="icon-settings"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" dropdownMenu>
                            <button class="dropdown-item"> <div (click)="onEdit('lalal')">Edit</div></button>
                            <button class="dropdown-item"> <div (click)="onRefresh('lalal')">Refresh</div></button>
                        </div>
                    </div>
                           <h4 *ngIf="data" class="mb-0">{{data[widget.metrics[0].DataSource]}} of {{data[widget.metrics[1].DataSource]}}</h4>
                           <p>{{widget.metrics[0].Name}}</p>
                     <div>        
                <div *ngIf="data">
                <h4 *ngIf="widget.metrics.length>2">{{widget.metrics[2].Name}}: {{  data[widget.metrics[2].DataSource] }}</h4>                  
                </div>
                
          <div *ngIf="editMode">  
                     
            <div *ngFor="let uiparam of widget.uiparameters">
               <div><label>{{uiparam.Name}}</label></div>
               <div *ngIf="uiparam.Type == dadParameterType.DateTime">
               <input type="date" [(ngModel)]="uiparam.ValueD"/>
               <!--<datepicker [(ngModel)]="dt" [minDate]="minDate" [showWeeks]="true"></datepicker>-->
                 
               <timepicker [(ngModel)]="mytime" (change)="changed()" [hourStep]="hstep" [minuteStep]="mstep" [showMeridian]=false [readonlyInput]="!isEnabled"></timepicker>
               <!--<input type="time" [(ngModel)]="uiparam.ValueT"/>-->
               </div>
             
               <div *ngIf="uiparam.Type == dadParameterType.Duration">
               <!--<input type="number" [(ngModel)]="uiparam.Value"/>-->
               <timepicker [(ngModel)]="mytime" (change)="changed()" [hourStep]="hstep" [minuteStep]="mstep" [showMeridian]=false [readonlyInput]="!isEnabled"></timepicker>
               </div>
               <div *ngIf="uiparam.Type == dadParameterType.Number"><input type="number" min="0" max="100" [(ngModel)]="uiparam.Value" /></div>   
            </div>
            <!--refresh button here-->
            <br/><br/>
            <div class="col-md-4 text-center">
            <button style="border-color:white; color:white; margin-left:-15px" type="button" class="btn btn-outline-primary">Refresh</button>
            </div>
            </div>     

    </div>
            </div>
                <div class="chart-wrapper px-1" style="height:70px;">
                    <canvas baseChart class="chart" [datasets]="lineChart1Data" [labels]="lineChart1Labels" [options]="lineChart1Options" [colors]="lineChart1Colours" [legend]="lineChart1Legend" [chartType]="lineChart1Type" (chartHover)="chartHovered($event)" (chartClick)="chartClicked($event)"></canvas>
                </div>
            </div>       
    </div>
    
    
    
    
    
    <!--their code-->
    <div  *ngIf="widget.type==dadWidgetType.Example"  class="col-sm-6 col-lg-3">
            <div class="card card-inverse card-primary">
                <div class="card-block pb-0">
                    <div class="btn-group float-xs-right" dropdown>
                        <button type="button" class="btn btn-transparent dropdown-toggle p-0" dropdownToggle>
                            <i class="icon-settings"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" dropdownMenu>
                            <button class="dropdown-item"> <div (click)="onEdit('lalal')">Edit</div></button>
                            <button class="dropdown-item"> <div (click)="onRefresh('lalal')">Refresh</div></button>
                        </div>
                    </div>
                    <h4 class="mb-0">9.823</h4>
                    <p>Members online</p>
                </div>
                <div class="chart-wrapper px-1" style="height:70px;">
                    <canvas baseChart class="chart" [datasets]="lineChart1Data" [labels]="lineChart1Labels" [options]="lineChart1Options" [colors]="lineChart1Colours" [legend]="lineChart1Legend" [chartType]="lineChart1Type" (chartHover)="chartHovered($event)" (chartClick)="chartClicked($event)"></canvas>
                </div>
            </div>
        </div>
    
    
    
    `
})
export class DadWidgetComponent implements OnInit {
  @Input()
  widget: DadWidget;
  data;
  mapper: Mapper = new Mapper();
  dadParameterType = DadParameterType;
  dadWidgetType = DadWidgetType;
  editMode:boolean = false;

  constructor(private dadWidgetDataService: DadWidgetDataService) {}

  onRefresh(message:string):void{
    alert("Going to Refresh:" + message);
  }

  onEdit(message:string):void{
    if (!this.editMode) this.editMode = true
    else this.editMode = false;
  }

  changeData(event) {

    this.dadWidgetDataService.getWidgetData(this.widget).then(
      data => {
        this.data = data.data[0];
      }
    );
  }

  mapDuration(durationString:string):number{

    let durationLong: number = +durationString.split(":")[0];
    durationLong += +durationString.split(":")[1]/60;
    return durationLong;
  }

  ngOnInit() {
    console.log("Widgets are loading... :" + this.widget.id);
    this.dadWidgetDataService.getWidgetData(this.widget).then(
      data => {
        this.data = data.data[0];
      }
    ).catch(err => console.log(err.toString()));
  }
}
