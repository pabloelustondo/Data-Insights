/**
 * Created by dister on 12/14/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
import {DadChart} from "./chart.component";
import {DadWidgetDataService} from "./data.service";
import {Mapper} from "./mapper";

export class DadWidget {
  id: string;
  name: string;
  parameters: any[];
  endpoint :string;
  a: string;
  b: string;
  chart?: DadChart;
}

@Component({
  selector: 'dadwidget',
  providers:[DadWidgetDataService],
  template: ` <!--  BEGIN CHART COMPONENT -->
    {{widget.name}}
  <!-- to show chart in widgets, use the line below-->
  <!--<dadchart [chart]="widget.chart"></dadchart>-->

    <!--  END CHART COMPONENT -->`
})
export class DadWidgetComponent implements OnInit {
  @Input()
  widget: DadWidget;
  chart: DadChart;
  data;
  mapper: Mapper = new Mapper();

  constructor(private dadWidgetDataService: DadWidgetDataService) { }

  ngOnInit() {
    console.log("Widgets are loading... :" + this.widget.id);
    this.dadWidgetDataService.getWidgetData(this.widget).then(
      data => {
        this.data = data.data;
      }
    ).catch(err => console.log(err.toString()));
  }
}
