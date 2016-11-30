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
    DadChartComponent.prototype.drawChartDogaBar = function (chartConfig, data) {
        /**
         * Created by dister on 11/29/2016.
         */
        var jsonData = [
            { "team": "BI", "number_of_members": 5 },
            { "team": "IT", "number_of_members": 12 },
            { "team": "AfW", "number_of_members": 5 },
            { "team": "QA", "number_of_members": 100 },
            { "team": "iOS", "number_of_members": 11 },
            { "team": "Windows Modern", "number_of_members": 10 },
            { "team": "DB", "number_of_members": 3 },
            { "team": "GCC", "number_of_members": 7 },
            { "team": "NGUI", "number_of_members": 15 }
        ];
        var dataDoga = {};
        var team = [];
        jsonData.forEach(function (e) {
            team.push(e.team);
            dataDoga[e.team] = e.number_of_members;
        });
        var chart = c3.generate({
            bindto: '#' + chartConfig.id,
            data: {
                json: [dataDoga],
                keys: {
                    value: team
                },
                type: 'bar',
            },
            tooltip: {
                format: {
                    title: function (value) { return ('Teams'); }
                }
            },
            axis: {
                x: {
                    label: {
                        text: 'Teams',
                        position: 'outer-right'
                    }
                },
                y: {
                    label: {
                        text: 'Number of Members',
                        position: 'outer-top'
                    }
                }
            }
        });
    };
    DadChartComponent.prototype.drawChart = function (chartConfig, data) {
        if (chartConfig.type === 'bar2')
            this.drawChartDogaBar(chartConfig, data);
        if (chartConfig.type === 'pie2')
            this.drawDogaChartPie(chartConfig, data);
    };
    DadChartComponent.prototype.drawDogaChartPie = function (chartConfig, data) { };
    ;
    DadChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("CHART starts drawing :" + this.chart.id);
        this.dadChartDataService.getChartData(this.chart).then(function (data) {
            _this.data = data.data;
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
            template: " <!--  BEGIN CHART COMPONENT -->\n \n    <table style=\"border:solid\">\n    <tr><td> <div (click)=\"onSelect(chart)\">{{chart.name}} </div> </td></tr>\n    <tr *ngIf=\"chart.parameters\"><td> <span *ngFor=\"let p of chart.parameters\"> {{p.parameterType}} - {{p.dateFrom}} - {{p.dateTo}}</span></td></tr>\n    <tr>\n        <td> <div style=\"height: 300px  \"><svg [id]=\"chart.id\"></svg></div> </td>\n        <td>\n            <div>Raw Data: \n              <div *ngIf=\"data\">\n                <div *ngFor =\"let d of data\">\n                {{d.Rng}} -- {{d.NumberOfDevices}}\n                </div>\n              </div>\n              <div *ngIf=\"!data\">\n                Data Not Available\n              </div>\n            </div>\n        </td>\n    </tr>     \n    </table>\n    <br/>\n    <br/>\n    <!--  END CHART COMPONENT -->"
        }), 
        __metadata('design:paramtypes', [data_service_1.DadChartDataService])
    ], DadChartComponent);
    return DadChartComponent;
}());
exports.DadChartComponent = DadChartComponent;
//# sourceMappingURL=chart.component.js.map