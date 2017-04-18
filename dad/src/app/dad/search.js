"use strict";
var DadSearch = (function () {
    function DadSearch() {
    }
    DadSearch.prototype.search = function (element, data) {
        if (!element.search)
            return data;
        var result = [];
        data.forEach(function (d) {
            var s = JSON.stringify(d);
            if (s.indexOf(element.search) > -1)
                result.push(d);
        });
        return result;
    };
    DadSearch.prototype.readExpression = function (element, data) {
        if (!element.newFilter.readExpression)
            return data;
        var result = [];
        data.forEach(function (d) {
            var ss = element.newFilter.readExpression;
            Object.keys(d).forEach(function (key) {
                var value = d[key];
                if (typeof value == "number") {
                    ss = ss.replace(key, value);
                }
                if (typeof value == "string") {
                    ss = ss.replace(key, "\'" + value + "\'");
                }
            });
            if (eval(ss))
                result.push(d);
        });
        return result;
    };
    DadSearch.prototype.alertExpression = function (element, data) {
        if (!element.alert.expression)
            return false;
        var ss = element.alert.expression;
        var ds = data;
        return eval(ss);
    };
    ;
    return DadSearch;
}());
exports.DadSearch = DadSearch;
