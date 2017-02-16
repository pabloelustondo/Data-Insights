/**
 * Created by dister on 2/2/2017.
 */
import { Component,OnInit, AfterViewInit } from '@angular/core';
import { DadTableConfigsService, DadChartConfigsService,DadWidgetConfigsService ,DadPageConfigsService } from './chart.service';
import { DadElementDataService } from "./data.service";
import {Subscription } from 'rxjs';
import { ActivatedRoute} from '@angular/router';
import {DadWidget} from "./widget.component";
import {DadChart} from "./chart.component";
import {DadTable} from "./table.component";

export class DadPage {
    id: string;
    name: string;
    type?: string;
    widgetids: string[];
    chartids: string[];
    tableids: string[];
    widgets?: DadWidget[];
    charts?: DadChart[];
    tables?: DadTable[];
}

@Component({
    selector: 'dad',
    styles:['.row{overflow:hidden;}'],
    providers: [DadElementDataService, DadTableConfigsService,DadWidgetConfigsService, DadChartConfigsService, DadPageConfigsService],
    template: `
   <div *ngIf="page" class="animated fadeIn">
        <div *ngIf="page.widgets" class="row">
            <div class="col-m-12 row-sm-4" *ngFor="let widget of page.widgets">
                <dadwidget [widget]="widget"></dadwidget>
            </div>
        </div>
        <div *ngIf="page.charts" class="row">
            <div *ngFor="let chart of page.charts">
                <dadchart [chart]="chart"></dadchart>
            </div>
        </div>
    </div>
    `
})

export class  DadPageComponent implements OnInit{
    public title = 'DAD 0.0';
    public data;
    private subscription: Subscription;
    page: DadPage;
    public id : string;

    constructor(private dadTableConfigsService: DadTableConfigsService,
                private dadWidgetConfigsService: DadWidgetConfigsService,
                private dadPageConfigsService: DadPageConfigsService,
                private dadChartConfigsService: DadChartConfigsService,
                private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit()  {

        let tables = this.dadTableConfigsService.getTableConfigs();
        let charts = this.dadChartConfigsService.getChartConfigs();
        let widgets = this.dadWidgetConfigsService.getWidgetConfigs();

        this.subscription = this.activatedRoute.params.subscribe(
            (param: any) => {
                let callerPageId = param['id'];
                this.page = this.dadPageConfigsService.getPageConfig(callerPageId);

                this.page.charts = [];
                for(let chartid of this.page.chartids){
                    this.page.charts.push(this.dadChartConfigsService.getChartConfig(chartid));
                }

                this.page.widgets = [];
                for(let widgetid of this.page.widgetids){
                    this.page.widgets.push(this.dadWidgetConfigsService.getWidgetConfig(widgetid));
                }
            });
    }

}