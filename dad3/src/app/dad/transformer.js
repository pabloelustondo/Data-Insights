/**
 * Created by dister on 2/10/2017.
 */
//For sorting in typescript we can easily use .sort()
"use strict";
var ChartData = (function () {
    function ChartData() {
        this.Dimension = [];
        this.Metric = [];
    }
    return ChartData;
}());
exports.ChartData = ChartData;
var DadTransformer = (function () {
    function DadTransformer() {
    }
    DadTransformer.prototype.transform = function (config, dataForChart) {
        if (!config.transformation)
            return dataForChart;
        /*current data shape
        dataForChart = {
            x: config.b,
            columns: [chartData.Dimension, chartData.Metric],
            type:  config.type
        } */
        var newDataForChart = {};
        if (config.transformation.top) {
            newDataForChart.x = dataForChart.x;
            newDataForChart.type = dataForChart.type;
            var metric = dataForChart.columns[0].slice(0, config.transformation.top);
            var dimension = dataForChart.columns[0].slice(0, config.transformation.top);
            newDataForChart.columns = [metric, dimension];
        }
        return newDataForChart;
    };
    return DadTransformer;
}());
exports.DadTransformer = DadTransformer;
