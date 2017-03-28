/**
 * Created by dister on 2/10/2017.
 */
//For sorting in typescript we can easily use .sort()
"use strict";
var _ = require("lodash");
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
            var metric = dataForChart.columns[0].slice(0, config.transformation.top + 1);
            var dimension = dataForChart.columns[1].slice(0, config.transformation.top + 1);
            newDataForChart.columns = [metric, dimension];
        }
        if (config.transformation.sort) {
            newDataForChart.x = dataForChart.x;
            newDataForChart.type = dataForChart.type;
            newDataForChart.columns = [[dataForChart.columns[0][0]], [dataForChart.columns[1][0]]];
            var oneColumn = []; //let put both columns in same place
            for (var i = 1; i < dataForChart.columns[0].length; i++) {
                oneColumn.push({ metric: dataForChart.columns[0][i], dimension: dataForChart.columns[1][i] });
            }
            var sortedOneColumn = _.orderBy(oneColumn, ['dimension'], ['desc']);
            for (var i = 1; i < sortedOneColumn.length + 1; i++) {
                newDataForChart.columns[0].push(sortedOneColumn[i - 1].metric);
                newDataForChart.columns[1].push(sortedOneColumn[i - 1].dimension);
            }
        }
        return newDataForChart;
    };
    DadTransformer.prototype.transformAll = function (config, dataForChart) {
        if (!config.transformations)
            return dataForChart;
        for (var _i = 0, _a = config.transformations; _i < _a.length; _i++) {
            var transformation = _a[_i];
            config.transformation = transformation;
            dataForChart = this.transform(config, dataForChart);
        }
        return dataForChart;
    };
    return DadTransformer;
}());
exports.DadTransformer = DadTransformer;
