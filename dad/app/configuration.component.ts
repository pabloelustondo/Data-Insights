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
         <b> {{ chart.name }} </b><br/>
         id:   {{ chart.id }}<br/><br/>
        </div>

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

