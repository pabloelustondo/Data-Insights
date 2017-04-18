"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by pablo elustodo on 12/14/2016.
 */
var core_1 = require("@angular/core");
var data_service_1 = require("./data.service");
var dadmodels_1 = require("./dadmodels");
var chart_service_1 = require("./chart.service");
var chart_service_2 = require("./chart.service");
var appconfig_1 = require("./appconfig");
var filter_1 = require("./filter");
var _ = require("lodash");
var DadTable = (function (_super) {
    __extends(DadTable, _super);
    function DadTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DadTable;
}(dadmodels_1.DadElement));
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
        this.addmonitor = false;
    }
    DadTableComponent.prototype.chartData = function (row, col) {
        return JSON.parse(row[col.DataSource]);
    };
    DadTableComponent.prototype.isMiniChart = function (col) {
        return col.Type == "MiniChart";
    };
    DadTableComponent.prototype.miniChart = function (col, rowindex) {
        var chartConfig = JSON.parse(JSON.stringify(col.MiniChart)); //to clone object
        chartConfig.id += rowindex;
        return chartConfig;
    };
    //need to be done
    DadTableComponent.prototype.select = function (v, c) {
        if (!v)
            return;
        var filter = new filter_1.DadFilter();
        var attribute = c.DataSource;
        if (!this.table.filter)
            this.table.filter = {};
        var value = v.target.value;
        if (value !== "$clear") {
            if (v.target.dataset.dadtype && v.target.dataset.dadtype === 'Number')
                value = parseInt(value);
            this.table.filter[attribute] = value;
        }
        else {
            delete this.table.filter[attribute];
        }
        this.data = filter.filter(this.table, this.allData);
    };
    DadTableComponent.prototype.addValues = function () {
        for (var c = 0; c < this.table.columns.length; c++) {
            var column = this.table.columns[c];
            column.values = [];
            for (var d = 0; d < this.data.length; d++) {
                var option = this.data[d][column.DataSource];
                if (!(_.includes(column.values, option))) {
                    if (column.Type === 'Number') {
                        option = parseInt(option);
                    }
                    column.values.push(option);
                }
            }
        }
    };
    DadTableComponent.prototype.search = function (s) {
        if (!s)
            return;
        this.table.search = s.value;
        var filter = new filter_1.DadFilter();
        this.data = filter.filter(this.table, this.allData);
        //    <dadchart [chart]="miniChart(col,rowindex)" [data]="chartData(row,col)"></dadchart>
        this.preCalculateCharts();
    };
    DadTableComponent.prototype.preCalculateCharts = function () {
        this.miniChartD = [];
        this.chartDataD = [];
        for (var d = 0; d < this.data.length; d++) {
            this.miniChartD[d] = [];
            this.chartDataD[d] = [];
            for (var c = 0; c < this.table.columns.length; c++) {
                if (this.table.columns[c].Type === 'MiniChart') {
                    this.miniChartD[d][c] = this.miniChart(this.table.columns[c], d);
                    this.chartDataD[d][c] = this.chartData(this.data[d], this.table.columns[c]);
                }
            }
        }
    };
    DadTableComponent.prototype.addMonitor = function () {
        if (!this.addmonitor) {
            this.addmonitor = true;
        }
        else {
            this.addmonitor = false;
        }
    };
    DadTableComponent.prototype.refresh = function (page) {
        var _this = this;
        this.currentPage = page;
        this.table.parameters[0].rowsSkip = page * this.table.parameters[0].rowsTake;
        this.dadTableDataService.getElementData(this.table).subscribe(function (data) {
            _this.allData = data;
        }); //.catch(err => console.log(err.toString()));
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
    DadTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.allData = this.data;
        this.subscription = this.activatedRoute.params.subscribe(function (param) {
            _this.count = Number(param['count']);
            console.log(_this.count);
            var tableId = _this.callerId = param['tableid'];
            var numberOfPages = 1;
            if (tableId) {
                _this.table = _this.findTables(tableId);
                numberOfPages = _this.count / _this.table.parameters[0].rowsTake;
            }
            _this.pages = [];
            for (var i = 0; i < numberOfPages; i++) {
                _this.pages.push(i);
            }
            ;
            if (param['id'] !== undefined) {
                _this.callerId = param['id'];
                _this.dadWidgetConfigsService.getWidgetConfig(_this.callerId).then(function (widget) {
                    _this.callerElement = widget;
                    if (!_this.callerElement) {
                        _this.dadChartConfigsService.getChartConfig(_this.callerId).then(function (chart) {
                            _this.callerElement = chart;
                            if (!_this.callerElement) {
                                _this.callerElement = _this.dadTableConfigsService.getTableConfig(_this.callerId);
                            }
                            if (!tableId)
                                tableId = _this.callerElement.tableId; //horrible code
                            if (!tableId)
                                tableId = _this.callerId;
                            _this.table = _this.findTables(tableId);
                            var elementParameters = _this.callerElement.parameters[0];
                            var tableParameters = _this.table.parameters[0];
                            _this.parameterKeys = [];
                            for (var _i = 0, _a = Object.keys(elementParameters); _i < _a.length; _i++) {
                                var param_1 = _a[_i];
                                _this.parameterKeys.push(param_1);
                                tableParameters[param_1] = elementParameters[param_1];
                            }
                        });
                    }
                });
            }
            console.log("Tables are loading... :" + _this.table.id);
            var filter = new filter_1.DadFilter();
            if (!_this.data && _this.table.data && appconfig_1.config.testing) {
                _this.allData = _this.table.data;
                _this.data = filter.filter(_this.table, _this.allData);
                _this.preCalculateCharts();
                _this.addValues();
            }
            if (!appconfig_1.config.testing) {
                _this.dadTableDataService.getElementData(_this.table).subscribe(function (data) {
                    _this.allData = data;
                    _this.data = filter.filter(_this.table, _this.allData);
                    _this.preCalculateCharts();
                    _this.addValues();
                    if (_this.data.errorMessage != null) {
                        alert(_this.data.errorMessage);
                    }
                }); //.catch(err => console.log(err.toString()));
            }
        });
    };
    return DadTableComponent;
}());
__decorate([
    core_1.Input()
], DadTableComponent.prototype, "table");
DadTableComponent = __decorate([
    core_1.Component({
        selector: 'dadtable',
        providers: [data_service_1.DadElementDataService, chart_service_1.DadTableConfigsService, chart_service_2.DadWidgetConfigsService, chart_service_1.DadChartConfigsService],
        template: " \n    <div *ngIf=\"table && data\">\n        <div class=\"col-lg-10\">\n            <div class=\"card\">\n                <div class=\"card-header\">                    \n                    <h4>{{table.name}}</h4>\n                       Number of Rows:{{count}}\n                    <span *ngFor=\"let key of parameterKeys\"> \n                       {{key}}:{{tableParameterValue(key)}}\n                    </span>\n                    \n                    <form role=\"form\" (submit)=\"search(querystr)\">\n                    <button class=\"glyphicons glyphicons-search\" type=\"submit\"></button>\n                    <input style=\"height:32px;\" id=\"querystr\" type=\"text\" #querystr  placeholder=Search\u2026>\n                    </form>\n                    \n                </div>\n                \n                <div class=\"card-block\">\n                    <table class=\"table table-striped\">\n                        <thead>\n                            <tr>\n                                <th style=\"text-align:left;\" *ngFor=\"let col of table.columns\" >{{col.Name}}</th>\n                                \n                            </tr>  \n                        </thead>\n                        \n                        <tbody>\n                            <tr>     \n                               <td *ngFor=\"let col of table.columns\">\n                                <select *ngIf=\"!col.values\" class=\"form-control\">\n                                    <option disabled selected>Select</option>\n                                </select>  \n                                 <select (change)=\"select($event, col)\" *ngIf=\"col.Type==='Number' && col.values && col.Type!=='MiniChart'\" class=\"form-control\" data-dadtype=\"Number\">\n                                    <option value=\"$clear\">Select</option>\n                                    <option style=\"color:black;\" *ngFor=\"let val of col.values\" >{{val}}</option>\n                                </select> \n                                <select (change)=\"select($event, col)\" *ngIf=\"col.Type!=='Number' && col.values && col.Type!=='MiniChart'\" class=\"form-control\">\n                                    <option value=\"$clear\">Select</option>\n                                    <option style=\"color:black;\" *ngFor=\"let val of col.values\" >{{val}}</option>\n                                </select>  \n                               </td>\n                            </tr>\n                        \n                            <tr *ngFor=\"let row of data; let rowindex = index\">\n                                <td style=\"align-content: center;\" *ngFor=\"let col of table.columns; let colindex= index\">\n                                    <span *ngIf=\"!(col.Type === 'MiniChart')\"> {{row[col.DataSource]}}</span>\n                                 \n                                    <span *ngIf=\"col.Type === 'MiniChart' \"> \n                                        <dadchart [chart]=\"miniChartD[rowindex][colindex]\" [data]=\"chartDataD[rowindex][colindex]\"></dadchart>\n                                    </span>   \n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                    <!--<ul class=\"pagination\" style=\"cursor:pointer;\">\n                        <span *ngFor=\"let page of pages\">               \n                            <li  *ngIf=\"page == currentPage\" class=\"page-item active\" ><a class=\"page-link\" (click)=refresh(page) >{{page+1}}</a></li>\n                            <li  *ngIf=\"page != currentPage\" class=\"page-item\" ><a class=\"page-link\" (click)=refresh(page) >{{page+1}} </a></li>\n                        </span>\n                    </ul>-->\n                </div>\n            </div>\n        </div>\n\n    <!--  END CHART COMPONENT --></div>"
    })
], DadTableComponent);
exports.DadTableComponent = DadTableComponent;
