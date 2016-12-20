/**
 * Created by dister on 12/14/2016.
 */
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import {DadChart} from "./chart.component";
import {DadWidgetDataService} from "./data.service";
import {Mapper} from "./mapper";

export class DadWidget {
  id: string;
  name: string;
  parameters: any[];
  endpoint: string;
  type?:string;
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
            
            <div id="widgetStartDate">
            <label>Start Date: </label>
            <!--<ng2-datepicker [(ngModel)]="firstDate"></ng2-datepicker>-->
            <!--<input [(ngModel)]="this.widget.parameters[0].shiftStartDateTime" placeholder="hh:mm am">-->
            <input [ngModel]="date" (focus)="toggleDatePicker(true)" readonly />
            <date-picker *ngIf="showDatePicker" [initDate]="date"
           (onDatePickerCancel)="toggleDatePicker($event)"
           (onSelectDate)="setDate($event)"></date-picker>
           </div>
           
           <div id="widgetStartTime">
           <label>Start Time: </label>
           <input [ngModel]="time" (focus)="toggleTimePicker(true)" readonly />
           <time-picker *ngIf="showTimePicker" [initTime]="time"
           (onTimePickerCancel)="toggleTimePicker($event)"
           (onSelectTime)="setTime($event)"></time-picker>
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

  constructor(private dadWidgetDataService: DadWidgetDataService) {

  }
  //date
  private date: any;
  private showDatePicker: boolean;
  toggleDatePicker(status: boolean): void  {
    this.showDatePicker = status;
  }
  setDate(date: any): void {
    this.date = date;
  }
  //time
  private time: any;
  private showTimePicker: boolean;
  toggleTimePicker(status: boolean): void  {
    this.showTimePicker = status;
  }
  setTime(time: any): void {
    this.time = time;
  }

  changeData(event) {
    this.widget.parameters[0].shiftStartDateTime = this.firstDate.formatted;
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
