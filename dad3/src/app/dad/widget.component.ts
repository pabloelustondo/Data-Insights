import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadElementDataService } from "./data.service";
import { DadWidgetConfigsService } from './chart.service';
import { Mapper } from "./mapper";
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType, DadElement } from "./dadmodels"

export enum DadWidgetType { OneNumber, Example};

export class DadWidget extends DadElement{
  type: DadWidgetType;
  chart?: DadChart;
}

@Component({
  selector: 'dadwidget',
  providers:[DadElementDataService, DadWidgetConfigsService],
  template: ` 
  <div *ngIf="widget.type==0"  class="col-sm-6 col-lg-3">  
  <div class="inside">
     <div class="content card card-inverse card-primary">
                <div class="card-block pb-0">
                    <div class="btn-group float-xs-right" dropdown>
                        <button type="button" class="btn btn-transparent dropdown-toggle p-0" dropdownToggle>
                            <i class="icon-settings"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" dropdownMenu>
                            <button class="dropdown-item" style="cursor:pointer;"> <div (click)="onEdit('lalal')">Edit</div></button>
                            <button *ngIf="widget.metrics.length>2" class="dropdown-item" style="cursor:pointer;"> <div (click)="onMoreDetails('lalal')">More Details</div></button>
                            <button class="dropdown-item" style="cursor:pointer;"> <div (click)="onRefresh()">Refresh</div></button>
                        </div>
                    </div>
                    <p>{{widget.metrics[0].Name}}</p>
                    <h3 *ngIf="data" class="mb-0">
                    <a [routerLink]="['table', data[widget.metrics[0].DataSource],widget.id]">
                    <span style="font-size: 140px; color:white;">{{data[widget.metrics[0].DataSource]}} </span>
                    </a>
                    <br/>out of {{data[widget.metrics[1].DataSource]}} </h3><br/>
                    <div *ngIf="data" class="col-sm-6">
                       <progress style=" display:inline-block; margin-left:-15px;" class="progress progress-xs progress-danger" value="{{data[widget.metrics[0].DataSource]}}" max="{{data[widget.metrics[1].DataSource]}}"></progress>                                                          
                    </div>
                    <div *ngIf="data">{{percentageOfTotal()}}%</div>     
                    <br/>
                    <br/>
                    
                    <div *ngIf="moreDetails && data && widget.metrics.length>2">
                    <div style="font-size:15px;">{{widget.metrics[2].Name}}</div> 
                    <div style="font-size:15px;">{{  data[widget.metrics[2].DataSource] }}</div> 
                    <div class="col-sm-6">
                           <progress style="margin-left:-15px;" *ngIf="data" class="progress progress-xs progress-danger" value="{{data[widget.metrics[2].DataSource]}}" max="{{data[widget.metrics[1].DataSource]}}"></progress>
                    </div><br/>
                    </div>
                                   
                    <div *ngIf="moreDetails && data && widget.metrics.length>3">
                    <div style="font-size:15px;">{{widget.metrics[3].Name}}</div> 
                    <div style="font-size:15px;">{{  data[widget.metrics[3].DataSource] }}</div> 
                    <div class="col-sm-6">
                        <progress style="margin-left:-15px;" *ngIf="data" class="progress progress-xs progress-danger" value="{{data[widget.metrics[3].DataSource]}}" max="{{data[widget.metrics[1].DataSource]}}"></progress>
                    </div><br/><br/><br>
                    </div>  
                    <dadparameters [element]="widget" [editMode]="editMode" [onRefresh]="refreshMode" (parametersChanged)="changeData()"></dadparameters>  
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
  moreDetails:boolean = false;
  refreshMode:boolean = false;

    constructor(private dadWidgetDataService: DadElementDataService,
              private dadWidgetConfigsService: DadWidgetConfigsService) {}

    onRefresh():void{
        if (!this.refreshMode) this.refreshMode = true;
        else this.refreshMode = false;
    }

    addingZero(x:number):string{
        return (x <10 )? "0" + x : "" + x;
    }

    onEdit(message:string):void{
        if (!this.editMode) this.editMode = true;
        else this.editMode = false;
    }

    onMoreDetails(message:string):void{
        if (!this.moreDetails) this.moreDetails = true;
        else this.moreDetails = false;
    }

    changeData() {
    this.dadWidgetDataService.getElementData(this.widget).then(
      data => {
        this.data = data.data[0];
          this.fixNullsInMetrics();
      }
    );
  }

    percentageOfTotal(){
      if(this.data[this.widget.metrics[0].DataSource] == 0){
          return 0;
      }
      else {
          let percentage = this.data[this.widget.metrics[0].DataSource] / this.data[this.widget.metrics[1].DataSource];
          return Math.floor(percentage * 100);
      }
    }

    fixNullsInMetrics(){
      if (!this.data || !this.widget.metrics) return;
      for( let i:number=0; i<this.widget.metrics.length; i++)
        if (this.data[this.widget.metrics[i].DataSource] === null) this.data[this.widget.metrics[i].DataSource] = 0;
    }

  ngOnInit() {
    console.log("Widgets are loading... :" + this.widget.id);
     // this.mapParameters2ui();
    this.dadWidgetDataService.getElementData(this.widget).then(
      data => {
        this.data = data.data[0];
        this.fixNullsInMetrics();
      }
    ).catch(err => console.log(err.toString()));
  }
}
