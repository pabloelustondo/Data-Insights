/**
 * Created by dister on 12/14/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
import {DadChart} from "./chart.component";
import {DadWidgetDataService} from "./data.service";
import {Mapper} from "./mapper";
import {DadDateRange} from "./dadmodels"

export class DadWidget {
  id: string;
  name: string;
  type?:string;
  dateRange?: DadDateRange;
  parameters: any[];  //we are going to change this!
  endpoint :string;
  a: string;
  b: string;
  chart?: DadChart;
}

@Component({
  selector: 'dadwidget',
  providers:[DadWidgetDataService],
  template: ` <!--  BEGIN CHART COMPONENT -->
    <div class="widget1">
    <table id="widgetTable">
    <th><div id="widgetName">{{widget.name}}</div></th>
        <tr>
            <div id="values" *ngIf="data"><a style="color:blue;" href="/table">{{data.Metric[0]}}</a>{{"/"}}{{data.Dimension[data.Metric[0]]}}</div>            
            <!--
            <div id="widgetDate">
            <label>Date: </label>
            <input [(ngModel)]="widget.parameters[0].date" placeholder=" yyyy-mm-dd"> 
            </div>-->
            
            <div id="widgetStartTime">
            <label>Start Date & Time: </label>
            <!--<ng2-datepicker [(ngModel)]="firstDate"></ng2-datepicker>-->
            <input [(ngModel)]="this.widget.parameters[0].shiftStartDateTime" placeholder="hh:mm am">
            </div>
           
            <div id="widgetDuration">
            <label>Duration: </label>
            <input [(ngModel)]="this.widget.parameters[0].shiftDuration" placeholder="8">
            </div>
        </tr>
        <div>
            <button (click)="changeData($event)">Refresh</button>
        </div>
    </table>
    </div>
  <!-- to show chart in widgets, use the line below-->
  <!--<dadchart [chart]="widget.chart"></dadchart>-->

    <!--  END CHART COMPONENT -->`
})
export class DadWidgetComponent implements OnInit {
  @Input()
  widget: DadWidget;
  data;
  mapper: Mapper = new Mapper();
  firstDate: any;

  constructor(private dadWidgetDataService: DadWidgetDataService) { }
  changeData(event){
    this.dadWidgetDataService.getWidgetData(this.widget).then(
      data => {
        this.data = this.mapper.map(this.widget, data.data);
      }
    );
  }

  ngOnInit() {
    console.log("Widgets are loading... :" + this.widget.id);
    this.dadWidgetDataService.getWidgetData(this.widget).then(
      data => {
        this.data = this.mapper.map(this.widget, data.data);
      }
    ).catch(err => console.log(err.toString()));
  }
}
