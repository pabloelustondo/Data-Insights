/**
 * Created by pablo elustondo on 12/14/2016.
 */
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadWidgetDataService } from "./data.service";
import { Mapper } from "./mapper";
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"

export class DadWidget {
  id: string;
  name: string;
  parameters: any[];
  uiparameters?: DadParameter[];
  a?:string;
  b?:string;
  parameterMappers?:any[];
  endpoint: string;
  type?:string;
  chart?: DadChart;
  metrics?: DadMetric[];
  dimensions?: DadDimension[];
}

@Component({
  selector: 'dadwidget',
  providers:[DadWidgetDataService],
  template: ` 
    <div class="widget1">
    <div id="widgetName">{{widget.name}}</div>
           
          <div id="values" *ngIf="data">
               <div *ngFor="let metric of widget.metrics"><a style="color:blue;" href="/table"> {{metric.Name}}: {{ data[metric.DataSource] }}</a></div>                     
          </div>
          <table>       
            <tr *ngFor="let uiparam of widget.uiparameters">
               <td><label>uiparam.Name</label></td>
               <td><input type="date" style="color: black" [(ngModel)]="uiparam.Value"/></td>
            </tr>
          </table>
        <div>
            <button (click)="changeData($event)">Refresh</button>
        </div>
    </div>
    `
})
export class DadWidgetComponent implements OnInit {
  @Input()
  widget: DadWidget;
  data;
  mapper: Mapper = new Mapper();

  constructor(private dadWidgetDataService: DadWidgetDataService) {}

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
