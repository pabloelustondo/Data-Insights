/**
 * Created by pabloelustondo on 2016-11-19.
 */
import { Component, OnInit } from '@angular/core';
import { DadChart } from './chart.component';
import { DadWidget } from './widget.component';
import { DadTable } from './table.component';
import { DadChartConfigsService, DadWidgetConfigsService, DadTableConfigsService } from './chart.service';

declare var d3, c3: any;

@Component({
    selector: 'dadconfig',
    providers: [DadChartConfigsService, DadWidgetConfigsService, DadTableConfigsService],
    template: `

    <div *ngIf="showTable" style="width:100%; display:inline-block;  vertical-align:top; border: solid;" > 
    <h2>{{showTable.name}}</h2>  
        <dadtable [table]="showTable"></dadtable>
    </div>
    
    <div *ngIf="showWidget" style="width:100%; display:inline-block;  vertical-align:top; border: solid;" > 
    <h2>{{showWidget.name}}</h2>  
        <dadwidget [widget]="showWidget"></dadwidget>
    </div>
    
    <div *ngIf="showChart" style="width:100%; display:inline-block;  vertical-align:top; border: solid;" > 
    <h2>{{showChart.name}}</h2>  
        <dadchart [chart]="showChart"></dadchart>
    </div>

     <div style="width:30%; display:inline-block;  vertical-align:top;"> 
     <button *ngIf="dirty"(click)="saveConfiguration()">Save Changes</button> <button (click)="resetConfiguration()">Reset to Factory Settings</button>
     <div>
        <h2>Widgets Configuration </h2> 
        <table>
        <tr *ngFor="let widget of widgets">  
         <td> {{ widget.name }} </td>
         <td><img (click)="selectWidget(widget)" width="20px" heigth="20px" src="/assets/images/edit.png"></td>  
         <td><img (click)="showThisWidget(widget)" width="20px" heigth="20px" src="/assets/images/show.jpeg"></td>  
        </tr>
        </table>
    </div>
    <div>
        <h2>Charts Configuration </h2>
        <table>
        <tr *ngFor="let chart of charts">  
         <td> {{ chart.name }} </td>
         <td><img (click)="selectChart(chart)" width="20px" heigth="20px" src="/assets/images/edit.png"></td> 
         <td><img (click)="showThisChart(chart)" width="20px" heigth="20px" src="/assets/images/show.jpeg"></td> 
        </tr>
        </table>
    </div>
        <div>
        <h2>Tables Configuration </h2>
        <table>
        <tr *ngFor="let table of tables">  
         <td> {{ table.name }} </td>
         <td><img (click)="selectTable(table)" width="20px" heigth="20px" src="/assets/images/edit.png"></td>  
         <td><img (click)="showThisTable(table)" width="20px" heigth="20px" src="/assets/images/show.jpeg"></td> 
        </tr>
        </table>
    </div>
    </div>
    
    <div *ngIf="selectedWidget" style="width:60%; display:inline-block;  vertical-align:top; border: solid;" > 
    <h2>Edit Widget Configuration {{selectedWidget.name}}</h2>
    <table>
       <tr><td><label>name: </label></td><td style="width:300px"><input style="width:300px" [(ngModel)]="selectedWidget.name" placeholder="name"></td></tr>
       <tr><td><label>id: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.id" placeholder="id"></td></tr>
       <tr><td><label>type: </label></td><td><input style="width:300px"[(ngModel)]="selectedWidget.type" placeholder="type"></td></tr>
       <tr><td><label>endpoint: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.endpoint" placeholder="endpoint"></td></tr>
       <tr><td><label>dimension: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.a" placeholder="dimension"></td></tr>
       <tr><td><label>measure: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.b" placeholder="measure"></td></tr>
       <tr><td><label>startTime: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.parameters[0].startTime" placeholder="startTime"></td></tr>
       <tr><td><label>duration: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.parameters[0].duration" placeholder="duration"></td></tr>
       <tr><td><label>date: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.parameters[0].date" placeholder="date"></td></tr>
     </table> 
       <div><img (click)="deleteWidget()" width="20px" heigth="20px" src="/assets/images/delete.jpeg"></div>   
    </div>
    
    
    
    <div *ngIf="selectedChart" style="width:60%; display:inline-block;  vertical-align:top; border: solid;" > 
    <h2>Edit Chart Configuration {{selectedChart.name}}</h2>
    <table>
       <tr><td><label>name: </label></td><td style="width:300px"><input style="width:300px" [(ngModel)]="selectedChart.name" placeholder="name"></td></tr>
       <tr><td><label>id: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.id" placeholder="id"></td></tr>
       <tr><td><label>type: </label></td><td><input style="width:300px"[(ngModel)]="selectedChart.type" placeholder="type"></td></tr>
       <tr><td><label>endpoint: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.endpoint" placeholder="endpoint"></td></tr>
       <tr><td><label>dimension: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.a" placeholder="dimension"></td></tr>
       <tr><td><label>measure: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.b" placeholder="measure"></td></tr>
       <tr><td><label>width: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.width" placeholder="width"></td></tr>
       <tr><td><label>height: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.height" placeholder="height"></td></tr>  
       <tr><td><label>dateFrom: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.parameters[0].dateFrom" placeholder="dateFrom"></td></tr>
       <tr><td><label>dateTo: </label></td><td><input style="width:300px" [(ngModel)]="selectedChart.parameters[0].dateTo" placeholder="dateTo"></td></tr>
       <tr><td><label>is Mini?: </label></td><td><input type="checkbox" [(ngModel)]="selectedChart.mini"/></td></tr>
     </table> 
       <div><img (click)="deleteChart()" width="20px" heigth="20px" src="/assets/images/delete.jpeg"></div>   
    </div>
    
        <div *ngIf="selectedTable" style="width:60%; display:inline-block;  vertical-align:top; border: solid;" > 
    <h2>Edit Table Configuration {{selectedTable.name}}</h2>
    <table>
       <tr><td><label>name: </label></td><td style="width:300px"><input style="width:300px" [(ngModel)]="selectedTable.name" placeholder="name"></td></tr>
       <tr><td><label>id: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.id" placeholder="id"></td></tr>
       <tr><td><label>type: </label></td><td><input style="width:300px"[(ngModel)]="selectedTable.type" placeholder="type"></td></tr>
       <tr><td><label>endpoint: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.endpoint" placeholder="endpoint"></td></tr>
       <tr><td><label>dimension: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.a" placeholder="dimension"></td></tr>
       <tr><td><label>measure: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.b" placeholder="measure"></td></tr>
       <tr><td><label>startTime: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.parameters[0].startTime" placeholder="startTime"></td></tr>
       <tr><td><label>duration: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.parameters[0].duration" placeholder="duration"></td></tr>
       <tr><td><label>date: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.parameters[0].date" placeholder="date"></td></tr>
     </table> 
       <div><img (click)="deleteWidget()" width="20px" heigth="20px" src="/assets/images/delete.jpeg"></div>   
    </div>
    
    `
})

