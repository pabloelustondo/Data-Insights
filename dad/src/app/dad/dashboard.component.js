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
var DadComponent = (function () {
    function DadComponent(dadChartConfigsService, dadWidgetConfigsService, dadTableConfigsService) {
        this.dadChartConfigsService = dadChartConfigsService;
        this.dadWidgetConfigsService = dadWidgetConfigsService;
        this.dadTableConfigsService = dadTableConfigsService;
        this.title = 'DAD 0.0';
    }
    DadComponent.prototype.onSelect = function (chart) {
        this.selectedChart = chart;
    };
    DadComponent.prototype.ngOnInit = function () {
        this.charts = this.dadChartConfigsService.getChartConfigs();
        this.widgets = this.dadWidgetConfigsService.getWidgetConfigs();
        this.tables = this.dadTableConfigsService.getTableConfigs();
    };
    DadComponent = __decorate([
        core_1.Component({
            selector: 'dad',
            styles: ['.row{overflow:hidden;}'],
            providers: [chart_service_1.DadChartConfigsService, chart_service_1.DadWidgetConfigsService, chart_service_1.DadTableConfigsService],
            template: "\n   <div class=\"animated fadeIn\">\n        <div class=\"row\">\n            <div class=\"col-m-12 row-sm-4\" *ngFor=\"let widget of widgets\">\n                <dadwidget [widget]=\"widget\"></dadwidget>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div *ngFor=\"let chart of charts\">\n                <dadchart [chart]=\"chart\"></dadchart>\n            </div>\n        </div>\n    </div>\n    "
        })
    ], DadComponent);
    return DadComponent;
}());
exports.DadComponent = DadComponent;
