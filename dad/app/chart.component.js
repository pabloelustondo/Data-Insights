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
 * Created by pelustondo on 11/21/2016.
 */
var core_1 = require('@angular/core');
var data_service_1 = require('./data.service');
var DadChart = (function () {
    function DadChart() {
    }
    return DadChart;
}());
exports.DadChart = DadChart;
var DadChartComponent = (function () {
    function DadChartComponent(dadChartDataService) {
        this.dadChartDataService = dadChartDataService;
    }
    DadChartComponent.prototype.drawChart = function (chartConfig, data) {
        if (!data)
            return;
        var testdata = [];
        for (var _i = 0, _a = data.result; _i < _a.length; _i++) {
            var r = _a[_i];
            testdata.push({ "key": r.Rng, "y": r.NumberOfDevices });
        }
        var width = 300;
        var height = 300;
        nv.addGraph(function () {
            var d3Chart = nv.models.pie()
                .x(function (d) {
                return d.key;
            })
                .y(function (d) {
                return d.y;
            })
                .width(width)
                .height(height)
                .labelType(function (d, i, values) {
                return values.key + ':' + values.value;
            });
            console.log("CHART is actually drawing:" + "#" + chartConfig.id);
            d3.select("#" + chartConfig.id)
                .datum([testdata])
                .transition().duration(1200)
                .attr('width', width)
                .attr('height', height)
                .call(d3Chart);
            return d3Chart;
        });
    };
    ;
    DadChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("CHART starts drawing :" + this.chart.id);
        this.dadChartDataService.getChartData().then(function (data) {
            _this.data = data;
            _this.drawChart(_this.chart, _this.data);
        }).catch(function (err) { return console.log(err.toString()); });
        /*
        this.dadChartDataService.getChartData().then(data => {
            this.dadDrawChart(this.chart,data);
        });
    */
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', DadChart)
    ], DadChartComponent.prototype, "chart", void 0);
    DadChartComponent = __decorate([
        core_1.Component({
            selector: 'dadchart',
            providers: [data_service_1.DadChartDataService],
            template: " <!--  BEGIN CHART COMPONENT -->\n \n    <table style=\"border:solid\"><tr><td>\n    <div (click)=\"onSelect(chart)\">{{chart.name}}</div>\n    </td></tr>\n    <tr><td>\n    <div style=\"height: 300px  \"><svg [id]=\"chart.id\"></svg></div>\n    </td><td>\n    <div>Raw Data: \n      <div *ngIf=\"data\">\n        <div *ngFor =\"let d of data.result\">\n        {{d.Rng}} -- {{d.NumberOfDevices}}\n        </div>\n      </div>\n      <div *ngIf=\"!data\">\n        Not Available\n      </div>\n    </div></td></tr>\n    </table>\n    <br/>\n    <br/>\n    DEBUG AREA:    <br/>\n    <input style=\"width: 300px;\" [(ngModel)]=\"chart.name\" placeholder=\"name\">\n\n    <!--  END CHART COMPONENT -->"
        }), 
        __metadata('design:paramtypes', [data_service_1.DadChartDataService])
    ], DadChartComponent);
    return DadChartComponent;
}());
exports.DadChartComponent = DadChartComponent;
//# sourceMappingURL=chart.component.js.map