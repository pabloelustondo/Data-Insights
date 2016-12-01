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
    DadChartComponent.prototype.drawChartBar = function (chartConfig, data) {
        var barData = {};
        var team = [];
        data.forEach(function (e) {
            team.push(e.Rng);
            barData[e.Rng] = e.NumberOfDevices;
        });
        c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [barData],
                keys: {
                    value: team
                },
                type: 'bar',
            },
            tooltip: {
                format: {
                    title: function (value) { return ('Range of Battery Levels'); }
                }
            },
            axis: {
                x: {
                    label: {
                        text: 'Range of Battery Levels',
                        position: 'outer-right'
                    }
                },
                y: {
                    label: {
                        text: 'Number of Devices',
                        position: 'outer-top'
                    }
                }
            }
        });
    };
    DadChartComponent.prototype.drawChartPie = function (chartConfig, data) {
        var pieData = {};
        var brand = [];
        data.forEach(function (e) {
            brand.push(e.Rng);
            pieData[e.Rng] = e.NumberOfDevices;
        });
        c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [pieData],
                keys: {
                    value: brand
                },
                type: 'pie',
            },
        });
    };
    ;
    DadChartComponent.prototype.drawChartDot = function (chartConfig, data) {
        var dotData = {};
        var device_owner = [];
        data.forEach(function (e) {
            device_owner.push(e.Rng);
            dotData[e.Rng] = e.NumberOfDevices;
        });
        c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [dotData],
                keys: {
                    value: device_owner
                },
                type: 'spline',
            },
            tooltip: {
                format: {
                    title: function () {
                        return ('Range of Battery Levels');
                    },
                }
            },
            axis: {
                x: {
                    label: {
                        text: 'Range of Battery Levels',
                        position: 'outer-right'
                    }
                },
                y: {
                    label: {
                        text: 'Number of Devices',
                        position: 'outer-top'
                    }
                }
            },
        });
    };
    ;
    DadChartComponent.prototype.drawChartSpline = function (chartConfig, data) {
        var data1 = {};
        var brand = [];
        data.forEach(function (e) {
            brand.push(e.Rng);
            data1[e.Rng] = e.NumberOfDevices;
        });
        c3.generate({
            size: {
                height: 400,
                width: 475
            },
            bindto: '#' + chartConfig.id,
            data: {
                columns: [
                    ['Number of Devices', 30, 40, 500, 0],
                    ['Range', 1, 10, 90, 70, 85, 5, 100]
                ],
                keys: {
                    value: brand
                },
                type: 'spline',
            },
        });
    };
    DadChartComponent.prototype.drawChart = function (chartConfig, data) {
        if (chartConfig.type === 'bar')
            this.drawChartBar(chartConfig, data);
        if (chartConfig.type === 'pie')
            this.drawChartPie(chartConfig, data);
        if (chartConfig.type === 'dot')
            this.drawChartDot(chartConfig, data);
        if (chartConfig.type === 'spline')
            this.drawChartSpline(chartConfig, data);
    };
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
            template: " <!--  BEGIN CHART COMPONENT -->\n     <table style=\"border:solid; color:darkgray\">\n        <tr>\n            <td><div style= \"text-align:center; height:700px;  width:700px\" [id]=\"chart.id\"></div></td>\n        </tr>\n    </table>\n    <br/><br/><br/>\n\n    <!--  END CHART COMPONENT -->"
        }), 
        __metadata('design:paramtypes', [data_service_1.DadChartDataService])
    ], DadChartComponent);
    return DadChartComponent;
}());
exports.DadChartComponent = DadChartComponent;
//# sourceMappingURL=chart.component.js.map