/**
 * Created by pabloelustondo on 2016-11-19.
 */
import { Component, OnInit } from '@angular/core';
import { DadChart } from './chart.component';
import { DadChartConfigsService } from './chart.service';

declare var d3, nv: any;

@Component({
    selector: 'dadconfig',
    providers: [DadChartConfigsService],
    template: `

    <h2>Chart Configurations</h2>
        <div *ngFor="let chart of charts">  
        <table>

         <tr><td> Chartid: </td><td>  {{ chart.id }}</td></tr>
         <tr><td>  Name: </td><td>{{ chart.name }} </td></tr>
         <span *ngFor="let param of chart.parameters">        
               <tr><td> Parameter Type: </td><td>  {{param.parameterType}} </td></tr>
               <tr><td> dateFrom: </td><td>  {{param.dateFrom}} </td></tr>
               <tr><td> dateTo: </td><td>  {{param.dateTo}} </td></tr>            
        </span>   
        </table>

    `
})

export class DadConfigComponent implements  OnInit{
    public title = 'Chart Configurations';
    public charts: DadChart[];

    constructor(private dadChartConfigsService: DadChartConfigsService) { }

    ngOnInit() {
        this.charts = this.dadChartConfigsService.getChartConfigs();
    }

}

