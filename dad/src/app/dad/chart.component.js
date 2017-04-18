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
var core_1 = require("@angular/core");
var data_service_1 = require("./data.service");
var mapper_1 = require("./mapper");
var dadmodels_1 = require("./dadmodels");
var chart_service_1 = require("./chart.service");
var filter_1 = require("./filter");
var DadChart = (function (_super) {
    __extends(DadChart, _super);
    function DadChart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mini = false;
        _this.big = false;
        _this.horizontal = false;
        _this.embeddedChart = false;
        _this.widgetClickChart = false;
        return _this;
    }
    return DadChart;
}(dadmodels_1.DadElement));
exports.DadChart = DadChart;
var DadChartComponent = (function () {
    function DadChartComponent(cdr, dadChartDataService, dadTableConfigsService, dadChartConfigsService, router, route) {
        this.cdr = cdr;
        this.dadChartDataService = dadChartDataService;
        this.dadTableConfigsService = dadTableConfigsService;
        this.dadChartConfigsService = dadChartConfigsService;
        this.router = router;
        this.route = route;
        this.mapper = new mapper_1.Mapper();
        this.colorPalette = ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f', '#60bd6e'];
        this.miniChartWidth = 275;
        this.miniChartHeight = 200;
        this.miniChartColor = ['#33526e'];
        this.editMode = false;
        this.refreshMode = false;
        this.addDimension = false;
        this.addFilter = false;
        this.addAlert = false;
    }
    Object.defineProperty(DadChartComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (d) {
            if (!d) {
                return;
            }
            this._data = d;
            if (this.chart.type == 'map2') {
                this.mapData = this.mapper.map(this.chart, d);
            }
            if (this.c3chart) {
                var chartData = this.mapper.map(this.chart, this.data);
                this.c3chart.load(chartData);
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    DadChartComponent.prototype.filterBy = function (d) {
        if (d >= 0) {
            var newFilter = this.chart.filters[d];
            if (!this.chart.newFilter) {
                this.chart.newFilter = {};
            }
            this.chart.newFilter.readExpression = newFilter.attribute;
            this.dadChartConfigsService.saveOne(this.chart);
            var chartData = this.mapper.map(this.chart, this.data);
            this.mapData = chartData;
            this.changeChartData(chartData);
        }
        else {
            this.addFilter = true;
        }
    };
    DadChartComponent.prototype.addNewFilter = function () {
        this.addFilter = false;
        if (!this.chart.filters) {
            this.chart.filters = [];
        }
        this.chart.filters.push({ attribute: this.newFilterAttribute, name: this.newFilterName });
        this.filterBy(this.chart.filters.length - 1);
    };
    DadChartComponent.prototype.alertWhen = function (d) {
        if (d >= 0) {
            var alert_1 = this.chart.alerts[d];
            if (!this.chart.alert) {
                this.chart.alert = {};
            }
            this.chart.alert = alert_1.expression;
            this.dadChartConfigsService.saveOne(this.chart);
            var chartData = this.mapper.map(this.chart, this.data);
            this.mapData = chartData;
            this.changeChartData(chartData);
        }
        else {
            this.addAlert = true;
        }
    };
    DadChartComponent.prototype.addNewAlert = function () {
        this.addAlert = false;
        if (!this.chart.alerts) {
            this.chart.alerts = [];
        }
        this.chart.alerts.push({ expression: this.newAlertAttribute, name: this.newAlertName });
        this.alertWhen(this.chart.alerts.length - 1);
        // this.changeMapData();
    };
    DadChartComponent.prototype.selectDimension = function (d) {
        if (d >= 0) {
            var newDimension = this.chart.dimensions[d];
            this.chart.reduction.dimension = newDimension;
            this.dadChartConfigsService.saveOne(this.chart);
            var chartData = this.mapper.map(this.chart, this.data);
            chartData.unload = true;
            this.c3chart.load(chartData);
        }
        else {
            this.addDimension = true;
        }
    };
    DadChartComponent.prototype.addNewDimension = function () {
        this.addDimension = false;
        this.chart.dimensions.push({ attribute: this.newDimensionAttribute, name: this.newDimensionName });
        this.selectDimension(this.chart.dimensions.length - 1);
    };
    DadChartComponent.prototype.selectMetric = function (d) {
        var newMetric = this.chart.metrics[d];
        this.chart.reduction.metric = newMetric;
        this.dadChartConfigsService.saveOne(this.chart);
        var chartData = this.mapper.map(this.chart, this.data);
        chartData.unload = true;
        this.c3chart.load(chartData);
    };
    DadChartComponent.prototype.onDateChanged = function (event) {
        console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    };
    DadChartComponent.prototype.onRawData = function (message) {
        this.router.navigate(['table', 100, this.chart.id], { relativeTo: this.route });
    };
    DadChartComponent.prototype.onRefresh = function () {
        if (!this.refreshMode)
            this.refreshMode = true;
        else
            this.refreshMode = false;
    };
    DadChartComponent.prototype.chartClass = function () {
        if (this.chart.big || this.chart.type === 'map2') {
            return 'col-sm-12 col-lg-12';
        }
        else {
            return 'col-sm-8 col-lg-6';
        }
    };
    DadChartComponent.prototype.realDataMonitoring = function () {
        var _this = this;
        if (this.chart.intervalRefreshOption === true) {
            var timeInterval = this.chart.intervalTime;
            this.intervalId = setInterval(function () {
                _this.changeMapData();
            }, timeInterval);
        }
    };
    DadChartComponent.prototype.onRealDataMonitoring = function () {
        this.chart.intervalRefreshOption = !this.chart.intervalRefreshOption;
        this.realDataMonitoring();
        if (this.chart.intervalRefreshOption === false) {
            this.ngOnDestroy();
        }
    };
    DadChartComponent.prototype.ngOnInit = function () {
        this.miniChartWidth = this.chart.width;
        this.miniChartHeight = this.chart.height;
        console.log("CHART starts drawing ON INIT:" + this.chart.id);
        this.realDataMonitoring();
    };
    DadChartComponent.prototype.ngOnDestroy = function () {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };
    DadChartComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log("CHART starts drawing AFTER VIEW INIT :" + this.chart.id);
        if (this.data) {
            this.drawChart(this.chart, this.data);
        }
        ;
        if (this.chart.endpoint) {
            this.dadChartDataService.getElementData(this.chart).subscribe(function (data) {
                _this.data = data;
                _this.drawChart(_this.chart, _this.data);
            }); //.catch(err => console.log(err.toString()));
        }
        this.cdr.detectChanges();
    };
    DadChartComponent.prototype.changeConfig = function () {
        var _this = this;
        this.dadChartDataService.getElementData(this.chart).subscribe(function (data) {
            _this.data = data;
            var chartData = _this.mapper.map(_this.chart, _this.data);
            _this.c3chart.load(chartData);
        });
    };
    DadChartComponent.prototype.changeChartData = function (chartData) {
        if (this.chart.type === 'bar' || this.chart.type === 'pie') {
            chartData.unload = true;
            this.c3chart.load(chartData);
        }
    };
    DadChartComponent.prototype.changeMapData = function () {
        var _this = this;
        this.dadChartDataService.getElementData(this.chart).subscribe(function (data) {
            _this.data = data;
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
    DadChartComponent.prototype.drillFromElement = function (data) {
        if (this.chart.action === 'drillFromElement') {
            var self_1 = this;
            var eventHandler_1 = this.goToTable;
            var chart_1 = this.chart;
            var route_1 = this.route;
            var router_1 = this.router;
            data.onclick = function (d, element) {
                eventHandler_1(d, chart_1, router_1, route_1, self_1);
            };
        }
    };
    //mini applied
    DadChartComponent.prototype.drawChartBar = function (chartConfig, data) {
        var bardata = this.mapper.map(chartConfig, data);
        bardata.selection = {
            enabled: true
        };
        this.drillFromElement(bardata);
        d3.selectAll(".c3-axis-x .tick").filter(function (d) {
            return d === 0;
        }).remove();
        var c3Config = {
            bindto: '#' + chartConfig.id,
            size: {},
            data: bardata,
            color: {
                pattern: this.colorPalette
            },
            tooltip: {
                grouped: false,
                format: {
                    title: function () {
                        return ([chartConfig.aname]);
                    }
                }
            },
            axis: {
                rotated: false,
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
        if (chartConfig.regionM) {
            c3Config.regions = [
                { start: this.indexOfRegions(bardata) },
            ];
        }
        if (chartConfig.mini) {
            c3Config.size = {};
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
        if (chartConfig.embeddedChart) {
            c3Config.regions = [{ 'start': 100 }];
            c3Config.axis.x.label.text = [];
            c3Config.axis.y.label.text = [];
            c3Config.size.height = 200;
            c3Config.legend.show = false;
            c3Config.axis.y.show = false;
            c3Config.grid.y.show = false;
        }
        ;
        if (chartConfig.horizontal) {
            c3Config.axis.rotated = true;
        }
        this.c3chart = c3.generate(c3Config);
        if (chartConfig.action === 'drill') {
            var self_2 = this;
            var eventHandler_2 = this.goToTable;
            var chart_2 = this.chart;
            var route_2 = this.route;
            var router_2 = this.router;
            this.c3chart.internal.main.on('click', function (d) {
                eventHandler_2(d, chart_2, router_2, route_2, self_2);
            });
        }
        ;
        if (!chartConfig.action || chartConfig.action === 'grow') {
            var eventHandler_3 = this.growIt;
            var chart_3 = this.chart;
            var route_3 = this.route;
            var router_3 = this.router;
            this.c3chart.internal.main.on('click', function (d) {
                eventHandler_3(d, chart_3, router_3, route_3);
            });
        }
    };
    ;
    DadChartComponent.prototype.growIt = function (d, chart, router, route) {
        router.navigate(['bigchart', chart.id], { relativeTo: route });
    };
    ;
    DadChartComponent.prototype.goToTable = function (d, chart, router, route, self) {
        //create the table
        var table = self.dadTableConfigsService.getTableConfig(self.chart.tableId);
        var tableConfig = JSON.parse(JSON.stringify(table)); //to clone object
        var count = chart.data.length;
        //let find the attribute   come in the reducer dimensin
        if (chart.reduction) {
            tableConfig.id += self.chart.id + ((d) ? d.id : "");
            tableConfig.filter = {};
            var attribute = chart.reduction.dimension.attribute;
            var value = void 0;
            if (chart.type === 'pie') {
                value = d.id;
            }
            if (chart.type === 'bar') {
                value = chart.mappedData.columns[0][d.x + 1];
            }
            tableConfig.filter[attribute] = value;
            var filter = new filter_1.DadFilter();
            var filteredData = filter.filter(tableConfig, chart.data);
            count = filteredData.length;
        }
        self.dadTableConfigsService.saveOne(tableConfig);
        if (chart.action === 'drillFromElement') {
            router.navigate(['table', count, chart.id, tableConfig.id], { relativeTo: route });
        }
        else {
            router.navigate(['table', count, tableConfig.id], { relativeTo: route });
        }
    };
    ;
    //mini applied
    DadChartComponent.prototype.drawChartPie = function (chartConfig, data) {
        var piedata = this.mapper.map(chartConfig, data);
        piedata.selection = {
            enabled: true
        };
        this.drillFromElement(piedata);
        var c3Config = {
            size: {},
            bindto: '#' + chartConfig.id,
            data: piedata,
            color: {
                pattern: this.colorPalette
            },
            tooltip: {
                grouped: false,
                format: {
                    title: function () {
                        return ([chartConfig.aname]);
                    }
                }
            },
            zoom: {
                enabled: true
            },
            legend: {
                show: true
            },
            interaction: {
                enabled: true
            }
        };
        if (chartConfig.mini) {
            c3Config.size.width = this.miniChartWidth;
            c3Config.size.height = this.miniChartHeight;
            c3Config.legend.show = false;
            c3Config.interaction.enabled = false;
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
                pattern: this.colorPalette
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
                    }
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
                pattern: this.colorPalette
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
                pattern: this.colorPalette
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
    DadChartComponent.prototype.drawMap = function (chartConfig, data) {
        //  this.data = this.mapper.map(chartConfig, data);
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
        if (chartConfig.type === 'donut')
            this.drawChartDonut(chartConfig, data);
        if (chartConfig.type === 'map')
            this.drawMap(chartConfig, data);
        if (chartConfig.type === 'map2')
            this.drawMap(chartConfig, data);
    };
    return DadChartComponent;
}());
__decorate([
    core_1.Input()
], DadChartComponent.prototype, "chart");
__decorate([
    core_1.Input()
], DadChartComponent.prototype, "data");
DadChartComponent = __decorate([
    core_1.Component({
        selector: 'dadchart',
        providers: [data_service_1.DadElementDataService, chart_service_1.DadTableConfigsService, chart_service_1.DadChartConfigsService],
        template: "\n<div class=\"dadChart\">\n    <div *ngIf=\"!chart.mini && !chart.embeddedChart\" [ngClass]=\"chartClass()\">  \n        <div class=\"inside\">\n          <div class=\"content card-inverse card-secondary\">    \n            <div class=\"card-block pb-0\">\n                <div class=\"content card card-secondary\">   \n                    <div class=\"btn-group float-xs-right\" dropdown>\n                        <button style=\"color:black;\" type=\"button\" class=\"btn btn-transparent dropdown-toggle p-0\" dropdownToggle>\n                            <i class=\"icon-settings\"></i>\n                        </button>\n                        <div class=\"dropdown-menu dropdown-menu-right\" dropdownMenu>\n                           <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onEdit('')\">Edit</div></button>\n                           <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onRawData()\">See raw fact data</div></button>\n                           <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onRefresh()\">Refresh</div></button>\n                        </div>\n                    </div>\n                    <div>\n                        <div *ngIf=\"!chart.reduction\" style=\"color:black;\">{{chart.name}}</div>  \n                        <div style=\"color:black;\">  \n                        \n                           <div *ngIf=\"chart.reduction\" (change)=\"selectMetric($event.target.value)\" style=\"display: inline-block; color:black; font-weight: bold; max-width:250px;\" >\n                                    <option style=\"color:black; font-weight: bold;\" *ngFor=\"let met of chart.metrics; let i=index\" value=\"{{i}}\" [selected] = \"met.name === chart.reduction.metric.name\">{{met.name}}</option>                 </div>  \n                           \n                           <i *ngIf=\"chart.reduction\">by</i>\n                           \n                           <select *ngIf=\"chart.reduction\" (change)=\"selectDimension($event.target.value)\" class=\"form-control\" style=\"display: inline-block; color:black; font-weight: bold; max-width:150px;\" >\n                                    <option [id]=\"chart.id + '_dimension'\" style=\"color:black;\" *ngFor=\"let dim of chart.dimensions; let i=index\" value=\"{{i}}\" [selected] = \"chart.reduction.dimension.name === dim.name\" >{{dim.name}}</option>\n                                    <option [id]=\"chart.id + '_newdimension'\" style=\"color:black;\" value=\"{{-1}}\" >Add Dimension</option>\n                           </select>\n                           <br/>\n                           <i>filter by</i>\n                           \n                            <select (change)=\"filterBy($event.target.value)\" class=\"form-control\" style=\"display: inline-block; color:black; font-weight: bold; max-width:150px;\" >\n                                    <option style=\"color:grey;\" disabled selected>Select</option>\n                                    <option [id]=\"chart.id + '_filteredData'\" style=\"color:black;\" *ngFor=\"let fil of chart.filters; let i=index\" value=\"{{i}}\" [selected] =\"chart.newFilter.name === fil.name\" >{{fil.name}}</option>\n                                    <option [id]=\"chart.id + '_newfilteredData'\" style=\"color:black;\" value=\"{{-1}}\" >Add Filter</option>\n                            </select> \n                            \n                            <!-- <i>alert when</i>\n                           \n                             <select (change)=\"alertWhen($event.target.value)\" class=\"form-control\" style=\"display: inline-block; color:black; font-weight: bold; max-width:150px;\" >\n                                    <option style=\"color:grey;\" disabled selected>Select</option>\n                                    <option [id]=\"chart.id + '_alertData'\" style=\"color:black;\" *ngFor=\"let alert of chart.alerts; let i=index\" value=\"{{i}}\" [selected] =\"chart.alert.name === alert.name\" >{{alert.name}}</option>\n                                    <option [id]=\"chart.id + '_newAlert'\" style=\"color:black;\" value=\"{{-1}}\" >Add Alert</option>\n                            </select> \n                            -->\n                            <label class=\"switch switch-text switch-pill switch-success pull-right pb-1\">\n                                <input type=\"checkbox\" class=\"switch-input\" (click)=\"onRealDataMonitoring()\">\n                                <span class=\"switch-label\" data-on=\"On\" data-off=\"Off\"></span>\n                                <span class=\"switch-handle\"></span>\n                            </label>\n                            \n                           <div *ngIf=\"addDimension\">\n                               <div></div>\n                               <div><input style=\"height:32px;\" [(ngModel)]=\"newDimensionName\"   type=\"text\"   placeholder=\"Dimension Name\"></div>\n                               <div><input style=\"height:32px;\" [(ngModel)]=\"newDimensionAttribute\"  type=\"text\"   placeholder=\"Dimension Attribute\"></div>\n                               <div><button (click)=\"addNewDimension()\">Add New Dimension</button></div>                     \n                           </div>\n                           \n                           <div *ngIf=\"addFilter\">\n                           <div></div>\n                               <div><input style=\"height:32px;\" [(ngModel)]=\"newFilterName\" type=\"text\" placeholder=\"Filter Name\"></div>\n                               <div><input style=\"height:32px;\" [(ngModel)]=\"newFilterAttribute\" type=\"text\" placeholder=\"Filter Expression\"></div>\n                               <div><button (click)=\"addNewFilter()\">Add New Filter</button></div>                     \n                           </div>\n                        <!--\n                           <div *ngIf=\"addAlert\">\n                           <div></div>\n                               <div><input style=\"height:32px;\" [(ngModel)]=\"newAlertName\" type=\"text\" placeholder=\"Alert Name\"></div>\n                               <div><input style=\"height:32px;\" [(ngModel)]=\"newFilterAttribute\" type=\"text\" placeholder=\"Filter Expression\"></div>\n                               <div><input style=\"height:32px;\" [(ngModel)]=\"newAlertAttribute\" type=\"text\" placeholder=\"Alert Expression\"></div>\n                               <div><button (click)=\"addNewAlert()\">Add New Alert</button></div>                     \n                           </div>\n                        -->\n                        </div><br/><br/><br/> \n                        \n                   \n                        <div *ngIf=\"chart.type!=='map2' && chart.big\" style=\"text-align:center; padding-bottom:70%; height:50%; width:100%;\" [id]=\"chart.id\"></div>\n                        <div *ngIf=\"chart.type!=='map2' && !chart.big\" style=\"text-align:center; height:100%; width:100%;\" [id]=\"chart.id\"></div>\n                        <div *ngIf=\"_data && chart.type==='map2'\" style=\"text-align:center; height:100%; width:100%;\"  > <dadmap2 [map]=\"chart\" [data]=\"mapData\"></dadmap2> </div>\n                                                \n                        <div style=\"color:black;\">\n                            <dadparameters [element]=\"chart\" [editMode]=\"editMode\" [onRefresh]=\"refreshMode\" (parametersChanged)=\"changeConfig()\"></dadparameters>\n                        </div>\n                        <br/>\n                    </div>\n                </div>\n            </div>\n          </div>\n          <!--If it is mini chart -->\n         \n        </div>\n    </div>\n        <div *ngIf=\"chart.mini\" style=\"text-align:left; height:auto; width:auto;\" [id]=\"chart.id\"></div>\n        <div *ngIf=\"chart.embeddedChart\"  style=\"text-align:left; width:auto;\" [id]=\"chart.id\"></div>\n        <div *ngIf=\"_data && chart.type==='map'\" > <dadmap [map]=\"chart\" [data]=\"_data\"></dadmap></div>\n        <!--<div *ngIf=\"_data && chart.type==='map2'\" > <dadmap2 [map]=\"chart\" [data]=\"_data\"></dadmap2></div>-->\n         \n        \n</div>\n    "
    })
], DadChartComponent);
exports.DadChartComponent = DadChartComponent;
