/**
 * Created by dister on 2/2/2017.
 */
import { Component, Input } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadConfigService} from './dadconfig.service';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription } from 'rxjs';

@Component({
  selector: 'bigchart',
  providers:[DadConfigService],
  template: `
  <div style="min-width: 800px" *ngIf = "chart">
    <dadchart [chart]="chart"></dadchart>
  </div>
  `
})
export class DadBigChartComponent {
  @Input()
  chart: DadChart;
  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private dadChartConfigsService: DadConfigService
  ) { }

  ngAfterViewInit(){

      this.subscription = this.activatedRoute.params.subscribe(
          (param: any) => {
              let chartid = param['id'];
              this.dadChartConfigsService.getChartConfig(chartid).then((chart) => {
                  this.chart.big = true;
                  console.log("Charts are loading... :" + this.chart.id);
              });
          });
  }


}
