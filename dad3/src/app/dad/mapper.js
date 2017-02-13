"use strict";
var transformer_1 = require("./transformer");
var ChartData = (function () {
    function ChartData() {
        this.Dimension = [];
        this.Metric = [];
    }
    return ChartData;
}());
exports.ChartData = ChartData;
var Mapper = (function () {
    function Mapper() {
    }
    Mapper.prototype.map = function (config, data) {
        var chartData = new ChartData();
        var dataForChart;
        var index = 0;
        if (config.type !== 'bar' && config.type !== 'spline') {
            data.forEach(function (e) {
                //need to review this idea.. works for now b==metric a=dimension
                if (!config.a && !config.b) {
                    chartData.Metric.push("#" + index);
                    chartData.Dimension["#" + index] = e;
                }
                if (config.a && config.b) {
                    chartData.Metric.push(e[config.a]);
                    chartData.Dimension[e[config.a]] = e[config.b];
                }
                index++;
            });
            dataForChart = {
                json: [chartData.Dimension],
                keys: {
                    value: chartData.Metric
                },
                selection: {
                    enabled: true
                },
                type: config.type
            };
        }
        else {
            var configa_1;
            var configb_1;
            if (!config.a && !config.b) {
                configa_1 = "a";
                configb_1 = "b";
                chartData.Metric.push(configa_1);
                chartData.Dimension.push(configb_1);
                data.forEach(function (e) {
                    chartData.Dimension.push(e);
                    chartData.Metric.push(e);
                });
            }
            else {
                configa_1 = config.a;
                configb_1 = config.b;
                chartData.Metric.push(configa_1);
                chartData.Dimension.push(configb_1);
                data.forEach(function (e) {
                    chartData.Dimension.push(e[configb_1]);
                    chartData.Metric.push(e[configa_1]);
                });
            }
            dataForChart = {
                x: config.b,
                columns: [chartData.Dimension, chartData.Metric],
                type: config.type
            };
        }
        var transformer = new transformer_1.DadTransformer();
        return transformer.transform(config, dataForChart);
    };
    return Mapper;
}());
exports.Mapper = Mapper;
