"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by pabloelustondo on 2016-11-19.
 */
var core_1 = require('@angular/core');
var chart_service_1 = require('./chart.service');
var DadConfigComponent = (function () {
    function DadConfigComponent(dadChartConfigsService, dadWidgetConfigsService, dadTableConfigsService, dadPageConfigsService) {
        this.dadChartConfigsService = dadChartConfigsService;
        this.dadWidgetConfigsService = dadWidgetConfigsService;
        this.dadTableConfigsService = dadTableConfigsService;
        this.dadPageConfigsService = dadPageConfigsService;
        this.title = 'Dashboard Configuration';
        this.dirty = false;
    }
    DadConfigComponent.prototype.unselect = function () {
        this.selectedChart = null;
        this.selectedWidget = null;
        this.selectedTable = null;
        this.showChart = null;
        this.showWidget = null;
        this.showTable = null;
    };
    DadConfigComponent.prototype.selectChart = function (chart) {
        this.unselect();
        this.selectedChart = chart;
        this.dirty = true; //mh... do it better
    };
    DadConfigComponent.prototype.selectWidget = function (widget) {
        this.unselect();
        this.selectedWidget = widget;
        this.dirty = true; //mh... do it better
    };
    DadConfigComponent.prototype.showThisTable = function (table) {
        var show = this.showTable;
        this.unselect();
        if (!show)
            this.showTable = table;
    };
    DadConfigComponent.prototype.showThisChart = function (chart) {
        var show = this.showChart;
        this.unselect();
        if (!show)
            this.showChart = chart;
    };
    DadConfigComponent.prototype.showThisWidget = function (widget) {
        var show = this.showWidget;
        this.unselect();
        if (!show)
            this.showWidget = widget;
    };
    DadConfigComponent.prototype.selectTable = function (table) {
        this.unselect();
        this.selectedTable = table;
        this.dirty = true; //mh... do it better
    };
    DadConfigComponent.prototype.saveConfiguration = function () {
        this.dadChartConfigsService.save(this.charts);
        this.dadWidgetConfigsService.save(this.widgets);
        this.dadTableConfigsService.save(this.tables);
        this.dirty = false; //mh... do it better
    };
    DadConfigComponent.prototype.resetConfiguration = function () {
        this.dadChartConfigsService.clearLocalCopy();
        this.dadWidgetConfigsService.clearLocalCopy();
        this.dadTableConfigsService.clearLocalCopy();
        this.dadPageConfigsService.clearLocalCopy();
        this.charts = this.dadChartConfigsService.getChartConfigs();
        this.widgets = this.dadWidgetConfigsService.getWidgetConfigs();
        this.tables = this.dadTableConfigsService.getTableConfigs();
        this.pages = this.dadPageConfigsService.getPageConfigs();
    };
    DadConfigComponent.prototype.deleteChart = function (chart) {
        var _this = this;
        this.charts = this.charts.filter(function (value) { return value.id != _this.selectedChart.id; });
        this.dirty = true; //mh... do it better
        this.selectedChart = null;
    };
    DadConfigComponent.prototype.deleteWidget = function (widget) {
        var _this = this;
        this.widgets = this.widgets.filter(function (value) { return value.id != _this.selectedWidget.id; });
        this.dirty = true; //mh... do it better
        this.selectedWidget = null;
    };
    DadConfigComponent.prototype.deleteTable = function (table) {
        var _this = this;
        this.tables = this.tables.filter(function (value) { return value.id != _this.selectedTable.id; });
        this.dirty = true; //mh... do it better
        this.selectedTable = null;
    };
    DadConfigComponent.prototype.ngOnInit = function () {
        this.charts = this.dadChartConfigsService.getChartConfigs();
        this.widgets = this.dadWidgetConfigsService.getWidgetConfigs();
        this.tables = this.dadTableConfigsService.getTableConfigs();
    };
    DadConfigComponent = __decorate([
        core_1.Component({
            selector: 'dadconfig',
            providers: [chart_service_1.DadChartConfigsService, chart_service_1.DadWidgetConfigsService, chart_service_1.DadTableConfigsService, chart_service_1.DadPageConfigsService],
            template: "\n\n    <div *ngIf=\"showTable\" style=\"width:100%; display:inline-block;  vertical-align:top; border: solid;\" > \n    <h2>{{showTable.name}}</h2>  \n        <dadtable [table]=\"showTable\"></dadtable>\n    </div>\n    \n    <div *ngIf=\"showWidget\" style=\"width:100%; display:inline-block;  vertical-align:top; border: solid;\" > \n    <h2>{{showWidget.name}}</h2>  \n        <dadwidget [widget]=\"showWidget\"></dadwidget>\n    </div>\n    \n    <div *ngIf=\"showChart\" style=\"width:100%; display:inline-block;  vertical-align:top; border: solid;\" > \n    <h2>{{showChart.name}}</h2>  \n        <dadchart [chart]=\"showChart\"></dadchart>\n    </div>\n\n     <div style=\"width:30%; display:inline-block;  vertical-align:top;\"> \n     <button *ngIf=\"dirty\"(click)=\"saveConfiguration()\">Save Changes</button> <button (click)=\"resetConfiguration()\">Reset to Factory Settings</button>\n     <div>\n        <h2>Widgets Configuration </h2> \n        <table>\n        <tr *ngFor=\"let widget of widgets\">  \n         <td> {{ widget.name }} </td>\n          <a (click)=\"selectWidget(widget)\" class=\"btn btn-sm glyphicons glyphicons-pencil x1\"></a>\n          <a (click)=\"showThisWidget(widget)\" class=\"btn btn-sm glyphicons glyphicons-eye-open x1\"></a>\n        </tr>\n        </table>\n    </div>\n    <div>\n        <h2>Charts Configuration </h2>\n        <table>\n        <tr *ngFor=\"let chart of charts\">  \n         <td> {{ chart.name }} </td>\n          <a (click)=\"selectChart(chart)\" class=\"btn btn-sm glyphicons glyphicons-pencil x1\"></a>\n          <a (click)=\"showThisChart(chart)\" class=\"btn btn-sm glyphicons glyphicons-eye-open x1\"></a>\n        </tr>\n        </table>\n    </div>\n        <div>\n        <h2>Tables Configuration </h2>\n        <table>\n        <tr *ngFor=\"let table of tables\"> \n         <td> {{ table.name }} </td>\n          <a (click)=\"selectTable(table)\" class=\"btn btn-sm glyphicons glyphicons-pencil x1\"></a>\n          <a (click)=\"showThisTable(table)\" class=\"btn btn-sm glyphicons glyphicons-eye-open x1\"></a>\n        </tr>\n        </table>\n    </div>\n    </div>\n    \n    <div *ngIf=\"selectedWidget\" style=\"width:60%; display:inline-block;  vertical-align:top; border: solid;\" > \n    <h2>Edit Widget Configuration {{selectedWidget.name}}</h2>\n    <table>\n       <tr><td><label>name: </label></td><td style=\"width:300px\"><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.name\" placeholder=\"name\"></td></tr>\n       <tr><td><label>id: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.id\" placeholder=\"id\"></td></tr>\n       <tr><td><label>type: </label></td><td><input style=\"width:300px\"[(ngModel)]=\"selectedWidget.type\" placeholder=\"type\"></td></tr>\n       <tr><td><label>endpoint: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.endpoint\" placeholder=\"endpoint\"></td></tr>\n       <tr><td><label>shiftStartDateTime: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.parameters[0].shiftStartDateTime\" placeholder=\"shiftStartDateTime\"></td></tr>\n       <tr><td><label>shiftStartDateTimeAuto: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.parameters[0].shiftStartDateTimeAuto\" placeholder=\"shiftStartDateTimeAuto\"></td></tr>\n       <tr><td><label>shiftDuration: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.parameters[0].shiftDuration\" placeholder=\"shiftDuration\"></td></tr>\n       <tr><td><label>minimumBatteryPercentageThreshold: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.parameters[0].minimumBatteryPercentageThreshold\" placeholder=\"minimumBatteryPercentageThreshold\"></td></tr>\n    \n       <tr *ngIf=\"selectedWidget.uiparameters.length>0\"><td><label>Parameter 0</label></td><td></td></tr>\n       <tr *ngIf=\"selectedWidget.uiparameters.length>0\"><td><label>Type: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.uiparameters[0].Type\" placeholder=\"Type\"></td></tr>\n       <tr *ngIf=\"selectedWidget.uiparameters.length>0\"><td><label>Name: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.uiparameters[0].Name\" placeholder=\"Name\"></td></tr>\n       <tr *ngIf=\"selectedWidget.uiparameters.length>0\"><td><label>DataSource: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.uiparameters[0].DataSource\" placeholder=\"DataSource\"></td></tr>\n    \n       <tr *ngIf=\"selectedWidget.uiparameters.length>1\"><td><label>Parameter 1</label></td><td></td></tr>\n       <tr *ngIf=\"selectedWidget.uiparameters.length>1\"><td><label>Type: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.uiparameters[1].Type\" placeholder=\"Type\"></td></tr>\n       <tr *ngIf=\"selectedWidget.uiparameters.length>1\"><td><label>Name: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.uiparameters[1].Name\" placeholder=\"Name\"></td></tr>\n       <tr *ngIf=\"selectedWidget.uiparameters.length>1\"><td><label>DataSource: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.uiparameters[1].DataSource\" placeholder=\"DataSource\"></td></tr>\n         \n       <tr *ngIf=\"selectedWidget.uiparameters.length>2\"><td><label>Parameter 2</label></td><td></td></tr>\n       <tr *ngIf=\"selectedWidget.uiparameters.length>2\"><td><label>Type: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.uiparameters[2].Type\" placeholder=\"Type\"></td></tr>\n       <tr *ngIf=\"selectedWidget.uiparameters.length>2\"><td><label>Name: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.uiparameters[2].Name\" placeholder=\"Name\"></td></tr>\n       <tr *ngIf=\"selectedWidget.uiparameters.length>2\"><td><label>DataSource: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedWidget.uiparameters[2].DataSource\" placeholder=\"DataSource\"></td></tr>  \n    \n     </table> \n      <br><a (click)=\"deleteWidget()\" class=\"btn btn-sm glyphicons glyphicons-bin x1\"></a>\n    </div>\n    \n    \n    \n    <div *ngIf=\"selectedChart\" style=\"width:60%; display:inline-block;  vertical-align:top; border: solid;\" > \n    <h2>Edit Chart Configuration {{selectedChart.name}}</h2>\n    <table>\n       <tr><td><label>name: </label></td><td style=\"width:300px\"><input style=\"width:300px\" [(ngModel)]=\"selectedChart.name\" placeholder=\"name\"></td></tr>\n       <tr><td><label>id: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedChart.id\" placeholder=\"id\"></td></tr>\n       <tr><td><label>type: </label></td><td><input style=\"width:300px\"[(ngModel)]=\"selectedChart.type\" placeholder=\"type\"></td></tr>\n       <tr><td><label>endpoint: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedChart.endpoint\" placeholder=\"endpoint\"></td></tr>\n       <tr><td><label>dimension: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedChart.a\" placeholder=\"dimension\"></td></tr>\n       <tr><td><label>measure: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedChart.b\" placeholder=\"measure\"></td></tr>\n       <tr><td><label>width: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedChart.width\" placeholder=\"width\"></td></tr>\n       <tr><td><label>height: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedChart.height\" placeholder=\"height\"></td></tr>  \n       <tr><td><label>dateFrom: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedChart.parameters[0].dateFrom\" placeholder=\"dateFrom\"></td></tr>\n       <tr><td><label>dateTo: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedChart.parameters[0].dateTo\" placeholder=\"dateTo\"></td></tr>\n       <tr><td><label>is Mini?: </label></td><td><input type=\"checkbox\" [(ngModel)]=\"selectedChart.mini\"/></td></tr>\n     </table> \n       <br><a (click)=\"deleteChart()\" class=\"btn btn-sm glyphicons glyphicons-bin x1\"></a>   \n    </div>\n    \n        <div *ngIf=\"selectedTable\" style=\"width:60%; display:inline-block;  vertical-align:top; border: solid;\" > \n    <h2>Edit Table Configuration {{selectedTable.name}}</h2>\n    <table>\n       <tr><td><label>name: </label></td><td style=\"width:300px\"><input style=\"width:300px\" [(ngModel)]=\"selectedTable.name\" placeholder=\"name\"></td></tr>\n       <tr><td><label>id: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.id\" placeholder=\"id\"></td></tr>\n       <tr><td><label>type: </label></td><td><input style=\"width:300px\"[(ngModel)]=\"selectedTable.type\" placeholder=\"type\"></td></tr>\n       <tr><td><label>endpoint: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.endpoint\" placeholder=\"endpoint\"></td></tr>\n       <tr><td><label>shiftDuration: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.parameters[0].shiftDuration\" placeholder=\"shiftDuration\"></td></tr>\n       <tr><td><label>rowsSkip: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.parameters[0].rowsSkip\" placeholder=\"rowsSkip\"></td></tr>\n       <tr><td><label>rowsTake: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.parameters[0].rowsTake\" placeholder=\"rowsTake\"></td></tr>\n       <tr><td><label>shiftStartDateTime: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.parameters[0].shiftStartDateTime\" placeholder=\"shiftStartDateTime\"></td></tr>\n       <tr><td><label>minimumBatteryPercentageThreshold: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.parameters[0].minimumBatteryPercentageThreshold\" placeholder=\"minimumBatteryPercentageThreshold\"></td></tr>\n\n       <tr *ngIf=\"selectedTable.columns.length>0\"><td><label>Column 0</label></td><td></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>0\"><td><label>Type: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[0].Type\" placeholder=\"Type\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>0\"><td><label>Name: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[0].Name\" placeholder=\"Name\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>0\"><td><label>DataSource: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[0].DataSource\" placeholder=\"DataSource\"></td></tr>\n       \n       <tr *ngIf=\"selectedTable.columns.length>1\"><td><label>Column 1</label></td><td></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>1\"><td><label>Type: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[1].Type\" placeholder=\"Type\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>1\"><td><label>Name: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[1].Name\" placeholder=\"Name\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>1\"><td><label>DataSource: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[1].DataSource\" placeholder=\"DataSource\"></td></tr>\n       \n       <tr *ngIf=\"selectedTable.columns.length>2\"><td><label>Column 2</label></td><td></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>2\"><td><label>Type: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[2].Type\" placeholder=\"Type\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>2\"><td><label>Name: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[2].Name\" placeholder=\"Name\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>2\"><td><label>DataSource: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[2].DataSource\" placeholder=\"DataSource\"></td></tr>\n       \n       <tr *ngIf=\"selectedTable.columns.length>3\"><td><label>Column 3</label></td><td></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>3\"><td><label>Type: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[3].Type\" placeholder=\"Type\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>3\"><td><label>Name: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[3].Name\" placeholder=\"Name\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>3\"><td><label>DataSource: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[3].DataSource\" placeholder=\"DataSource\"></td></tr>\n       \n       <tr *ngIf=\"selectedTable.columns.length>4\"><td><label>Column 4</label></td><td></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>4\"><td><label>Type: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[4].Type\" placeholder=\"Type\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>4\"><td><label>Name: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[4].Name\" placeholder=\"Name\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>4\"><td><label>DataSource: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[4].DataSource\" placeholder=\"DataSource\"></td></tr>\n       \n       <tr *ngIf=\"selectedTable.columns.length>5\"><td><label>Column 5</label></td><td></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>5\"><td><label>Type: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[5].Type\" placeholder=\"Type\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>5\"><td><label>Name: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[5].Name\" placeholder=\"Name\"></td></tr>\n       <tr *ngIf=\"selectedTable.columns.length>5\"><td><label>DataSource: </label></td><td><input style=\"width:300px\" [(ngModel)]=\"selectedTable.columns[5].DataSource\" placeholder=\"DataSource\"></td></tr>\n      \n     </table> \n       <br><a (click)=\"deleteTable()\" class=\"btn btn-sm glyphicons glyphicons-bin x1\"></a>  \n    </div>\n    \n    "
        })
    ], DadConfigComponent);
    return DadConfigComponent;
}());
exports.DadConfigComponent = DadConfigComponent;
