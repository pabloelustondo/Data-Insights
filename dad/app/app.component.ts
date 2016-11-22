/**
 * Created by pabloelustondo on 2016-11-19.
 */
import { Component, OnInit } from '@angular/core';
import { DadChart } from './chart.component';

declare var d3, nv: any;

@Component({
    selector: 'my-app',
    template: `

    <h1>{{title}}</h1>
       <!--  this is just for debugging to show the configuration of a specific chart. -->
    <div *ngIf="selectedChart">
     <div>Configuration Details for <b>{{selectedChart.name}}</b>  </div>
     <table>
     <tr>
     <td>id:</td>
     <td>name:</td></tr>
     <tr>
     <td>{{selectedChart.id}}</td>
     <td>{{selectedChart.name}}</td></tr>
     </table>
    </div>
    
   <!--  BEGIN SHOWING THE CHARTS IN THE MOC DASHBOARD-->
   <h2>Charts</h2>
    <div class="chart" *ngFor="let chart of charts">
   
    <!--  BEGIN CHART COMPONENT 
    <table style="border:solid"><tr><td>
    <div (click)="onSelect(chart)">{{chart.name}}</div>
    </td></tr>
    <tr><td>
    <div style="height: 300px  "><svg [id]="chart.id"></svg></div>
    </td><td>
    <div>Raw Data: 
        <div *ngFor ="let d of data.result">
        {{d.Rng}} -- {{d.NumberOfDevices}}
        </div>
    </div></td></tr>
    </table>
    <br/>
    <br/>
    DEBUG AREA:    <br/>
    <input style="width: 300px;" [(ngModel)]="chart.name" placeholder="name">

    END CHART COMPONENT -->
    
     
    <dadchart [chart]="chart"></dadchart>
   

    </div>
      <!--  BEGIN SHOWING THE CHARTS IN THE MOC DASHBOARD-->


    `
})

export class AppComponent implements  OnInit{
    public title = 'DAD 0.0';
    public charts: DadChart[];
    public selectedChart:DadChart;
    public data;


    onSelect(chart:DadChart):void {
        this.selectedChart = chart;
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
        this.charts = CHARTS;
    }

}

