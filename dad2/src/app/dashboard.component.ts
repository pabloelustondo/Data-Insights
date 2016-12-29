/**
 * Created by pabloelustondo on 2016-11-19.
 */
import { Component, OnInit } from '@angular/core';
import { DadChart } from './chart.component';
import { DadChartConfigsService, DadWidgetConfigsService, DadTableConfigsService } from './chart.service';
import { DadWidget } from "./widget.component";
import { DadTable } from "./table.component";

declare var d3, c3: any;

@Component({
    selector: 'dad',
    providers: [DadChartConfigsService, DadWidgetConfigsService, DadTableConfigsService],
    template: `   
    <div class="widgetcontainer">
      <div *ngFor="let widget of widgets">
      <dadwidget [widget]="widget"></dadwidget>
      </div>
    </div>
    
    <div style="clear: both;">
    <div class="chart" *ngFor="let chart of charts">
    <dadchart [chart]="chart"></dadchart>
    </div>
    </div>
    `
})

export class DadComponent implements  OnInit{
    public title = 'DAD 0.0';
    public charts: DadChart[];
    public widgets: DadWidget[];
    public tables: DadTable[];
    public selectedChart:DadChart;
    public data;

    constructor(private dadChartConfigsService: DadChartConfigsService,
                private dadWidgetConfigsService: DadWidgetConfigsService,
                private dadTableConfigsService: DadTableConfigsService
    ) { }

    onSelect(chart:DadChart):void {
        this.selectedChart = chart;
    }

    ngOnInit() {
        this.charts = this.dadChartConfigsService.getChartConfigs();
        this.widgets = this.dadWidgetConfigsService.getWidgetConfigs();
        this.tables = this.dadTableConfigsService.getTableConfigs();
    }
}


