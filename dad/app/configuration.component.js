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
var DadConfigComponent = (function () {
    function DadConfigComponent(dadChartConfigsService) {
        this.dadChartConfigsService = dadChartConfigsService;
        this.title = 'Chart Configurations';
    }
    DadConfigComponent.prototype.ngOnInit = function () {
        this.charts = this.dadChartConfigsService.getChartConfigs();
    };
    DadConfigComponent = __decorate([
        core_1.Component({
            selector: 'dadconfig',
            providers: [chart_service_1.DadChartConfigsService],
            template: "\n\n    <h2>Chart Configurations</h2>\n        <div *ngFor=\"let chart of charts\">  \n        <table>\n\n         <tr><td> Chartid: </td><td>  {{ chart.id }}</td></tr>\n         <tr><td>  Name: </td><td>{{ chart.name }} </td></tr>\n         <span *ngFor=\"let param of chart.parameters\">        \n               <tr><td> Parameter Type: </td><td>  {{param.parameterType}} </td></tr>\n               <tr><td> dateFrom: </td><td>  {{param.dateFrom}} </td></tr>\n               <tr><td> dateTo: </td><td>  {{param.dateTo}} </td></tr>            \n        </span>   \n        </table>\n\n    "
        }), 
        __metadata('design:paramtypes', [chart_service_1.DadChartConfigsService])
    ], DadConfigComponent);
    return DadConfigComponent;
}());
exports.DadConfigComponent = DadConfigComponent;
//# sourceMappingURL=configuration.component.js.map