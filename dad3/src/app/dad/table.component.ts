/**
 * Created by pablo elustodo on 12/14/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadTableDataService } from "./data.service";
import { Mapper, ChartData } from "./mapper";
import { DadDateRange } from "./dadmodels";
import { DadTableColumn, DadTableColumnType } from "./table.model"
import { DadChartComponent } from "./chart.component"
import { DadTableConfigsService } from './chart.service';

export class DadTable {
  id: string;
  name: string;
  type?:string;
  parameters: any[];  //we are going to change this!
  endpoint :string;
  columns: DadTableColumn[];
  chart?: DadChart;
}

@Component({
  selector: 'dadtable',
  providers:[DadTableDataService,DadTableConfigsService],
  template: `     
    <div *ngIf="data">
        
        <div class="col-lg-10">
            <div class="card">
                <div class="card-header">
                    <i class="fa fa-align-justify"></i> {{table.name}}
                </div>
                <div class="card-block">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th style="text-align:center;" *ngFor="let col of table.columns" >{{col.Name}}</th>
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
                
                <ul class="pagination">
                        <li class="page-item"><a class="page-link" href="#">Prev</a>
                        </li>
                        <li class="page-item active">
                            <a class="page-link" href="#">1</a>
                        </li>
                        <li (click)="refresh()" class="page-item"><a class="page-link" href="#">2</a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">3</a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">4</a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">Next</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
  <!-- to show chart in widgets, use the line below-->
  <!--<dadchart [chart]="widget.chart"></dadchart>-->

    <!--  END CHART COMPONENT -->`
})
export class DadTableComponent implements OnInit {
  @Input()
  table: DadTable;
  data: any;
  chartData(row,col){
    return JSON.parse(row[col.DataSource]);
  }

  constructor(private dadTableDataService: DadTableDataService,
              private dadTableConfigsService: DadTableConfigsService) { }

  isMiniChart(col:DadTableColumn){
    return col.Type == DadTableColumnType.MiniChart;
  }

  miniChart(col:DadTableColumn, rowindex:number){
    let chartConfig = JSON.parse(JSON.stringify(col.MiniChart)); //to clone object
    chartConfig.id += rowindex;
    return chartConfig;
  }

  refresh(){

    this.table.parameters[0].rowsSkip = 100;
    this.dadTableDataService.getTableData(this.table).then(
        data => {
          this.data = data.data;
        }
    ).catch(err => console.log(err.toString()));
  }

  ngOnInit() {

    if (!this.table){
      let tables = this.dadTableConfigsService.getTableConfigs();
      this.table = tables[0]; //TO-DO we need to pass the ID as a router parameter
    }
    console.log("Tables are loading... :" + this.table.id);
    this.dadTableDataService.getTableData(this.table).then(
      data => {
        this.data = data.data;
      }
    ).catch(err => console.log(err.toString()));
  }
}
