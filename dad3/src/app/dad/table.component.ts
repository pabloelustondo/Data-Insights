/**
 * Created by pablo elustodo on 12/14/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadElementDataService } from "./data.service";
import { Mapper, ChartData } from "./mapper";
import { DadDateRange, DadElement} from "./dadmodels";
import { DadTableColumn, DadTableColumnType } from "./table.model"
import { DadChartComponent } from "./chart.component"
import { DadTableConfigsService, DadChartConfigsService} from './chart.service';
import { DadWidgetConfigsService } from './chart.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { DadWidget} from "./widget.component";
import { config } from "./appconfig";

export class DadTable {
  id: string;
  name: string;
  type?:string;
  data?:any[];
  parameters: any[];  //we are going to change this!
  endpoint :string;
  columns: DadTableColumn[];
  chart?: DadChart;
}

@Component({
  selector: 'dadtable',
  providers:[DadElementDataService,DadTableConfigsService,DadWidgetConfigsService, DadChartConfigsService],
  template: ` 
    <div *ngIf="data">
        <div class="col-lg-10">
            <div class="card">
                <div class="card-header">
                    <h4>{{table.name}}</h4>
                       Number of Rows:{{count}}
                    <span *ngFor="let key of tableParameterKeys()"> 
                       {{key}}:{{tableParameterValue(key)}}
                    </span>
                </div>
                <div class="card-block">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th style="text-align:left;" *ngFor="let col of table.columns" >{{col.Name}}</th>
                            </tr>  
                        </thead>
                        <tbody>
                            <tr *ngFor="let row of data; let rowindex = index">
                                <td style="align-content: center;" *ngFor="let col of table.columns">
                                    <span *ngIf="!isMiniChart(col)"> {{row[col.DataSource]}} </span>
                                    <span *ngIf="isMiniChart(col)"> 
                                        <dadchart [chart]="miniChart(col,rowindex)" [data]="chartData(row,col)"></dadchart>
                                    </span>        
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <ul class="pagination" style="cursor:pointer;">
                        <span *ngFor="let page of pages">               
                            <li  *ngIf="page == currentPage" class="page-item active" ><a class="page-link" (click)=refresh(page) >{{page+1}}</a></li>
                            <li  *ngIf="page != currentPage" class="page-item" ><a class="page-link" (click)=refresh(page) >{{page+1}} </a></li>
                        </span>
                    </ul>
                </div>
            </div>
        </div>

    <!--  END CHART COMPONENT --></div>`
})
export class DadTableComponent implements OnInit {
  @Input()
  table: DadTable;
  data: any;
  chartData(row,col){
    return JSON.parse(row[col.DataSource]);
  }
  count:number = 0;
  private subscription: Subscription;
  pages:number[];
  currentPage:number=0;
  callerId:string;
  callerElement: DadElement;

  constructor(private dadTableDataService: DadElementDataService,
              private dadTableConfigsService: DadTableConfigsService,
              private dadWidgetConfigsService: DadWidgetConfigsService,
              private activatedRoute: ActivatedRoute,
              private dadChartConfigsService: DadChartConfigsService
  ) { }

  isMiniChart(col:DadTableColumn){
    return col.Type == DadTableColumnType.MiniChart;
  }

  miniChart(col:DadTableColumn, rowindex:number){
    let chartConfig = JSON.parse(JSON.stringify(col.MiniChart)); //to clone object
    chartConfig.id += rowindex;
    return chartConfig;
  }

  refresh(page:number){

    this.currentPage = page;
    this.table.parameters[0].rowsSkip = page * this.table.parameters[0].rowsTake;
    this.dadTableDataService.getElementData(this.table).then(
        data => {
          this.data = data.data;
        }
    ).catch(err => console.log(err.toString()));
  }

  tableParameterKeys(){
    let keys = Object.keys(this.table.parameters[0]);
    return keys;

}
    tableParameterValue(key:string){
        let parameters  = this.table.parameters[0];
        return parameters[key];
    }

    findTables(tableId: string) {
        let tables = this.dadTableConfigsService.getTableConfigs();

        for (var i=0; i< tables.length; i++){
            if (tables[i].id === tableId){
                return tables[i];
            }
        }
        return null;
    }

  ngAfterViewInit(){

    this.subscription = this.activatedRoute.params.subscribe(
        (param: any) => {
          this.count = Number(param['count']);
          console.log(this.count);
          let numberOfPages = this.count/this.table.parameters[0].rowsTake;
          this.pages = [];
          for(var i=0;i<numberOfPages;i++){ this.pages.push(i);};

          if (param['id'] !== undefined) {
              this.callerId = param['id'];

              this.callerElement  = this.dadWidgetConfigsService.getWidgetConfig(this.callerId);
              if (!this.callerElement){
                  this.callerElement  = this.dadChartConfigsService.getChartConfig(this.callerId);
              }
              if (!this.callerElement) {
                  this.callerElement = this.dadTableConfigsService.getTableConfig(this.callerId);
              }

              let tableId = this.callerElement.tableId;

              this.table  = this.findTables(tableId);
              let elementParameters = this.callerElement.parameters[0];
              let tableParameters = this.table.parameters[0];

              for (let param of Object.keys(elementParameters)) {

                  tableParameters[param] = elementParameters[param];
              }
          }

          console.log("Tables are loading... :" + this.table.id);

            if (!this.data && this.table.data && config.testing){
                this.data = this.table.data;
            }

            if (!config.testing) {
                this.dadTableDataService.getElementData(this.table).then(
                    data => {
                        this.data = data.data;
                        if (this.data.errorMessage != null) {
                            alert(this.data.errorMessage);
                        }
                    }
                ).catch(err => console.log(err.toString()));
            }
        });
  }

  ngOnInit() {

    if (!this.table){

      let tables = this.dadTableConfigsService.getTableConfigs();


      this.subscription = this.activatedRoute.params.subscribe(
          (param: any) => {
              let callerId = param['id'];
              let callerTableId = param['id'];
              if (callerId === 'chartbar'){
                  this.table = tables[1]; //This table is without minichart
              }
              else {
                  this.table = tables[0]; //TO-DO we need to pass the ID as a router parameter
              }
        });
       //this.table = tables[0]; //TO-DO we need to pass the ID as a router parameter
    }
  }
}
