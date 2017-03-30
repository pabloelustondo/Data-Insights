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
var DadBigChartComponent = (function () {
    function DadBigChartComponent(activatedRoute, dadChartConfigsService) {
        this.activatedRoute = activatedRoute;
        this.dadChartConfigsService = dadChartConfigsService;
    }
    DadBigChartComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.subscription = this.activatedRoute.params.subscribe(function (param) {
            var chartid = param['id'];
            _this.chart = _this.dadChartConfigsService.getChartConfig(chartid);
            _this.chart.big = true;
            console.log("Charts are loading... :" + _this.chart.id);
        });
    };
    __decorate([
        core_1.Input()
    ], DadBigChartComponent.prototype, "chart", void 0);
    DadBigChartComponent = __decorate([
        core_1.Component({
            selector: 'bigchart',
            providers: [chart_service_1.DadChartConfigsService],
            template: "\n  <div style=\"min-width: 800px\" *ngIf = \"chart\">\n    <dadchart [chart]=\"chart\"></dadchart>\n  </div>\n  "
        })
    ], DadBigChartComponent);
    return DadBigChartComponent;
}());
exports.DadBigChartComponent = DadBigChartComponent;
