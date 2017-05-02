/**
 * Created by dister on 2/2/2017.
 */
import { Component, Input, Output, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { DadTableConfigsService, DadChartConfigsService,DadWidgetConfigsService ,DadPageConfigsService } from './chart.service';
import { DadElementDataService } from "./data.service";
import {Subscription } from 'rxjs';
import { ActivatedRoute} from '@angular/router';
import {DadWidget} from "./widget.component";
import {DadChart} from "./chart.component";
import {DadTable} from "./table.component";
import { config } from "./appconfig";
import { DadUser } from "./dadmodels";

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
    selector: 'dadpage',
    styles:['.row{overflow:hidden;}'],
    providers: [DadElementDataService, DadTableConfigsService,DadWidgetConfigsService, DadChartConfigsService, DadPageConfigsService],
    template: `
   <div *ngIf="page" class="animated fadeIn">
        <div *ngIf="page.widgets" class="row">
            <div class="col-m-12 row-sm-4" *ngFor="let widget of page.widgets">
                <dadwidget [widget]="widget" [page]="page"></dadwidget>
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
    @Input()
    page: DadPage;
    public id : string;
    user: DadUser;

    constructor(private dadTableConfigsService: DadTableConfigsService,
                private dadWidgetConfigsService: DadWidgetConfigsService,
                private dadPageConfigsService: DadPageConfigsService,
                private dadChartConfigsService: DadChartConfigsService,
                private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit()  {

        this.user = JSON.parse(localStorage.getItem('daduser'));
        if (!this.page) {
            this.subscription = this.activatedRoute.params.subscribe(
                (param: any) => {
                    let callerPageId = param['id'];
                    this.dadPageConfigsService.getPageConfig(callerPageId).then((page) => {
                        this.page = page;

                        this.page.charts = [];
                        for (let chartid of this.page.chartids) {
                            this.dadChartConfigsService.getChartConfig(chartid).then((chart) => {
                              //  let chart = element as DadChart;
                                if (chart) this.page.charts.push(chart);
                            })
                        }

                        this.page.widgets = [];
                        for (let widgetid of this.page.widgetids) {
                            this.dadWidgetConfigsService.getWidgetConfig(widgetid).then((widget) => {
                                if (widget) this.page.widgets.push(widget);
                            });
                        }
                    });


                });
        }
    }

}