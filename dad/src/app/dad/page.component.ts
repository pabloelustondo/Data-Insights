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
import { DadUser, DadElementType, DadUIElement } from "./dadmodels";
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
            <span style="cursor:pointer" title="Click to add a new element" class="glyphicons glyphicons-plus pull-right" (click)="selectElement()"></span> <br/><br/>
            <input style="max-width:150px" *ngIf="selectingElement" [(ngModel)]="elementName" class="pull-right" type="text" placeholder="New Element Name" required> <br/><br/>

            <select *ngIf="selectingElement" [(ngModel)]="selectedValue" #selectedOption class="form-control pull-right" style=" display: inline-block; color:black; font-weight: bold; max-width:150px;" >
                     <option id="option_chart" style="color:black;" value="chart">Chart</option>
                     <option id="option_widget" style="color:black;" value="widget">Widget</option>
            </select> <br/><br/>
            
           <select *ngIf="selectedValue=='chart'" [(ngModel)]="selectedChartType" #selectedOption class="form-control pull-right" style=" display: inline-block; color:black; font-weight: bold; max-width:150px;" >
                <option id="option_chart_bar" style="color:black;" value="bar">Bar Chart</option>
                <option id="option_chart_pie" style="color:black;" value="pie">Pie Chart</option>
                <option id="option_chart_pie" style="color:black;" value="map">Map</option>
            </select> <br/><br/>
            <!--
            <select *ngIf="selectedValue=='widget'" [(ngModel)]="selectedWidgetType" #selectedOption class="form-control pull-right" style=" display: inline-block; color:black; font-weight: bold; max-width:150px;" >
                <option id="option_widget" style="color:black;" value="tile">Tile</option>
                <option id="option_widget_chart" style="color:black;" value="widget.chart">Widget Chart</option>
            </select> <br/><br/>
            -->
             <div *ngIf="selectingElement">
                 <span id='cancel' class="glyphicons glyphicons-remove pull-right" (click)="selectElement()"></span>
                 <span id='apply' class="glyphicons glyphicons-ok pull-right" (click)="addElement()"></span>
             </div>
            
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
    selectingElement: boolean = false;
    selectedValue: any = -1;
    selectedChartType: any = -1;
    selectedWidgetType: any = -1;
    value: string;
    elementName: string;

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
        this.selectedValue ="";

    }

    addElement(){
        let newElement: DadUIElement;
        //chart
        if(this.selectedValue == 'chart') {
            newElement = new DadChart();
            newElement.name =  this.elementName;
           // newElement.endpoint = ;
            if(this.elementName) {
                newElement.id = this.elementName;
            } else{ newElement.id = Date.now().toString();}
            this.page.chartids.push(newElement.id);
            this.page.charts.push(newElement);

            if(this.selectedChartType == 'bar'){
                newElement.type = 'bar';
            }
            if(this.selectedChartType == 'pie'){
                newElement.type = 'pie';
            }
            if(this.selectedChartType == 'map'){
                newElement.type = 'map2';
                newElement.dataElement = 'vehicle';
                newElement.parameters = [];
                newElement.uiparameters = [];
                newElement.lon = 'lon';
                newElement.lat = 'lat';
              //  newElement.endpoint = 'QueryTopics';
            }

            this.dadConfigService.saveOne(newElement);
            this.dadConfigService.saveOne(this.page);

            }
        //widget
        if(this.selectedValue == 'widget') {
            newElement = new DadWidget();
            newElement.name =  this.elementName;
            if(this.elementName) {
                newElement.id = this.elementName;
            } else{ newElement.id = Date.now().toString();}
            newElement.type = 0;
           /* if(this.selectedWidgetType == 'Tile'){
                newElement.type = 0;
            }
            if(this.selectedWidgetType == 'Widget Chart'){
                newElement.type = 1;
            }
            */
            this.page.widgetids.push(newElement.id);
            this.page.widgets.push(newElement);

            this.dadConfigService.saveOne(newElement);
            this.dadConfigService.saveOne(this.page);

        }
        this.selectElement();

    }

    selectDataSet(){}

}