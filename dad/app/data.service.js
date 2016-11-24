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
 * Created by pabloelustondo on 2016-11-21.
 */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var appconfig_1 = require("./appconfig");
var DadChartDataService = (function () {
    function DadChartDataService(http) {
        this.http = http;
    }
    DadChartDataService.prototype.getChartData = function (chart) {
        console.log("we got " + appconfig_1.config["oda_dev_url"]);
        var params = new http_1.URLSearchParams();
        for (var _i = 0, _a = chart.parameters; _i < _a.length; _i++) {
            var chartparam = _a[_i];
            if (chartparam.parameterType = "DateRange") {
                console.log("Chart:" + chart.id + " Got DateRange:" + chartparam.dateFrom + ":" + chartparam.dateTo);
                params.set('dateFrom', chartparam.dateFrom);
                params.set('dateTo', chartparam.dateTo);
            }
        }
        return this.http.get(appconfig_1.config.oda_dev_url, { search: params }).toPromise().then(function (response) { return JSON.parse(response['_body']); }).catch(function (err) {
            console.log("we got " + err.json());
        });
    };
    DadChartDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DadChartDataService);
    return DadChartDataService;
}());
exports.DadChartDataService = DadChartDataService;
//# sourceMappingURL=data.service.js.map