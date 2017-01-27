"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var data_service_1 = require('./data.service');
var mapper_1 = require("./mapper");
var dadmodels_1 = require("./dadmodels");
var DadChart = (function (_super) {
    __extends(DadChart, _super);
    function DadChart() {
        _super.apply(this, arguments);
        this.mini = false;
    }
    return DadChart;
}(dadmodels_1.DadElement));
exports.DadChart = DadChart;
var DadChartComponent = (function () {
    function DadChartComponent(dadChartDataService, router, route) {
        this.dadChartDataService = dadChartDataService;
        this.router = router;
        this.route = route;
        this.mapper = new mapper_1.Mapper();
        this.colorPalette = ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e'];
        this.miniChartWidth = 275;
        this.miniChartHeight = 200;
        this.miniChartColor = ['#33526e'];
        this.editMode = false;
        this.refreshMode = false;
    }
    DadChartComponent.prototype.onDateChanged = function (event) {
        console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    };
    DadChartComponent.prototype.onRefresh = function () {
        if (!this.refreshMode)
            this.refreshMode = true;
        else
            this.refreshMode = false;
    };
    DadChartComponent.prototype.ngOnInit = function () {
        this.miniChartWidth = this.chart.width;
        this.miniChartHeight = this.chart.height;
        console.log("CHART starts drawing ON INIT:" + this.chart.id);
    };
    DadChartComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log("CHART starts drawing AFTER VIEW INIT :" + this.chart.id);
        if (!this.data && this.chart.data) {
            this.data = this.chart.data;
        }
        if (this.data) {
            this.drawChart(this.chart, this.data);
        }
        else {
            this.dadChartDataService.getElementData(this.chart).then(function (data) {
                _this.data = data.data;
                _this.drawChart(_this.chart, _this.data);
            }).catch(function (err) { return console.log(err.toString()); });
        }
    };
    DadChartComponent.prototype.changeConfig = function () {
        var _this = this;
        this.dadChartDataService.getElementData(this.chart).then(function (data) {
            _this.data = data.data;
            var chartData = _this.mapper.map(_this.chart, _this.data);
            _this.c3chart.load(chartData);
        });
    };
    DadChartComponent.prototype.onEdit = function (message) {
        if (!this.editMode)
            this.editMode = true;
        else
            this.editMode = false;
    };
    DadChartComponent.prototype.indexOfRegions = function (chartData) {
        var M = this.chart.regionM;
        var Dimension = chartData.columns[0];
        var i;
        for (i = 1; i < Dimension.length; i++) {
            if (Dimension[i] >= M) {
                return i - 1;
            }
        }
        return 0;
    };
    //mini applied
    DadChartComponent.prototype.drawChartBar = function (chartConfig, data) {
        var chartData = this.mapper.map(chartConfig, data);
        var bardata = chartData;
        bardata.selection = {
            enabled: true,
        };
        d3.selectAll(".c3-axis-x .tick").filter(function (d) {
            return d === 0;
        }).remove();
        var c3Config = {
            size: {
                height: chartConfig.height,
                width: chartConfig.width,
            },
            bindto: '#' + chartConfig.id,
            data: bardata,
            color: {
                pattern: this.colorPalette,
            },
            tooltip: {
                show: false
            },
            axis: {
                x: {
                    type: 'category',
                    show: true,
                    label: {
                        text: [chartConfig.bname],
                        position: 'outer-right'
                    },
                    tick: {
                        multiline: false
                    }
                },
                y: {
                    show: true,
                    label: {
                        text: [chartConfig.aname],
                        position: 'outer-top'
                    }
                }
            },
            grid: {
                x: {
                    show: false
                },
                y: {
                    show: true
                },
                focus: {
                    show: false
                }
            },
            regions: [
                { start: this.indexOfRegions(chartData) },
            ],
            zoom: {
                enabled: true
            },
            legend: {
                show: false
            },
            interaction: {
                enabled: true
            },
            bar: {
                width: {
                    ratio: 0.7
                }
            }
        };
        if (chartConfig.mini) {
            c3Config.size.width = this.miniChartWidth;
            c3Config.size.height = this.miniChartHeight;
            c3Config.legend.show = false;
            c3Config.axis.x.show = false;
            c3Config.axis.y.show = false;
            //c3Config.subchart.show = false;
            c3Config.zoom.enabled = false;
            c3Config.grid.y.show = false;
            c3Config.color.pattern = this.miniChartColor;
            c3Config.interaction.enabled = false;
            c3Config.regions = [{ 'start': 100 }];
            c3Config.data.color = function (color, d) {
                return d.value === 100 ? "#007F00" : color && d.value <= 30 ? "#FF0000" : color;
            };
        }
        ;
        this.c3chart = c3.generate(c3Config);
        var eventHandler = this.goToTable;
        var chart = this.chart;
        var route = this.route;
        var router = this.router;
        this.c3chart.internal.main.on('click', function (d) {
            eventHandler(d, chart, router, route);
        });
    };
    ;
    DadChartComponent.prototype.goToTable = function (d, chart, router, route) {
        router.navigate(['table', 100, chart.id], { relativeTo: route });
    };
    ;
    //mini applied
    DadChartComponent.prototype.drawChartPie = function (chartConfig, data) {
        var chartData = this.mapper.map(chartConfig, data);
        var c3Config = {
            size: {
                height: chartConfig.height,
                width: chartConfig.width
            },
            bindto: '#' + chartConfig.id,
            data: chartData,
            color: {
                pattern: this.colorPalette,
            },
            zoom: {
                enabled: true
            },
            legend: {
                show: true
            }
        };
        if (chartConfig.mini) {
            c3Config.size.width = this.miniChartWidth;
            c3Config.size.height = this.miniChartHeight;
            c3Config.legend.show = false;
        }
        ;
        this.c3chart = c3.generate(c3Config);
    };
    ;
    //mini applied
    DadChartComponent.prototype.drawChartDot = function (chartConfig, data) {
        var chartData = this.mapper.map(chartConfig, data);
        d3.selectAll(".c3-axis-x .tick").filter(function (d) {
            return d === 0;
        }).remove();
        var c3Config = {
            size: {
                height: chartConfig.height,
                width: chartConfig.width
            },
            bindto: '#' + chartConfig.id,
            data: chartData,
            color: {
                pattern: this.colorPalette,
            },
            grid: {
                focus: {
                    show: true
                },
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },
            tooltip: {
                grouped: false,
                format: {
                    title: function () {
                        return ([chartConfig.b]);
                    },
                }
            },
            axis: {
                x: {
                    show: true,
                    label: {
                        text: [chartConfig.b],
                        position: 'outer-right'
                    }
                },
                y: {
                    show: true,
                    label: {
                        text: [chartConfig.a],
                        position: 'outer-top'
                    }
                }
            },
            zoom: {
                enabled: true
            },
            subchart: {
                show: true
            },
            legend: {
                show: true
            }
        };
        if (chartConfig.mini) {
            c3Config.size.width = this.miniChartWidth;
            c3Config.size.height = this.miniChartHeight;
            c3Config.legend.show = false;
            c3Config.axis.x.show = false;
            c3Config.axis.y.show = false;
            c3Config.subchart.show = false;
            c3Config.zoom.enabled = false;
            c3Config.grid.y.show = false;
            c3Config.grid.focus.show = false;
        }
        ;
        this.c3chart = c3.generate(c3Config);
    };
    ;
    //mini applied
    DadChartComponent.prototype.drawChartSpline = function (chartConfig, data) {
        var chartData = this.mapper.map(chartConfig, data);
        var splinedata = chartData;
        splinedata.selection = {
            enabled: true
        };
        d3.selectAll(".c3-axis-x .tick").filter(function (d) {
            return d === 0;
        }).remove();
        var c3Config = {
            size: {
                height: chartConfig.height,
                width: chartConfig.width
            },
            bindto: '#' + chartConfig.id,
            data: splinedata,
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                },
                focus: {
                    show: true
                }
            },
            color: {
                pattern: this.colorPalette,
            },
            axis: {
                x: {
                    type: 'category',
                    categories: chartData.x,
                    show: true,
                    label: {
                        text: [chartConfig.a],
                        position: 'outer-right'
                    }
                },
                y: {
                    show: true,
                    label: {
                        text: [chartConfig.b],
                        position: 'outer-top'
                    }
                }
            },
            zoom: {
                enabled: true
            },
            subchart: {
                show: true
            },
            legend: {
                show: true
            }
        };
        if (chartConfig.mini) {
            c3Config.size.width = this.miniChartWidth;
            c3Config.size.height = this.miniChartHeight;
            c3Config.legend.show = false;
            c3Config.axis.x.show = false;
            c3Config.axis.y.show = false;
            c3Config.subchart.show = false;
            c3Config.zoom.enabled = false;
            c3Config.grid.y.show = false;
            c3Config.grid.focus.show = false;
        }
        ;
        this.c3chart = c3.generate(c3Config);
    };
    //mini applied
    DadChartComponent.prototype.drawChartDonut = function (chartConfig, data) {
        var chartData = this.mapper.map(chartConfig, data);
        var c3Config = {
            size: {
                height: chartConfig.height,
                width: chartConfig.width
            },
            bindto: '#' + chartConfig.id,
            data: chartData,
            color: {
                pattern: this.colorPalette,
            },
            legend: {
                show: true
            }
        };
        if (chartConfig.mini) {
            c3Config.size.width = this.miniChartWidth;
            c3Config.size.height = this.miniChartHeight;
            c3Config.legend.show = false;
        }
        ;
        this.c3chart = c3.generate(c3Config);
    };
    ;
    DadChartComponent.prototype.drawChart = function (chartConfig, data) {
        if (chartConfig.type === 'bar')
            this.drawChartBar(chartConfig, data);
        if (chartConfig.type === 'pie')
            this.drawChartPie(chartConfig, data);
        if (chartConfig.type === 'dot')
            this.drawChartDot(chartConfig, data);
        if (chartConfig.type === 'spline')
            this.drawChartSpline(chartConfig, data);
        if (chartConfig.type === 'donut')
            this.drawChartDonut(chartConfig, data);
    };
    __decorate([
        core_1.Input()
    ], DadChartComponent.prototype, "chart", void 0);
    __decorate([
        core_1.Input()
    ], DadChartComponent.prototype, "data", void 0);
    DadChartComponent = __decorate([
        core_1.Component({
            selector: 'dadchart',
            providers: [data_service_1.DadElementDataService],
            template: " <!--  BEGIN CHART COMPONENT -->\n   <div class=\"col-sm-12 col-lg-6\">        \n       <div class=\"card-block pb-0\">\n       <div *ngIf=\"!chart.mini\" class=\"card card-inverse card-secondary\">\n           <div *ngIf=\"!chart.mini\" class=\"btn-group float-xs-right\" dropdown>\n               <button style=\"color:black;\" type=\"button\" class=\"btn btn-transparent dropdown-toggle p-0\" dropdownToggle>\n                   <i class=\"icon-settings\"></i>\n               </button>\n               <div class=\"dropdown-menu dropdown-menu-right\" dropdownMenu>\n                   <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onEdit('lalal')\">Edit</div></button>\n                   <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onRefresh()\">Refresh</div></button>\n               </div>\n           </div>\n  \n      <div *ngIf=\"!chart.mini\">\n          <div style=\"color:black; font-weight:bold;\">{{chart.name}}</div> <br/><br/><br/>        \n          <div style= \"text-align:center; height:700px;  width:700px\" [id]=\"chart.id\"></div>\n          <div style=\"margin-left: 15px; color:black;\">\n              <dadparameters [element]=\"chart\" [editMode]=\"editMode\" [onRefresh]=\"refreshMode\" (parametersChanged)=\"changeConfig()\"></dadparameters>  \n          </div>\n      </div>\n      </div>\n      <div *ngIf=\"chart.mini\" style= \"text-align:left; height:auto;  width:auto;\" [id]=\"chart.id\"></div>\n      </div>\n    </div>\n\n    <!--  END CHART COMPONENT -->"
        })
    ], DadChartComponent);
    return DadChartComponent;
}());
exports.DadChartComponent = DadChartComponent;