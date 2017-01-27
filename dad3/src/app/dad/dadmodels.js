"use strict";
var DadElement = (function () {
    function DadElement() {
    }
    return DadElement;
}());
exports.DadElement = DadElement;
var DadDateRange = (function () {
    function DadDateRange() {
    }
    return DadDateRange;
}());
exports.DadDateRange = DadDateRange;
(function (DadParameterType) {
    DadParameterType[DadParameterType["Number"] = 0] = "Number";
    DadParameterType[DadParameterType["String"] = 1] = "String";
    DadParameterType[DadParameterType["Date"] = 2] = "Date";
    DadParameterType[DadParameterType["Time"] = 3] = "Time";
    DadParameterType[DadParameterType["DateTime"] = 4] = "DateTime";
    DadParameterType[DadParameterType["Duration"] = 5] = "Duration";
})(exports.DadParameterType || (exports.DadParameterType = {}));
var DadParameterType = exports.DadParameterType;
(function (DadMetricType) {
    DadMetricType[DadMetricType["Number"] = 0] = "Number";
    DadMetricType[DadMetricType["String"] = 1] = "String";
    DadMetricType[DadMetricType["Date"] = 2] = "Date";
    DadMetricType[DadMetricType["Time"] = 3] = "Time";
})(exports.DadMetricType || (exports.DadMetricType = {}));
var DadMetricType = exports.DadMetricType;
(function (DadDimensionType) {
    DadDimensionType[DadDimensionType["Number"] = 0] = "Number";
    DadDimensionType[DadDimensionType["String"] = 1] = "String";
    DadDimensionType[DadDimensionType["MiniChart"] = 2] = "MiniChart";
})(exports.DadDimensionType || (exports.DadDimensionType = {}));
var DadDimensionType = exports.DadDimensionType;
