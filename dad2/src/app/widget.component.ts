import {Mapper} from "./mapper";
import {DadChart} from "./chart.component";
import {DadChartDataService} from "./data.service";
import { Component, Input, OnInit  } from '@angular/core';
/**
 * Created by dister on 12/14/2016.
 */

export class DadWidget extends DadChart{
  name: string;
}

@Component({
  selector: 'dadwidget',
  providers:[DadChartDataService],
  template: ` <!--  BEGIN CHART COMPONENT -->
    {{widget.name}}

    <!--  END CHART COMPONENT -->`
})
export class DadWidgetComponent implements OnInit {
  @Input()
  widget: DadWidget
  data;
  mapper: Mapper = new Mapper();

  constructor(private dadChartDataService: DadChartDataService) { }

  ngOnInit() {
    console.log("WIDGET starts drawing :" + this.widget.id);
    this.dadChartDataService.getChartData(this.widget).then(
      data => {
        this.data = data.data;
      }
    ).catch(err => console.log(err.toString()));
  }
}
