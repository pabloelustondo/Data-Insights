/**
 * Created by dister on 2/2/2017.
 */
import { Component, Input } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadConfigService} from './dadconfig.service';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription } from 'rxjs';

@Component({
  selector: 'drillcharts',
  providers:[DadConfigService],
  template: `
        <div *ngIf="chart && charts" class="card-block pb-0">
        <h1>{{chart.name}}</h1>
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
              private dadChartConfigsService: DadConfigService
  ) { }


    createDrillChart(chart:DadChart, rowindex:number){

                        let chartConfig = JSON.parse(JSON.stringify(chart)); //to clone object
                        chartConfig.id += rowindex;
                        this.dadChartConfigsService.getChartConfig(chartConfig.id).then((drillChart) => {

                            if(!drillChart) {
                                chartConfig.reduction = chartConfig.reductions[rowindex];
                                chartConfig.filter = chartConfig.filters[rowindex]
                                drillChart = chartConfig;
                                this.dadChartConfigsService.saveOne(drillChart);
                            }
                            this.charts.push(drillChart);
                        })
    }

  ngAfterViewInit(){

      this.subscription = this.activatedRoute.params.subscribe(
          (param: any) => {
              let chartid = param['id'];
              this.charts = [];
              this.dadChartConfigsService.getChartConfig(chartid).then((chart) => {
                  this.chart = chart;
                  for (let i=0; i<this.chart.reductions.length; i++) {
                      this.createDrillChart(this.chart,i);
                  }
              });
          });
  }


}
