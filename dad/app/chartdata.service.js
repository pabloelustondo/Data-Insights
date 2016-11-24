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
var mock_data_1 = require('./mock.data');
var DadChartConfigsService = (function () {
    function DadChartConfigsService() {
    }
    DadChartConfigsService.prototype.getChartData = function () {
        return mock_data_1.DATA;
    };
    DadChartConfigsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DadChartConfigsService);
    return DadChartConfigsService;
}());
exports.DadChartConfigsService = DadChartConfigsService;
//# sourceMappingURL=chartdata.service.js.map