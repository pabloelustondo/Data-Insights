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
            <label>Start Date & Time: </label>
            <ng2-datepicker [(ngModel)]="firstDate"></ng2-datepicker>
            <!--<input [(ngModel)]="this.widget.parameters[0].shiftStartDateTime" placeholder="hh:mm am">-->
            <!--<input [ngModel]="date" (focus)="toggleDatePicker(true)" readonly />
            <date-picker *ngIf="showDatePicker" [initDate]="date"
           (onDatePickerCancel)="toggleDatePicker($event)"
           (onSelectDate)="setDate($event)"></date-picker>-->
           </div>
           <!--
           <div id="widgetStartTime">
           <label>Start Time: </label>
           <input [ngModel]="firstDate" (focus)="toggleTimePicker(true)" readonly />
           <time-picker *ngIf="showTimePicker"
           (onTimePickerCancel)="toggleTimePicker($event)"
           (onSelectTime)="setTime($event)"></time-picker>
            </div>
               -->

            <div id="widgetDuration">
            <label>Duration: </label>
            <ng-select id="dropdown"
                [multiple]="false"
                [options]="myOptions"
                [(ngModel)]="duration">
            </ng-select>
                <!--<dropdown [(ngModel)]="duration" [numbers]="[1,2,3,4,5,6]"></dropdown>-->
            <!--<input [(ngModel)]="this.widget.parameters[0].shiftDuration" placeholder="8">-->
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
  duration: any;
  myOptions: Array<any>;

  constructor(private dadWidgetDataService: DadWidgetDataService) {}

  //date*private date: any;
  //private showDatePicker: boolean;
  //toggleDatePicker(status: boolean): void  {
   // this.showDatePicker = status;
  //}
  /*setDate(date: any): void {
    this.date = date;
  }*/
  //time
  /*private time: any;
  private showTimePicker: boolean;
  toggleTimePicker(status: boolean): void  {
    this.showTimePicker = status;
  }
  setTime(time: any): void {
    this.time = time;
  }*/

  changeData(event) {
    this.widget.parameters[0].shiftStartDateTime = this.firstDate.formatted;
    this.widget.parameters[0].shiftDuration = this.duration;
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
    this.myOptions = [
      {value: '1', label: '1'}, {value: '1.5', label: '1.5'}, {value: '2', label: '2'}, {value: '2.5', label: '2.5'}, {value: '3', label: '3'}, {value: '3.5', label: '3.5'},
      {value: '4', label: '4'}, {value: '4.5', label: '4.5'}, {value: '5', label: '5'}, {value: '5.5', label: '5.5'}, {value: '6', label: '6'}, {value: '6.5', label: '6.5'},
      {value: '7', label: '7'}, {value: '7.5', label: '7.5'}, {value: '8', label: '8'}, {value: '8.5', label: '8.5'}, {value: '9', label: '9'}, {value: '9.5', label: '9.5'},
      {value: '10', label: '10'}, {value: '10.5', label: '10.5'}, {value: '11', label: '11'}, {value: '11.5', label: '11.5'}, {value: '12', label: '12'}, {value: '12.5', label: '12.5'},
      {value: '13', label: '13'}, {value: '13.5', label: '13.5'}, {value: '14', label: '14'}, {value: '14.5', label: '14.5'}, {value: '15', label: '15'}, {value: '15.5', label: '15.5'},
      {value: '16', label: '16'}, {value: '16.5', label: '16.5'}, {value: '17', label: '17'}, {value: '17.5', label: '17.5'}, {value: '18', label: '18'}, {value: '18.5', label: '18.5'},
      {value: '19', label: '19'}, {value: '19.5', label: '19.5'}, {value: '20', label: '20'}, {value: '20.5', label: '20.5'}, {value: '21', label: '21'}, {value: '21.5', label: '21.5'},
      {value: '22', label: '22'}, {value: '22.5', label: '22.5'}, {value: '23', label: '23'}, {value: '23.5', label: '23.5'}, {value: '24', label: '24'}
    ];
  }
}
