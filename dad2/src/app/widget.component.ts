/**
 * Created by pablo elustondo on 12/14/2016.
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
  template: ` 
    <div class="widget1">
    <table id="widgetTable">
    <th><div id="widgetName">{{widget.name}}</div></th>
        <tr>
            <div id="values" *ngIf="data"><a style="color:blue;" href="/table">{{data.Metric[0]}}</a>{{" out of "}}{{data.Dimension[data.Metric[0]]}}</div>                        
            <div id="widgetStartDate">
            <label>Start Date: </label>
            <input type="date" style="color: black" [(ngModel)]="startDate"/>
           </div>
           <div id="widgetStartDate">
            <label>Start Time: </label>
            <input type="time" style="color: black" [(ngModel)]="startTime"/>
           </div>
            <div id="widgetDuration">
            <label>Duration: </label>
             <input type="time" style="color: black" [(ngModel)]="duration"/>
            </div>
        </tr>
        <div>
            <button (click)="changeData($event)">Refresh</button>
        </div>
    </table>
    </div>
    `
})
export class DadWidgetComponent implements OnInit {
  @Input()
  widget: DadWidget;
  data;
  mapper: Mapper = new Mapper();
  startDate: string = "2016-08-15";
  startTime: string = "08:00:00";
  duration: string = "08:00:00";

  constructor(private dadWidgetDataService: DadWidgetDataService) {}

  changeData(event) {

    this.widget.parameters[0].shiftStartDateTime = this.startDate +"T" + this.startTime;
    this.widget.parameters[0].shiftDuration  = this.mapDuration(this.duration);
    this.dadWidgetDataService.getWidgetData(this.widget).then(
      data => {
        this.data = this.mapper.map(this.widget, data.data);
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
        this.data = this.mapper.map(this.widget, data.data);
      }
    ).catch(err => console.log(err.toString()));
  }
}
