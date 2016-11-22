"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by pabloelustondo on 2016-11-19.
 */
var core_1 = require('@angular/core');
var chart_service_1 = require('./chart.service');
var AppComponent = (function () {
    function AppComponent(dadChartConfigsService) {
        this.dadChartConfigsService = dadChartConfigsService;
        this.title = 'DAD 0.0';
    }
    AppComponent.prototype.onSelect = function (chart) {
        this.selectedChart = chart;
    };
    //   constructor(private _heroService: HeroService, private _router: Router) { }
    AppComponent.prototype.ngOnInit = function () {
        this.title = "DAD 0.0 - Angular 2.2 +  NVD3";
        console.log("APP  starts drawing all charts in dashboard:");
        this.charts = this.dadChartConfigsService.getChartConfigs();
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            providers: [chart_service_1.DadChartConfigsService],
            template: "\n\n    <h1>{{title}}</h1>\n       <!--  this is just for debugging to show the configuration of a specific chart. -->\n    <div *ngIf=\"selectedChart\">\n     <div>Configuration Details for <b>{{selectedChart.name}}</b>  </div>\n     <table>\n     <tr>\n     <td>id:</td>\n     <td>name:</td></tr>\n     <tr>\n     <td>{{selectedChart.id}}</td>\n     <td>{{selectedChart.name}}</td></tr>\n     </table>\n    </div>\n    \n\n    <h2>Charts</h2>\n    <div class=\"chart\" *ngFor=\"let chart of charts\">\n    <dadchart [chart]=\"chart\"></dadchart>\n    </div>\n\n    "
        }), 
        __metadata('design:paramtypes', [chart_service_1.DadChartConfigsService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map