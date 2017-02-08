/**
 * Created by dister on 2/2/2017.
 */
import { Component, Input } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadChartConfigsService} from './chart.service';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription } from 'rxjs';

@Component({
  selector: 'bigchart',
  providers:[DadChartConfigsService],
  template: `
  <div *ngIf = "chart">
    <dadchart [chart]="chart"></dadchart>
  </div>
  `
})
export class DadBigChartComponent {
  @Input()
  chart: DadChart;
  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private dadChartConfigsService: DadChartConfigsService
  ) { }

  ngAfterViewInit(){

      this.subscription = this.activatedRoute.params.subscribe(
          (param: any) => {
              let chartid = param['id'];
              this.chart = this.dadChartConfigsService.getChartConfig(chartid);
              console.log("Charts are loading... :" + this.chart.id);
          });
  }


}
