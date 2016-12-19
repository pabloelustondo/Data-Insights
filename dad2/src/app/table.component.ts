/**
 * Created by dister on 12/14/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadTableDataService } from "./data.service";
import {Mapper, ChartData} from "./mapper";
import { DadDateRange } from "./dadmodels"

export class DadTable {
  id: string;
  name: string;
  type?:string;
  dateRange?: DadDateRange;
  parameters: any[];  //we are going to change this!
  endpoint :string;
  a: string;
  b: string;
  chart?: DadChart;
}

@Component({
  selector: 'dadtable',
  providers:[DadTableDataService],
  template: ` 
    <table *ngIf="data">
        <tr>
            <td *ngFor="let col of keys" >col</td>
        </tr>
        <tr *ngFor="let row of data.Metric">
            <td >row</td>
        </tr>
    </table>
  <!-- to show chart in widgets, use the line below-->
  <!--<dadchart [chart]="widget.chart"></dadchart>-->

    <!--  END CHART COMPONENT -->`
})
export class DadTableComponent implements OnInit {
  @Input()
  table: DadTable;
  data: ChartData;
  keys: string[];
  mapper: Mapper = new Mapper();

  constructor(private dadTableDataService: DadTableDataService) { }

  ngOnInit() {
    console.log("Tables are loading... :" + this.table.id);
    this.dadTableDataService.getTableData(this.table).then(
      data => {
        this.data = this.mapper.map(this.table, data.data);
        this.keys = Object.keys(this.data);
      }
    ).catch(err => console.log(err.toString()));
  }
}
