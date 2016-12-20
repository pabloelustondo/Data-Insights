/**
 * Created by dister on 12/14/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadTableDataService } from "./data.service";
import { Mapper, ChartData } from "./mapper";
import { DadDateRange } from "./dadmodels";
import { DadTableColumn, DadTableColumnType } from "./table.model"
import { DadChartComponent } from "./chart.component"

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
  providers:[DadTableDataService],
  template: `     
    <div *ngIf="data">

      <table style="border:solid">
          <tr style="border:solid">
          <td style="border:solid" *ngFor="let col of table.columns" ><h2>{{col.Name}}</h2></td>
          </tr>
          <tr *ngFor="let row of data; let rowindex = index" style="border:solid">
          <td style="border:solid" *ngFor="let col of table.columns" >
          
          <span *ngIf="!isMiniChart(col)"> 
          {{row[col.DataSource]}}
          </span>
          <span *ngIf="isMiniChart(col)"> 
          <dadchart [chart]="miniChart(col,rowindex)"></dadchart>
          </span>        
          </td>
          </tr>
      </table>

    </div>
  <!-- to show chart in widgets, use the line below-->
  <!--<dadchart [chart]="widget.chart"></dadchart>-->

    <!--  END CHART COMPONENT -->`
})
export class DadTableComponent implements OnInit {
  @Input()
  table: DadTable;
  data: any;

  constructor(private dadTableDataService: DadTableDataService) { }

  isMiniChart(col:DadTableColumn){
    return col.Type == DadTableColumnType.MiniChart;
  }

  miniChart(col:DadTableColumn, rowindex:number){
    let miniChartConfig = JSON.parse(JSON.stringify(col.MiniChart));   //dirty way to clone object
    miniChartConfig.id += rowindex;
    return miniChartConfig;
  }

  ngOnInit() {
    console.log("Tables are loading... :" + this.table.id);
    this.dadTableDataService.getTableData(this.table).then(
      data => {
        this.data = data.data;
      }
    ).catch(err => console.log(err.toString()));
  }
}
