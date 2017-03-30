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
var DadLoginComponent = (function () {
    function DadLoginComponent(activatedRoute) {
        this.activatedRoute = activatedRoute;
    }
    DadLoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            _this.id_token = params['id_token'];
            localStorage.setItem('id_token', _this.id_token);
            window.location.href = window.location.protocol + '//' + window.location.host;
        });
    };
    DadLoginComponent = __decorate([
        core_1.Component({
            selector: 'dadlogin',
            styles: ['.row{overflow:hidden;}'],
            providers: [chart_service_1.DadChartConfigsService, chart_service_1.DadWidgetConfigsService, chart_service_1.DadTableConfigsService],
            template: "\nHello Login\n    "
        })
    ], DadLoginComponent);
    return DadLoginComponent;
}());
exports.DadLoginComponent = DadLoginComponent;
