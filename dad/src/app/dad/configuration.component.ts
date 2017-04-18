/**
 * Created by pabloelustondo on 2016-11-19.
 */
import { Component, OnInit } from '@angular/core';
import { DadChart } from './chart.component';
import { DadWidget } from './widget.component';
import { DadTable } from './table.component';
import { DadPage } from './page.component';
import { FormsModule } from '@angular/forms';
import { CHARTS } from './sample.charts';
import { WIDGETS } from './sample.widgets';
import { TABLES } from './sample.tables';
import { PAGES } from './sample.page';
import { DadChartConfigsService, DadWidgetConfigsService, DadTableConfigsService, DadPageConfigsService } from './chart.service';

declare var d3, c3: any;

@Component({
    selector: 'dadconfig',
    providers: [DadChartConfigsService, DadWidgetConfigsService, DadTableConfigsService, DadPageConfigsService],
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
          <a (click)="selectWidget(widget)" class="btn btn-sm glyphicons glyphicons-pencil x1"></a>
          <a (click)="showThisWidget(widget)" class="btn btn-sm glyphicons glyphicons-eye-open x1"></a>
        </tr>
        </table>
    </div>
    <div>
        <h2>Charts Configuration </h2>
        <table>
        <tr *ngFor="let chart of charts">  
         <td> {{ chart.name }} </td>
          <a (click)="selectChart(chart)" class="btn btn-sm glyphicons glyphicons-pencil x1"></a>
          <a (click)="showThisChart(chart)" class="btn btn-sm glyphicons glyphicons-eye-open x1"></a>
        </tr>
        </table>
    </div>
        <div>
        <h2>Tables Configuration </h2>
        <table>
        <tr *ngFor="let table of tables"> 
         <td> {{ table.name }} </td>
          <a (click)="selectTable(table)" class="btn btn-sm glyphicons glyphicons-pencil x1"></a>
          <a (click)="showThisTable(table)" class="btn btn-sm glyphicons glyphicons-eye-open x1"></a>
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
       <tr><td><label>shiftStartDateTime: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.parameters[0].shiftStartDateTime" placeholder="shiftStartDateTime"></td></tr>
       <tr><td><label>shiftStartDateTimeAuto: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.parameters[0].shiftStartDateTimeAuto" placeholder="shiftStartDateTimeAuto"></td></tr>
       <tr><td><label>shiftDuration: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.parameters[0].shiftDuration" placeholder="shiftDuration"></td></tr>
       <tr><td><label>minimumBatteryPercentageThreshold: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.parameters[0].minimumBatteryPercentageThreshold" placeholder="minimumBatteryPercentageThreshold"></td></tr>
    
       <tr *ngIf="selectedWidget.uiparameters.length>0"><td><label>Parameter 0</label></td><td></td></tr>
       <tr *ngIf="selectedWidget.uiparameters.length>0"><td><label>Type: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.uiparameters[0].Type" placeholder="Type"></td></tr>
       <tr *ngIf="selectedWidget.uiparameters.length>0"><td><label>Name: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.uiparameters[0].Name" placeholder="Name"></td></tr>
       <tr *ngIf="selectedWidget.uiparameters.length>0"><td><label>DataSource: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.uiparameters[0].DataSource" placeholder="DataSource"></td></tr>
    
       <tr *ngIf="selectedWidget.uiparameters.length>1"><td><label>Parameter 1</label></td><td></td></tr>
       <tr *ngIf="selectedWidget.uiparameters.length>1"><td><label>Type: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.uiparameters[1].Type" placeholder="Type"></td></tr>
       <tr *ngIf="selectedWidget.uiparameters.length>1"><td><label>Name: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.uiparameters[1].Name" placeholder="Name"></td></tr>
       <tr *ngIf="selectedWidget.uiparameters.length>1"><td><label>DataSource: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.uiparameters[1].DataSource" placeholder="DataSource"></td></tr>
         
       <tr *ngIf="selectedWidget.uiparameters.length>2"><td><label>Parameter 2</label></td><td></td></tr>
       <tr *ngIf="selectedWidget.uiparameters.length>2"><td><label>Type: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.uiparameters[2].Type" placeholder="Type"></td></tr>
       <tr *ngIf="selectedWidget.uiparameters.length>2"><td><label>Name: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.uiparameters[2].Name" placeholder="Name"></td></tr>
       <tr *ngIf="selectedWidget.uiparameters.length>2"><td><label>DataSource: </label></td><td><input style="width:300px" [(ngModel)]="selectedWidget.uiparameters[2].DataSource" placeholder="DataSource"></td></tr>  
    
     </table> 
      <br><a (click)="deleteWidget()" class="btn btn-sm glyphicons glyphicons-bin x1"></a>
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
       <br><a (click)="deleteChart()" class="btn btn-sm glyphicons glyphicons-bin x1"></a>   
    </div>
    
        <div *ngIf="selectedTable" style="width:60%; display:inline-block;  vertical-align:top; border: solid;" > 
    <h2>Edit Table Configuration {{selectedTable.name}}</h2>
    <table>
       <tr><td><label>name: </label></td><td style="width:300px"><input style="width:300px" [(ngModel)]="selectedTable.name" placeholder="name"></td></tr>
       <tr><td><label>id: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.id" placeholder="id"></td></tr>
       <tr><td><label>type: </label></td><td><input style="width:300px"[(ngModel)]="selectedTable.type" placeholder="type"></td></tr>
       <tr><td><label>endpoint: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.endpoint" placeholder="endpoint"></td></tr>
       <tr><td><label>shiftDuration: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.parameters[0].shiftDuration" placeholder="shiftDuration"></td></tr>
       <tr><td><label>rowsSkip: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.parameters[0].rowsSkip" placeholder="rowsSkip"></td></tr>
       <tr><td><label>rowsTake: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.parameters[0].rowsTake" placeholder="rowsTake"></td></tr>
       <tr><td><label>shiftStartDateTime: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.parameters[0].shiftStartDateTime" placeholder="shiftStartDateTime"></td></tr>
       <tr><td><label>minimumBatteryPercentageThreshold: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.parameters[0].minimumBatteryPercentageThreshold" placeholder="minimumBatteryPercentageThreshold"></td></tr>

       <tr *ngIf="selectedTable.columns.length>0"><td><label>Column 0</label></td><td></td></tr>
       <tr *ngIf="selectedTable.columns.length>0"><td><label>Type: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[0].Type" placeholder="Type"></td></tr>
       <tr *ngIf="selectedTable.columns.length>0"><td><label>Name: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[0].Name" placeholder="Name"></td></tr>
       <tr *ngIf="selectedTable.columns.length>0"><td><label>DataSource: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[0].DataSource" placeholder="DataSource"></td></tr>
       
       <tr *ngIf="selectedTable.columns.length>1"><td><label>Column 1</label></td><td></td></tr>
       <tr *ngIf="selectedTable.columns.length>1"><td><label>Type: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[1].Type" placeholder="Type"></td></tr>
       <tr *ngIf="selectedTable.columns.length>1"><td><label>Name: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[1].Name" placeholder="Name"></td></tr>
       <tr *ngIf="selectedTable.columns.length>1"><td><label>DataSource: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[1].DataSource" placeholder="DataSource"></td></tr>
       
       <tr *ngIf="selectedTable.columns.length>2"><td><label>Column 2</label></td><td></td></tr>
       <tr *ngIf="selectedTable.columns.length>2"><td><label>Type: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[2].Type" placeholder="Type"></td></tr>
       <tr *ngIf="selectedTable.columns.length>2"><td><label>Name: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[2].Name" placeholder="Name"></td></tr>
       <tr *ngIf="selectedTable.columns.length>2"><td><label>DataSource: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[2].DataSource" placeholder="DataSource"></td></tr>
       
       <tr *ngIf="selectedTable.columns.length>3"><td><label>Column 3</label></td><td></td></tr>
       <tr *ngIf="selectedTable.columns.length>3"><td><label>Type: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[3].Type" placeholder="Type"></td></tr>
       <tr *ngIf="selectedTable.columns.length>3"><td><label>Name: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[3].Name" placeholder="Name"></td></tr>
       <tr *ngIf="selectedTable.columns.length>3"><td><label>DataSource: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[3].DataSource" placeholder="DataSource"></td></tr>
       
       <tr *ngIf="selectedTable.columns.length>4"><td><label>Column 4</label></td><td></td></tr>
       <tr *ngIf="selectedTable.columns.length>4"><td><label>Type: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[4].Type" placeholder="Type"></td></tr>
       <tr *ngIf="selectedTable.columns.length>4"><td><label>Name: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[4].Name" placeholder="Name"></td></tr>
       <tr *ngIf="selectedTable.columns.length>4"><td><label>DataSource: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[4].DataSource" placeholder="DataSource"></td></tr>
       
       <tr *ngIf="selectedTable.columns.length>5"><td><label>Column 5</label></td><td></td></tr>
       <tr *ngIf="selectedTable.columns.length>5"><td><label>Type: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[5].Type" placeholder="Type"></td></tr>
       <tr *ngIf="selectedTable.columns.length>5"><td><label>Name: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[5].Name" placeholder="Name"></td></tr>
       <tr *ngIf="selectedTable.columns.length>5"><td><label>DataSource: </label></td><td><input style="width:300px" [(ngModel)]="selectedTable.columns[5].DataSource" placeholder="DataSource"></td></tr>
      
     </table> 
       <br><a (click)="deleteTable()" class="btn btn-sm glyphicons glyphicons-bin x1"></a>  
    </div>
    
    `
})

export class DadConfigComponent implements  OnInit{
    public title = 'Dashboard Configuration';
    public charts: DadChart[];
    public widgets: DadWidget[];
    public tables: DadTable[];
    public pages: DadPage[];
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
      private dadTableConfigsService: DadTableConfigsService,
      private dadPageConfigsService: DadPageConfigsService
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
      this.dadTableConfigsService.save(this.tables);
      this.dirty=false; //mh... do it better
        //I now this is weird...why only the charts... well beceuase we are going to refactor to only have on confioguratio service
        this.dadChartConfigsService.saveUserConfigurationToDdb();
    }

  resetConfiguration(){
    this.dadChartConfigsService.clearLocalCopy();
    this.dadWidgetConfigsService.clearLocalCopy();
    this.dadTableConfigsService.clearLocalCopy();
    this.dadPageConfigsService.clearLocalCopy();

    this.charts = CHARTS;
    this.widgets = WIDGETS;
    this.tables = TABLES;
    this.pages = PAGES;

      this.dadChartConfigsService.save(CHARTS);
      this.dadWidgetConfigsService.save(WIDGETS);
      this.dadTableConfigsService.save(TABLES);
      this.dadPageConfigsService.save(PAGES);

      //I now this is weird...why only the charts... well beceuase we are going to refactor to only have on confioguratio service
      this.dadChartConfigsService.saveUserConfigurationToDdb();

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

    deleteTable(table:DadTable){
        this.tables = this.tables.filter(value => value.id!=this.selectedTable.id);
        this.dirty=true; //mh... do it better
        this.selectedTable = null;
    }

    ngOnInit() {
        this.dadChartConfigsService.getChartConfigs().then((charts) => {this.charts = charts;});
        this.dadWidgetConfigsService.getWidgetConfigs().then((widgets) => {this.widgets = widgets;});
        this.tables = this.dadTableConfigsService.getTableConfigs();
    }

}
