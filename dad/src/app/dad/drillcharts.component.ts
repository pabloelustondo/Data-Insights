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
              private dadChartConfigsService: DadChartConfigsService
  ) { }


    createDrillChart(chart:DadChart, rowindex:number){
        let  newid =  chart.id + rowindex;
        //try to find this in the configuration
        return this.dadChartConfigsService.getChartConfig(newid).then(
            (data)=>{
                    let drillChart:DadChart;
                    if (!data){
                        let chartConfig = JSON.parse(JSON.stringify(chart)); //to clone object
                        chartConfig.id += rowindex;
                        chartConfig.reduction = chartConfig.reductions[rowindex];
                        drillChart = chartConfig;
                        this.dadChartConfigsService.saveOne(drillChart);
                    }else {
                        drillChart = data;
                    }
                this.charts.push(drillChart);
            },
            (error) => {
                //?
            });

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
