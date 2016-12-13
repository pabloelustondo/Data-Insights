/**
 * Created by pabloelustondo on 2016-11-19.
 */
import { Component, OnInit } from '@angular/core';
import { DadChart } from '../iChart/iChart.component';
//import { NgGrid, NgGridItem } from 'angular2-grid';

declare var d3, nv: any;

@Component({
  selector: 'demo-chart',
  template: require('./demoChart.html')
})

export class demoChart implements  OnInit{
  public title = 'DAD 0.0';
  public dadcharts: DadChart[];
  public selectedChart:DadChart;
  //public data;


  onSelect(dadchart:DadChart):void {
    this.selectedChart = dadchart;
  }

  //   constructor(private _heroService: HeroService, private _router: Router) { }

  ngOnInit() {
    this.title = "DAD 0.0 - Angular 2.2 +  NVD3";
    console.log("APP  starts drawing all charts in dashboard:");
    const CHARTS: DadChart[] = [
      { id: "chart1", name: 'Number of Devices by Range Pie Chart 1' },
      { id: "chart2", name: 'Number of Devices by Range Pie Chart 2' },
      { id: "chart3", name: 'Number of Devices by Range Pie Chart 3' }
    ];
    this.dadcharts = CHARTS;
  }

}

