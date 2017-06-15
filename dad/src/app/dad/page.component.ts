/**
 * Created by dister on 2/2/2017.
 */
import { Component, Input, Output, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { DadConfigService } from './dadconfig.service';
import { DadElementDataService } from "./data.service";
import {Subscription } from 'rxjs';
import { ActivatedRoute} from '@angular/router';
import {DadWidget} from "./widget.component";
import {DadChart} from "./chart.component";
import {DadTable} from "./table.component";
import { DadElement } from './dadmodels';
import { config } from "./appconfig";
import { DadUser, DadElementType } from "./dadmodels";
import { DadCrudComponent} from './crud.component';

export class DadPage {
    id: string;
    elementType?:DadElementType;
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
    providers: [DadElementDataService, DadConfigService],
    template: `
   <div *ngIf="page" class="animated fadeIn">
        <div *ngIf="page.widgets" class="row">
            <button style="cursor:pointer" title="Click to add a new element" class="glyphicons glyphicons-plus pull-right" (click)="selectElement()"></button> <br/><br/>
            <select *ngIf="selectingElement" [(ngModel)]="selectedValue" #selectedOption (change)="selectElement($event.target.value);" class="form-control pull-right" style=" display: inline-block; color:black; font-weight: bold; max-width:150px;" >
                     <option id="created" style="color:black;" *ngFor="let option of options; let i=index" value="{{i}}" [selected]="option.name" >{{ option.name }}</option>
            </select>
                  
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
    selectingElement: boolean = false;

    constructor(private dadConfigService: DadConfigService,
                private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit()  {

        this.user = JSON.parse(localStorage.getItem('daduser'));
        if (!this.page) {
            this.subscription = this.activatedRoute.params.subscribe(
                (param: any) => {
                    let callerPageId = param['id'];
                    this.dadConfigService.getPageConfig(callerPageId).then((page) => {
                        this.page = page;

                        this.page.charts = [];
                        for (let chartid of this.page.chartids) {
                            this.dadConfigService.getChartConfig(chartid).then((chart) => {
                              //  let chart = element as DadChart;
                                if (chart) this.page.charts.push(chart);
                            })
                        }

                        this.page.widgets = [];
                        for (let widgetid of this.page.widgetids) {
                            this.dadConfigService.getWidgetConfig(widgetid).then((widget) => {
                                if (widget) this.page.widgets.push(widget);
                            });
                        }
                    });


                });
        }
    }


    selectElement(){
        if (!this.selectingElement) this.selectingElement = true;
        else this.selectingElement = false;
    }

    selectDataSet(){}

}