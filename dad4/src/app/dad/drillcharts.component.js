"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by dister on 2/2/2017.
 */
var core_1 = require('@angular/core');
var chart_service_1 = require('./chart.service');
var DadDrillChartsComponent = (function () {
    function DadDrillChartsComponent(activatedRoute, dadChartConfigsService) {
        this.activatedRoute = activatedRoute;
        this.dadChartConfigsService = dadChartConfigsService;
    }
    DadDrillChartsComponent.prototype.createDrillChart = function (chart, rowindex) {
        var chartConfig = JSON.parse(JSON.stringify(chart)); //to clone object
        chartConfig.id += rowindex;
        chartConfig.reduction = chartConfig.reductions[rowindex];
        return chartConfig;
    };
    DadDrillChartsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.subscription = this.activatedRoute.params.subscribe(function (param) {
            var chartid = param['id'];
            _this.charts = [];
            _this.chart = _this.dadChartConfigsService.getChartConfig(chartid);
            for (var i = 0; i < _this.chart.reductions.length; i++) {
                var drillchart = _this.createDrillChart(_this.chart, i);
                _this.charts.push(drillchart);
                _this.dadChartConfigsService.saveOne(drillchart);
                console.log("Charts are loading... :" + drillchart.id);
            }
        });
    };
    __decorate([
        core_1.Input()
    ], DadDrillChartsComponent.prototype, "chart", void 0);
    DadDrillChartsComponent = __decorate([
        core_1.Component({
            selector: 'drillcharts',
            providers: [chart_service_1.DadChartConfigsService],
            template: "\n        <div *ngIf=\"chart && charts\" class=\"card-block pb-0\">\n        <h1>{{chart.name}}</h1>\n            <div *ngFor=\"let drillchart of charts\">\n                <dadchart [chart]=\"drillchart\"></dadchart>\n            </div>\n        </div>\n  "
        })
    ], DadDrillChartsComponent);
    return DadDrillChartsComponent;
}());
exports.DadDrillChartsComponent = DadDrillChartsComponent;
