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
var core_1 = require("@angular/core");
var DadChart = (function () {
    function DadChart() {
    }
    return DadChart;
}());
exports.DadChart = DadChart;
var DadChartComponent = (function () {
    function DadChartComponent() {
    }
    DadChartComponent.prototype.ngOnInit = function () {
        console.log("CHART starts drawing :" + this.chart.id);
        this.data = { "status": "ok",
            "request": { "hostname": "2vf2f8xp27.execute-api.us-east-1.amazonaws.com", "path": "/test/function_one", "method": "GET", "headers": { "x-api-key": "DiGyphaBjj10CbsNpqBAM2kLGfRAXRob9XYEchxm", "dateFrom": "2016-08-20", "dateTo": "2016-08-25" } },
            "result": [
                { "NumberOfDevices": "1", "Rng": "0-10", "Percentage": "0.00032776138970829" },
                { "NumberOfDevices": "14", "Rng": "11-20", "Percentage": "0.00458865945591609" },
                { "NumberOfDevices": "13", "Rng": "21-30", "Percentage": "0.00426089806620780" },
                { "NumberOfDevices": "18", "Rng": "31-40", "Percentage": "0.00589970501474926" },
                { "NumberOfDevices": "22", "Rng": "41-50", "Percentage": "0.00721075057358243" },
                { "NumberOfDevices": "42", "Rng": "51-60", "Percentage": "0.01376597836774827" },
                { "NumberOfDevices": "61", "Rng": "61-70", "Percentage": "0.01999344477220583" },
                { "NumberOfDevices": "105", "Rng": "71-80", "Percentage": "0.03441494591937069" },
                { "NumberOfDevices": "295", "Rng": "81-90", "Percentage": "0.09668960996394624" },
                { "NumberOfDevices": "2480", "Rng": "91-100", "Percentage": "0.81284824647656506" }
            ] };
        var testdata = [];
        for (var _i = 0, _a = this.data.result; _i < _a.length; _i++) {
            var r = _a[_i];
            testdata.push({ "key": r.Rng, "y": r.NumberOfDevices });
        }
        var width = 300;
        var height = 300;
        function drawChart(chartConfig) {
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
        }
        ;
        drawChart(this.chart);
    };
    return DadChartComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", DadChart)
], DadChartComponent.prototype, "chart", void 0);
DadChartComponent = __decorate([
    core_1.Component({
        selector: 'dadchart',
        template: " <!--  BEGIN CHART COMPONENT -->\n \n    <table style=\"border:solid\"><tr><td>\n    <div (click)=\"onSelect(chart)\">{{chart.name}}</div>\n    </td></tr>\n    <tr><td>\n    <div style=\"height: 300px  \"><svg [id]=\"chart.id\"></svg></div>\n    </td><td>\n    <div>Raw Data: \n        <div *ngFor =\"let d of data.result\">\n        {{d.Rng}} -- {{d.NumberOfDevices}}\n        </div>\n    </div></td></tr>\n    </table>\n    <br/>\n    <br/>\n    DEBUG AREA:    <br/>\n    <input style=\"width: 300px;\" [(ngModel)]=\"chart.name\" placeholder=\"name\">\n\n    <!--  END CHART COMPONENT -->"
    }),
    __metadata("design:paramtypes", [])
], DadChartComponent);
exports.DadChartComponent = DadChartComponent;
//# sourceMappingURL=chart.component.js.map