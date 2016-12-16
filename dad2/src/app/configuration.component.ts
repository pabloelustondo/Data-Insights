/**
 * Created by pabloelustondo on 2016-11-19.
 */
import { Component, OnInit } from '@angular/core';
import { DadChart } from './chart.component';
import {DadChartConfigsService} from './chart.service';

declare var d3, c3: any;

const boxstyle = "display: inline-block;  vertical-align:top; ";

@Component({
    selector: 'dadconfig',
    providers: [DadChartConfigsService],
    template: `
    
    <div style="width:30%; display:inline-block;  vertical-align:top;" >
        <h2>Chart Configurations  <button *ngIf="dirty"(click)="saveConfiguration()">Save Changes</button> <button (click)="resetConfiguration()">Reset to Factory Settings</button></h2>
        <table>
        <tr *ngFor="let chart of charts">  
         <td> {{ chart.name }} </td>
         <td><img (click)="selectChart(chart)" width="20px" heigth="20px" src="/assets/images/edit.png"></td>      
        </tr>
        </table>
    </div>
    <div *ngIf="selectedChart" style="width:60%; display:inline-block;  vertical-align:top; border: solid;" > 
    <h2>Edit Configuration {{selectedChart.name}}</h2>
    <table>
       <tr><td><label>name: </label></td><td style="width:300px"><input style="width:300px" [(ngModel)]="selectedChart.name" placeholder="name"></td></tr>
       <tr><td><label>id: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.id" placeholder="id"></td></tr>
       <tr><td><label>type: </label></td><td><input style="width:300px"[(ngModel)]="selectedChart.type" placeholder="type"></td></tr>
       <tr><td><label>endpoint: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.endpoint" placeholder="endpoint"></td></tr>
       <tr><td><label>dimension: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.a" placeholder="dimension"></td></tr>
       <tr><td><label>measure: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.b" placeholder="measure"></td></tr>
       <tr><td><label>width: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.width" placeholder="width"></td></tr>
       <tr><td><label>height: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.height" placeholder="height"></td></tr>  
       <tr><td><label>dateFrom: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.parameters[0].dateFrom" placeholder="dateFrom"></td></tr>
       <tr><td><label>dateTo: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.parameters[0].dateTo" placeholder="dateTo"></td></tr>
       <tr><td><label>is Mini?: </label></td><td><input type="checkbox" [(ngModel)]="selectedChart.mini"/></td></tr>
     </table> 
       <div><img (click)="deleteChart()" width="20px" heigth="20px" src="/assets/images/delete.jpeg"></div>   
    </div>

    `
})

export class DadConfigComponent implements  OnInit{
    public title = 'Chart Configurations';
    public charts: DadChart[];
    public selectedChart: DadChart;
    public dirty:boolean = false;

    constructor(private dadChartConfigsService: DadChartConfigsService) { }

    selectChart(chart:DadChart){
      this.selectedChart = chart;
      this.dirty=true; //mh... do it better
    }

    saveConfiguration(){
      this.dadChartConfigsService.save(this.charts);
      this.dirty=false; //mh... do it better
    }

  resetConfiguration(){
    this.dadChartConfigsService.clearLocalCopy();
    this.charts = this.dadChartConfigsService.getChartConfigs();
  }

    deleteChart(chart:DadChart){
      this.charts = this.charts.filter(value => value.id!=this.selectedChart.id);
      this.dirty=true; //mh... do it better
      this.selectedChart = null;
    }

    ngOnInit() {
        this.charts = this.dadChartConfigsService.getChartConfigs();
    }

}
