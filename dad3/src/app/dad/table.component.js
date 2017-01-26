"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by pablo elustodo on 12/14/2016.
 */
var core_1 = require('@angular/core');
var data_service_1 = require("./data.service");
var table_model_1 = require("./table.model");
var chart_service_1 = require('./chart.service');
var chart_service_2 = require('./chart.service');
var DadTable = (function () {
    function DadTable() {
    }
    return DadTable;
}());
exports.DadTable = DadTable;
var DadTableComponent = (function () {
    function DadTableComponent(dadTableDataService, dadTableConfigsService, dadWidgetConfigsService, activatedRoute, dadChartConfigsService) {
        this.dadTableDataService = dadTableDataService;
        this.dadTableConfigsService = dadTableConfigsService;
        this.dadWidgetConfigsService = dadWidgetConfigsService;
        this.activatedRoute = activatedRoute;
        this.dadChartConfigsService = dadChartConfigsService;
        this.count = 0;
        this.currentPage = 0;
    }
    DadTableComponent.prototype.chartData = function (row, col) {
        return JSON.parse(row[col.DataSource]);
    };
    DadTableComponent.prototype.isMiniChart = function (col) {
        return col.Type == table_model_1.DadTableColumnType.MiniChart;
    };
    DadTableComponent.prototype.miniChart = function (col, rowindex) {
        var chartConfig = JSON.parse(JSON.stringify(col.MiniChart)); //to clone object
        chartConfig.id += rowindex;
        return chartConfig;
    };
    DadTableComponent.prototype.refresh = function (page) {
        var _this = this;
        this.currentPage = page;
        this.table.parameters[0].rowsSkip = page * this.table.parameters[0].rowsTake;
        this.dadTableDataService.getTableData(this.table).then(function (data) {
            _this.data = data.data;
        }).catch(function (err) { return console.log(err.toString()); });
    };
    DadTableComponent.prototype.tableParameterKeys = function () {
        var keys = Object.keys(this.table.parameters[0]);
        return keys;
    };
    DadTableComponent.prototype.tableParameterValue = function (key) {
        var parameters = this.table.parameters[0];
        return parameters[key];
    };
    DadTableComponent.prototype.findTables = function (tableId) {
        var tables = this.dadTableConfigsService.getTableConfigs();
        for (var i = 0; i < tables.length; i++) {
            if (tables[i].id === tableId) {
                return tables[i];
            }
        }
        return null;
    };
    DadTableComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.subscription = this.activatedRoute.params.subscribe(function (param) {
            _this.count = Number(param['count']);
            console.log(_this.count);
            var numberOfPages = _this.count / _this.table.parameters[0].rowsTake;
            _this.pages = [];
            for (var i = 0; i < numberOfPages; i++) {
                _this.pages.push(i);
            }
            ;
            if (param['id'] !== undefined) {
                _this.callerId = param['id'];
                _this.callerElement = _this.dadWidgetConfigsService.getWidgetConfig(_this.callerId);
                if (!_this.callerElement) {
                    _this.callerElement = _this.dadChartConfigsService.getChartConfig(_this.callerId);
                }
                var tableId = _this.callerElement.tableId;
                _this.table = _this.findTables(tableId);
                var elementParameters = _this.callerElement.parameters[0];
                var tableParameters = _this.table.parameters[0];
                for (var _i = 0, _a = Object.keys(elementParameters); _i < _a.length; _i++) {
                    var param_1 = _a[_i];
                    tableParameters[param_1] = elementParameters[param_1];
                }
            }
            console.log("Tables are loading... :" + _this.table.id);
            _this.dadTableDataService.getTableData(_this.table).then(function (data) {
                _this.data = data.data;
                if (_this.data.errorMessage != null) {
                    alert(_this.data.errorMessage);
                }
            }).catch(function (err) { return console.log(err.toString()); });
        });
    };
    DadTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.table) {
            var tables_1 = this.dadTableConfigsService.getTableConfigs();
            this.subscription = this.activatedRoute.params.subscribe(function (param) {
                var callerId = param['id'];
                var callerTableId = param['id'];
                if (callerId === 'chartbar') {
                    _this.table = tables_1[1]; //This table is without minichart
                }
                else {
                    _this.table = tables_1[0]; //TO-DO we need to pass the ID as a router parameter
                }
            });
        }
    };
    __decorate([
        core_1.Input()
    ], DadTableComponent.prototype, "table", void 0);
    DadTableComponent = __decorate([
        core_1.Component({
            selector: 'dadtable',
            providers: [data_service_1.DadTableDataService, chart_service_1.DadTableConfigsService, chart_service_2.DadWidgetConfigsService, chart_service_1.DadChartConfigsService],
            template: " \n    <div *ngIf=\"data\">\n        <div class=\"col-lg-10\">\n            <div class=\"card\">\n                <div class=\"card-header\">\n                    <h4>{{table.name}}</h4>\n                       Number of Rows:{{count}}\n                    <span *ngFor=\"let key of tableParameterKeys()\"> \n                       {{key}}:{{tableParameterValue(key)}}\n                    </span>\n                </div>\n                <div class=\"card-block\">\n                    <table class=\"table table-striped\">\n                        <thead>\n                            <tr>\n                                <th style=\"text-align:left;\" *ngFor=\"let col of table.columns\" >{{col.Name}}</th>\n                            </tr>  \n                        </thead>\n                        <tbody>\n                            <tr *ngFor=\"let row of data; let rowindex = index\">\n                                <td style=\"align-content: center;\" *ngFor=\"let col of table.columns\">\n                                    <span *ngIf=\"!isMiniChart(col)\"> {{row[col.DataSource]}} </span>\n                                    <span *ngIf=\"isMiniChart(col)\"> \n                                        <dadchart [chart]=\"miniChart(col,rowindex)\" [data]=\"chartData(row,col)\"></dadchart>\n                                    </span>        \n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                    <ul class=\"pagination\" style=\"cursor:pointer;\">\n                        <span *ngFor=\"let page of pages\">               \n                            <li  *ngIf=\"page == currentPage\" class=\"page-item active\" ><a class=\"page-link\" (click)=refresh(page) >{{page+1}}</a></li>\n                            <li  *ngIf=\"page != currentPage\" class=\"page-item\" ><a class=\"page-link\" (click)=refresh(page) >{{page+1}} </a></li>\n                        </span>\n                    </ul>\n                </div>\n            </div>\n        </div>\n  <!-- to show chart in widgets, use the line below-->\n  <!--<dadchart [chart]=\"widget.chart\"></dadchart>-->\n\n    <!--  END CHART COMPONENT --></div>"
        })
    ], DadTableComponent);
    return DadTableComponent;
}());
exports.DadTableComponent = DadTableComponent;
