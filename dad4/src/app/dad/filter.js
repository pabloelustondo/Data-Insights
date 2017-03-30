"use strict";
var search_1 = require('./search');
var _ = require("lodash");
var DadFilter = (function () {
    function DadFilter() {
    }
    DadFilter.prototype.filter = function (element, data) {
        if (!element.filter) {
            return data;
        }
        var filteredData = _.filter(data, _.matches(element.filter));
        var search = new search_1.DadSearch();
        return search.search(element, filteredData);
    };
    return DadFilter;
}());
exports.DadFilter = DadFilter;
