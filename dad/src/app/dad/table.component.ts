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
import { DadFilter } from './filter';
import * as _ from "lodash";

export class DadTable extends DadElement{
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
    <div *ngIf="table && data">
        <div class="col-lg-10">
            <div class="card">
                <div class="card-header">                    
                    <h4>{{table.name}}</h4>
                       Number of Rows:{{count}}
                    <span *ngFor="let key of parameterKeys"> 
                       {{key}}:{{tableParameterValue(key)}}
                    </span>
                    
                    <form role="form" (submit)="search(querystr)">
                    <button class="glyphicons glyphicons-search" type="submit"></button>
                    <input style="height:32px;" id="querystr" type="text" #querystr  placeholder=Search…>
                    </form>
                    
                </div>
                
                <div class="card-block">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th style="text-align:left;" *ngFor="let col of table.columns" >{{col.Name}}</th>
                                
                            </tr>  
                        </thead>
                        
                        <tbody>
                            <tr>     
                               <td *ngFor="let col of table.columns">
                                <select *ngIf="!col.values" class="form-control">
                                    <option disabled selected>Select</option>
                                </select>  
                                 <select (change)="select($event, col)" *ngIf="col.Type==='Number' && col.values && col.Type!=='MiniChart'" class="form-control" data-dadtype="Number">
                                    <option value="$clear">Select</option>
                                    <option style="color:black;" *ngFor="let val of col.values" >{{val}}</option>
                                </select> 
                                <select (change)="select($event, col)" *ngIf="col.Type!=='Number' && col.values && col.Type!=='MiniChart'" class="form-control">
                                    <option value="$clear">Select</option>
                                    <option style="color:black;" *ngFor="let val of col.values" >{{val}}</option>
                                </select>  
                               </td>
                            </tr>
                        
                            <tr *ngFor="let row of data; let rowindex = index">
                                <td style="align-content: center;" *ngFor="let col of table.columns; let colindex= index">
                                    <span *ngIf="!(col.Type === 'MiniChart')"> {{row[col.DataSource]}}</span>
                                 
                                    <span *ngIf="col.Type === 'MiniChart' "> 
                                        <dadchart [chart]="miniChartD[rowindex][colindex]" [data]="chartDataD[rowindex][colindex]"></dadchart>
                                    </span>   
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--<ul class="pagination" style="cursor:pointer;">
                        <span *ngFor="let page of pages">               
                            <li  *ngIf="page == currentPage" class="page-item active" ><a class="page-link" (click)=refresh(page) >{{page+1}}</a></li>
                            <li  *ngIf="page != currentPage" class="page-item" ><a class="page-link" (click)=refresh(page) >{{page+1}} </a></li>
                        </span>
                    </ul>-->
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
  allData;any;
  count:number = 0;
  private subscription: Subscription;
  pages:number[];
  currentPage:number=0;
  callerId:string;
  callerElement: DadElement;
  searchString: string;
  parameterKeys: any[];
  miniChartD: any[];
  chartDataD: any[];
  addmonitor: boolean = false;
  searchTerm: any;
  items: any;
  itemsCopy:any;


  constructor(private dadTableDataService: DadElementDataService,
              private dadTableConfigsService: DadTableConfigsService,
              private dadWidgetConfigsService: DadWidgetConfigsService,
              private activatedRoute: ActivatedRoute,
              private dadChartConfigsService: DadChartConfigsService
  ) { }

  isMiniChart(col:DadTableColumn){
    return col.Type == "MiniChart";
  }

  miniChart(col:DadTableColumn, rowindex:number){
    let chartConfig = JSON.parse(JSON.stringify(col.MiniChart)); //to clone object
    chartConfig.id += rowindex;
    return chartConfig;
  }
//need to be done
  select(v,c){
      if (!v) return;
      let filter = new DadFilter();
      let attribute = c.DataSource;

      if (!this.table.filter)this.table.filter = {};

      let value = v.target.value;

      if (value !== "$clear") {
          if (v.target.dataset.dadtype && v.target.dataset.dadtype === 'Number') value = parseInt(value);
          this.table.filter[attribute] = value;
      }else {
          delete  this.table.filter[attribute];
      }
      this.data = filter.filter(this.table, this.allData);
  }

  addValues(){
      for(let c=0; c<this.table.columns.length; c++){
          let column =  this.table.columns[c];
          column.values = [];
          for(let d=0; d<this.data.length; d++){
              let option = this.data[d][column.DataSource];

               if(!(_.includes(column.values, option))){
                   if (column.Type === 'Number') {
                       option = parseInt(option);
                   }
                   column.values.push(option);
              }
          }
      }
  }

  search(s){
      if (!s)return;
      this.table.search = s.value;
      let filter = new DadFilter();
      this.data = filter.filter(this.table, this.allData);

      //    <dadchart [chart]="miniChart(col,rowindex)" [data]="chartData(row,col)"></dadchart>

      this.preCalculateCharts();
  }

  preCalculateCharts(){
      this.miniChartD = [];
      this.chartDataD = [];
      for (let d=0; d<this.data.length; d++){
          this.miniChartD[d] = [];
          this.chartDataD[d] = [];

          for(let c=0; c<this.table.columns.length; c++){
              if(this.table.columns[c].Type==='MiniChart'){
              this.miniChartD[d][c] = this.miniChart(this.table.columns[c],d);
              this.chartDataD[d][c] = this.chartData(this.data[d],this.table.columns[c]);
              }
          }
      }
  }

    addMonitor():void {
        if (!this.addmonitor) {
            this.addmonitor = true;
        } else {
            this.addmonitor = false;
        }
    }

  refresh(page:number){

    this.currentPage = page;
    this.table.parameters[0].rowsSkip = page * this.table.parameters[0].rowsTake;
    this.dadTableDataService.getElementData(this.table).subscribe(
        data => {
          this.allData = data.data;

        }
    )//.catch(err => console.log(err.toString()));
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

    ngOnInit(){

      this.allData = this.data;

      this.subscription = this.activatedRoute.params.subscribe(
        (param: any) => {
          this.count = Number(param['count']);
          console.log(this.count);

          let tableId =  this.callerId = param['tableid'];

          let numberOfPages = 1;

          if (tableId){
              this.table  = this.findTables(tableId);
              numberOfPages = this.count/this.table.parameters[0].rowsTake;
          }

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

              if (!tableId) tableId = this.callerElement.tableId; //horrible code
              if (!tableId) tableId = this.callerId;

              this.table  = this.findTables(tableId);

              let elementParameters = this.callerElement.parameters[0];
              let tableParameters = this.table.parameters[0];

              this.parameterKeys = [];
              for (let param of Object.keys(elementParameters)) {
                    this.parameterKeys.push(param);
                  tableParameters[param] = elementParameters[param];
              }
          }

          console.log("Tables are loading... :" + this.table.id);

            let filter = new DadFilter();

            if (!this.data && this.table.data && config.testing){
                this.allData = this.table.data;
                this.data = filter.filter(this.table, this.allData);
                this.preCalculateCharts();
                this.addValues();
             }

            if (!config.testing) {
                this.dadTableDataService.getElementData(this.table).subscribe(
                    data => {
                        this.allData = data.data;
                        this.data = filter.filter(this.table, this.allData);
                        this.preCalculateCharts();
                        this.addValues();


                        if (this.data.errorMessage != null) {
                            alert(this.data.errorMessage);
                        }
                    }
                )//.catch(err => console.log(err.toString()));
            }
        });
  }
}
