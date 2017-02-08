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
var data_service_1 = require("./data.service");
var DadPage = (function () {
    function DadPage() {
    }
    return DadPage;
}());
exports.DadPage = DadPage;
var DadPageComponent = (function () {
    function DadPageComponent(dadTableConfigsService, dadWidgetConfigsService, dadPageConfigsService, dadChartConfigsService, activatedRoute) {
        this.dadTableConfigsService = dadTableConfigsService;
        this.dadWidgetConfigsService = dadWidgetConfigsService;
        this.dadPageConfigsService = dadPageConfigsService;
        this.dadChartConfigsService = dadChartConfigsService;
        this.activatedRoute = activatedRoute;
        this.title = 'DAD 0.0';
    }
    DadPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        var tables = this.dadTableConfigsService.getTableConfigs();
        var charts = this.dadChartConfigsService.getChartConfigs();
        var widgets = this.dadWidgetConfigsService.getWidgetConfigs();
        this.subscription = this.activatedRoute.params.subscribe(function (param) {
            var callerPageId = param['id'];
            _this.page = _this.dadPageConfigsService.getPageConfig(callerPageId);
            _this.page.charts = [];
            for (var _i = 0, _a = _this.page.chartids; _i < _a.length; _i++) {
                var chartid = _a[_i];
                _this.page.charts.push(_this.dadChartConfigsService.getChartConfig(chartid));
            }
            _this.page.widgets = [];
            for (var _b = 0, _c = _this.page.widgetids; _b < _c.length; _b++) {
                var widgetid = _c[_b];
                _this.page.widgets.push(_this.dadWidgetConfigsService.getWidgetConfig(widgetid));
            }
        });
    };
    DadPageComponent = __decorate([
        core_1.Component({
            selector: 'dad',
            styles: ['.row{overflow:hidden;}'],
            providers: [data_service_1.DadElementDataService, chart_service_1.DadTableConfigsService, chart_service_1.DadWidgetConfigsService, chart_service_1.DadChartConfigsService, chart_service_1.DadPageConfigsService],
            template: "\n   <div class=\"animated fadeIn\">\n        <div class=\"row\">\n            <div class=\"col-m-12 row-sm-4\" *ngFor=\"let widget of page.widgets\">\n                <dadwidget [widget]=\"widget\"></dadwidget>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div *ngFor=\"let chart of page.charts\">\n                <dadchart [chart]=\"chart\"></dadchart>\n            </div>\n        </div>\n    </div>\n    "
        })
    ], DadPageComponent);
    return DadPageComponent;
}());
exports.DadPageComponent = DadPageComponent;
