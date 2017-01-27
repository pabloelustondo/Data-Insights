"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by pabloelustondo on 2016-11-21.
 */
var core_1 = require('@angular/core');
var mock_charts_1 = require('./mock.charts');
var mock_widgets_1 = require("./mock.widgets");
var mock_tables_1 = require("./mock.tables");
var _ = require("lodash");
var DadChartConfigsService = (function () {
    function DadChartConfigsService() {
    }
    DadChartConfigsService.prototype.clearLocalCopy = function () {
        localStorage.removeItem("chartdata");
    };
    DadChartConfigsService.prototype.save = function (charts) {
        var charts_string = JSON.stringify(charts);
        localStorage.setItem("chartdata", charts_string);
    };
    DadChartConfigsService.prototype.getChartConfigs = function () {
        var charts_string = localStorage.getItem("chartdata");
        if (charts_string != null) {
            var charts_obj = JSON.parse(charts_string);
            var DATA = charts_obj;
            return DATA;
        }
        else {
            this.save(mock_charts_1.CHARTS);
            return mock_charts_1.CHARTS;
        }
    };
    DadChartConfigsService.prototype.getChartConfig = function (id) {
        var charts = this.getChartConfigs();
        var chartIndex = _.findIndex(charts, function (w) { return w.id == id; });
        return charts[chartIndex];
    };
    DadChartConfigsService = __decorate([
        core_1.Injectable()
    ], DadChartConfigsService);
    return DadChartConfigsService;
}());
exports.DadChartConfigsService = DadChartConfigsService;
var DadWidgetConfigsService = (function () {
    function DadWidgetConfigsService() {
    }
    DadWidgetConfigsService.prototype.clearLocalCopy = function () {
        localStorage.removeItem("widgetdata");
    };
    DadWidgetConfigsService.prototype.saveOne = function (widget) {
        var widgets = this.getWidgetConfigs();
        var widgetIndex = _.findIndex(widgets, function (w) { return w.id == widget.id; });
        widgets.splice(widgetIndex, 1, widget);
        this.save(widgets);
    };
    DadWidgetConfigsService.prototype.save = function (widgets) {
        var widgets_string = JSON.stringify(widgets);
        localStorage.setItem("widgetdata", widgets_string);
    };
    DadWidgetConfigsService.prototype.getWidgetConfig = function (id) {
        var widgets = this.getWidgetConfigs();
        var widgetIndex = _.findIndex(widgets, function (w) { return w.id == id; });
        return widgets[widgetIndex];
    };
    DadWidgetConfigsService.prototype.getWidgetConfigs = function () {
        var widget_string = localStorage.getItem("widgetdata");
        if (widget_string != null) {
            var widget_obj = JSON.parse(widget_string);
            var DATA = widget_obj;
            return DATA;
        }
        else {
            var widget_string_1 = JSON.stringify(mock_widgets_1.WIDGETS);
            localStorage.setItem("widgetdata", widget_string_1);
            return mock_widgets_1.WIDGETS;
        }
    };
    DadWidgetConfigsService = __decorate([
        core_1.Injectable()
    ], DadWidgetConfigsService);
    return DadWidgetConfigsService;
}());
exports.DadWidgetConfigsService = DadWidgetConfigsService;
var DadTableConfigsService = (function () {
    function DadTableConfigsService() {
    }
    DadTableConfigsService.prototype.clearLocalCopy = function () {
        localStorage.removeItem("tabledata");
    };
    DadTableConfigsService.prototype.save = function (tables) {
        var tables_string = JSON.stringify(tables);
        localStorage.setItem("tabledata", tables_string);
    };
    DadTableConfigsService.prototype.getTableConfigs = function () {
        var tables_string = localStorage.getItem("tabledata");
        if (tables_string != null) {
            var table_obj = JSON.parse(tables_string);
            var DATA = table_obj;
            return DATA;
        }
        else {
            var tables_string_1 = JSON.stringify(mock_tables_1.TABLES);
            localStorage.setItem("tabledata", tables_string_1);
            return mock_tables_1.TABLES;
        }
    };
    DadTableConfigsService = __decorate([
        core_1.Injectable()
    ], DadTableConfigsService);
    return DadTableConfigsService;
}());
exports.DadTableConfigsService = DadTableConfigsService;