export class DadConfigComponent implements  OnInit{
    public title = 'Dashboard Configuration';
    public charts: DadChart[];
    public widgets: DadWidget[];
    public tables: DadTable[];
    public selectedChart: DadChart;
    public selectedWidget: DadWidget;
    public selectedTable: DadTable;
    public showChart: DadChart;
    public showWidget: DadWidget;
    public showTable: DadTable;
    public dirty:boolean = false;

    constructor(
      private dadChartConfigsService: DadChartConfigsService,
      private dadWidgetConfigsService: DadWidgetConfigsService,
      private dadTableConfigsService: DadTableConfigsService
    ) { }

    unselect(){
      this.selectedChart = null;
      this.selectedWidget = null;
      this.selectedTable = null;
      this.showChart = null;
      this.showWidget = null;
      this.showTable = null;
    }

    selectChart(chart:DadChart){
      this.unselect();
      this.selectedChart = chart;
      this.dirty=true; //mh... do it better
    }

  selectWidget(widget:DadWidget){
    this.unselect();
    this.selectedWidget = widget;
    this.dirty=true; //mh... do it better
  }

  showThisTable(table:DadTable){
    var show = this.showTable;
    this.unselect();
    if (!show) this.showTable = table;
  }

  showThisChart(chart:DadChart){
    var show = this.showChart;
    this.unselect();
    if (!show ) this.showChart = chart;
  }

  showThisWidget(widget:DadWidget){
    var show = this.showWidget;
    this.unselect();
    if (!show) this.showWidget = widget;
  }

  selectTable(table:DadTable){
    this.unselect();
    this.selectedTable = table;
    this.dirty=true; //mh... do it better
  }

    saveConfiguration(){
      this.dadChartConfigsService.save(this.charts);
      this.dadWidgetConfigsService.save(this.widgets);
      this.dirty=false; //mh... do it better
    }

  resetConfiguration(){
    this.dadChartConfigsService.clearLocalCopy();
    this.dadWidgetConfigsService.clearLocalCopy();
    this.dadTableConfigsService.clearLocalCopy();
    this.charts = this.dadChartConfigsService.getChartConfigs();
    this.widgets = this.dadWidgetConfigsService.getWidgetConfigs();
    this.tables = this.dadTableConfigsService.getTableConfigs();
  }

    deleteChart(chart:DadChart){
      this.charts = this.charts.filter(value => value.id!=this.selectedChart.id);
      this.dirty=true; //mh... do it better
      this.selectedChart = null;
    }

  deleteWidget(widget:DadWidget){
    this.widgets = this.widgets.filter(value => value.id!=this.selectedWidget.id);
    this.dirty=true; //mh... do it better
    this.selectedWidget = null;
  }
    ngOnInit() {
        this.charts = this.dadChartConfigsService.getChartConfigs();
        this.widgets = this.dadWidgetConfigsService.getWidgetConfigs();
        this.tables = this.dadTableConfigsService.getTableConfigs();
    }

}
