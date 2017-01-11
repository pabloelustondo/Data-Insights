/**
 * Created by doga ister on 12/14/2016.
 */
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadWidgetDataService } from "./data.service";
import { DadWidgetConfigsService } from './chart.service';
import { Mapper } from "./mapper";
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"

export enum DadWidgetType { OneNumber, Example};

export class DadWidget {
  id: string;
  name: string;
  type: DadWidgetType;
  reasonId: string;
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
  providers:[DadWidgetDataService, DadWidgetConfigsService],
  template: ` 
  <div *ngIf="widget.type==0"  class="col-sm-6 col-lg-3">          
     <div class="card card-inverse card-primary">
                <div class="card-block pb-0">
                    <div class="btn-group float-xs-right" dropdown>
                        <button type="button" class="btn btn-transparent dropdown-toggle p-0" dropdownToggle>
                            <i class="icon-settings"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" dropdownMenu>
                            <button class="dropdown-item" style="cursor:pointer;"> <div (click)="onEdit('lalal')">Edit</div></button>
                            <button class="dropdown-item" style="cursor:pointer;"> <div (click)="onRefresh('lalal')">Refresh</div></button>
                        </div>
                    </div>
                    <h4 *ngIf="data" class="mb-0">
                    <a [routerLink]="['table', data[widget.metrics[0].DataSource],widget.id]">
                    <span style="color:white; text-decoration: underline; ">{{data[widget.metrics[0].DataSource]}} </span>
                    </a>
                    of {{data[widget.metrics[1].DataSource]}}</h4><br/>
                    <div class="col-sm-6">
                       <progress style="margin-left:-15px;" *ngIf="data" class="progress progress-xs progress-danger" value="{{data[widget.metrics[0].DataSource]}}" max="{{data[widget.metrics[1].DataSource]}}"></progress>
                    </div><br/>
                    <div>
                    <p>{{widget.metrics[0].Name}}</p>
                    </div>
                    <br/>
                    <div *ngIf="data && widget.metrics.length>2">
                    <h6>{{  data[widget.metrics[2].DataSource] }}</h6>   
                    <div class="col-sm-3">
                           <progress style="margin-left:-15px;" *ngIf="data" class="progress progress-xs progress-danger" value="{{data[widget.metrics[2].DataSource]}}" max="{{data[widget.metrics[1].DataSource]}}"></progress>
                    </div><br/>
                    <p style="font-size:12px;">{{widget.metrics[2].Name}}</p>
                    </div>
                    
                    <div *ngIf="data && widget.metrics.length>3">
                    <h6>{{  data[widget.metrics[3].DataSource] }}</h6> 
                    <div class="col-sm-3">
                        <progress style="margin-left:-15px;" *ngIf="data" class="progress progress-xs progress-danger" value="{{data[widget.metrics[3].DataSource]}}" max="{{data[widget.metrics[1].DataSource]}}"></progress>
                    </div><br/>
                    <p style="font-size:12px;">{{widget.metrics[3].Name}}</p>
                    </div>
                   
                    
                  <div class="row">
                      <div *ngIf="editMode">          
                        <div *ngFor="let uiparam of widget.uiparameters">
                           <div><label>{{uiparam.Name}}</label></div>
                           <div *ngIf="uiparam.Type == dadParameterType.DateTime">
                           <input type="date" [(ngModel)]="uiparam.Value['D']"/>       
                           <timepicker [(ngModel)]="uiparam.Value['T']" (change)="changed()" [hourStep]="hstep" [minuteStep]="mstep" [showMeridian]=false [readonlyInput]="false"></timepicker>       
                           </div>
            
                           <div *ngIf="uiparam.Type == dadParameterType.Duration">
                           <timepicker [(ngModel)]="uiparam.Value" (change)="changed()" [hourStep]="hstep" [minuteStep]="mstep" [showMeridian]=false [readonlyInput]="false"></timepicker>
                           </div>
                           <div *ngIf="uiparam.Type == dadParameterType.Number"><input type="number" min="0" max="100" [(ngModel)]="uiparam.Value" /></div>  
                           <div *ngIf="uiparam.Type == dadParameterType.String"><input type="text" [(ngModel)]="uiparam.Value" /></div>   
                 
                        </div>
                        <!--refresh button here-->
                        <br/>
                        <div class="col-md-4 text-center">
                        <button (click)="onRefresh()" style="border-color:white; color:white; margin-left:-15px;" type="button" class="btn btn-outline-primary">Refresh</button>
                        <br/><br/>
                        </div>
                        <div>
                        <button (click)="onEdit()" style="color:white;" type="button" class="btn btn-outline-primary pull-right">
                            <span class="glyphicons glyphicons-remove"></span>
                        </button>
                        </div>     
                      </div>
                  </div>
                  
                  <div class="chart-wrapper px-1" style="height:70px;">
                      <canvas baseChart class="chart" [datasets]="lineChart1Data" [labels]="lineChart1Labels" [options]="lineChart1Options" [colors]="lineChart1Colours" [legend]="lineChart1Legend" [chartType]="lineChart1Type" (chartHover)="chartHovered($event)" (chartClick)="chartClicked($event)"></canvas>
                  </div>
 
                  <div class="row">
                      <div *ngIf="!editMode">          
                        <span *ngFor="let uiparam of widget.uiparameters">
                   <!--  <div><label style="text-decoration: underline">{{uiparam.Name}} :</label></div> -->
                           <span *ngIf="uiparam.Type == dadParameterType.DateTime">
                           {{uiparam.Value['D']  }} {{addingZero(uiparam.Value['T'].getHours())}}:{{addingZero(uiparam.Value['T'].getMinutes())}}                        
                           </span>
                   <!--        <div *ngIf="uiparam.Type == dadParameterType.Duration">{{addingZero(uiparam.Value.getHours())}}:{{addingZero(uiparam.Value.getMinutes())}}</div>
                           <div *ngIf="uiparam.Type == dadParameterType.Number">{{uiparam.Value}}</div>   -->
                            <span *ngIf="uiparam.Type == dadParameterType.String && uiparam.Value!='custom'">({{uiparam.Value}})</span> 
                        </span>    
                      </div>
                  </div>
                 
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
  editMode:boolean = false;

  constructor(private dadWidgetDataService: DadWidgetDataService,
              private dadWidgetConfigsService: DadWidgetConfigsService) {}

  onRefresh(message:string):void{
      this.mapParameters2model();
      this.dadWidgetConfigsService.saveOne(this.widget);
      this.dadWidgetDataService.getWidgetData(this.widget).then(
          data => {
              this.data = data.data[0];
              this.fixDataNulls();
          }
      ).catch(err => console.log(err.toString()));
  }

  addingZero(x:number):string{
      return (x <10 )? "0" + x : "" + x;
  }

  onEdit(message:string):void{
    if (!this.editMode) this.editMode = true
    else this.editMode = false;
  }

  changeData(event) {
    this.dadWidgetDataService.getWidgetData(this.widget).then(
      data => {
        this.data = data.data[0];
          this.fixDataNulls();
      }
    );
  }

    mapParameters2model():void{
        //this action will map UI parameters into model parameters back
        let parameters = this.widget.parameters[0];   //maybe we need to stop having a list?
        for (let uiparam of this.widget.uiparameters) {
            if (uiparam.Type === this.dadParameterType.DateTime) {

                let datetime:Date = new Date(uiparam.Value['D']);
                let time:Date = uiparam.Value['T'];
                datetime.setUTCHours(time.getUTCHours(), time.getUTCMinutes());
                parameters[uiparam.DataSource] = datetime.toISOString();

            }
            if (uiparam.Type === this.dadParameterType.Number) {
                parameters[uiparam.DataSource] = uiparam.Value;
            }
            if (uiparam.Type === this.dadParameterType.String) {
                parameters[uiparam.DataSource] = uiparam.Value;
            }
            if (uiparam.Type === this.dadParameterType.Duration) {
                parameters[uiparam.DataSource] = this.mapDate2LongDuration(uiparam.Value);
            }
        }

    }

    mapParameters2ui():void{
        //this action will map model parameters into UI parameters
        let parameters = this.widget.parameters[0];   //maybe we need to stop having a list?
        for (let uiparam of this.widget.uiparameters) {
            if (uiparam.Type === this.dadParameterType.DateTime) {
                let d: Date;
                if (parameters[uiparam.DataSource+"Auto"]=="yesterday"){
                     let dold = new Date(parameters[uiparam.DataSource]);
                     let hrs = dold.getHours();
                     let mins = dold.getMinutes();
                     let secs  = dold.getSeconds();
                     d = new Date();
                     d.setDate(d.getDate() - 1);
                     d.setHours(hrs,mins,secs);
                }else{ // we assume that we have a valid date
                     d = new Date(parameters[uiparam.DataSource]);
                }
                let yyyy = d.getFullYear();
                let m = d.getMonth()+1;
                let day = d.getDate();
                let mm = (m <10 )? "0" + m : "" + m;
                let dd = (day <10 )? "0" + day : "" + day;
                uiparam.Value = {};
                uiparam.Value['D'] = yyyy + "-" + mm + "-" + dd;
                uiparam.Value['T'] = d;
            }
            if (uiparam.Type === this.dadParameterType.Number) {
                uiparam.Value = parameters[uiparam.DataSource];
            }
            if (uiparam.Type === this.dadParameterType.String) {
                uiparam.Value = parameters[uiparam.DataSource];
            }
            if (uiparam.Type === this.dadParameterType.Duration) {
                let Iduration: number = parameters[uiparam.DataSource];
                let Tduration = this.mapLongDuration2Date(Iduration);
                uiparam.Value = Tduration;
            }
        }
    }

    mapLongDuration2Date ( duration:number): Date {

      let hrs = Math.floor(duration);
      let mins = (duration - hrs) * 60;
      let time = new Date();
      time.setHours(hrs,mins);
      return time;
    }

    mapDate2LongDuration ( duration:Date): number {

        let hrs = duration.getHours();
        let mins = duration.getMinutes();
        let durationLong:number = hrs + mins/60;
        return durationLong;
    }

    fixDataNulls(){
        if (this.data[this.widget.metrics[0].DataSource] === null) this.data[this.widget.metrics[0].DataSource] = 0;
        if (this.data[this.widget.metrics[1].DataSource] === null) this.data[this.widget.metrics[1].DataSource] = 0;
        if (this.data[this.widget.metrics[2].DataSource] === null) this.data[this.widget.metrics[2].DataSource] = 0;
        if (this.data[this.widget.metrics[3].DataSource] === null) this.data[this.widget.metrics[3].DataSource] = 0;
    }

  ngOnInit() {
    console.log("Widgets are loading... :" + this.widget.id);
    this.mapParameters2ui();
    this.mapParameters2model();
     // this.mapParameters2ui();
    this.dadWidgetDataService.getWidgetData(this.widget).then(
      data => {
        this.data = data.data[0];
        this.fixDataNulls();
      }
    ).catch(err => console.log(err.toString()));
  }
}
