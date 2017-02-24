/**
 * Created by dister on 2/2/2017.
 */
import { Component, Input } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadChartConfigsService} from './chart.service';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription } from 'rxjs';

@Component({
  selector: 'drillcharts',
  providers:[DadChartConfigsService],
  template: `
<h1>Drill Charts</h1>
        <div *ngIf="charts" class="row">
            <div *ngFor="let drillchart of charts">
                <dadchart [chart]="drillchart"></dadchart>
            </div>
        </div>
  `
})
export class DadDrillChartsComponent {
  @Input()
  chart: DadChart;

  charts: DadChart[];
  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private dadChartConfigsService: DadChartConfigsService
  ) { }


    createDrillChart(chart:DadChart, rowindex:number){
        let chartConfig = JSON.parse(JSON.stringify(chart)); //to clone object
        chartConfig.id += rowindex;
        chartConfig.reduction = chartConfig.reductions[rowindex];
        return chartConfig;
    }

  ngAfterViewInit(){

      this.subscription = this.activatedRoute.params.subscribe(
          (param: any) => {
              let chartid = param['id'];
              this.charts = [];
              this.chart = this.dadChartConfigsService.getChartConfig(chartid);
              for (let i=0; i<this.chart.reductions.length; i++) {
                let drillchart = this.createDrillChart(this.chart,i);
                  this.charts.push(drillchart);
                  this.dadChartConfigsService.saveOne(drillchart);
                  console.log("Charts are loading... :" + drillchart.id);
              }
          });
  }


}
