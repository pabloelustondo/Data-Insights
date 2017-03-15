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
    return DadSearch;
}());
exports.DadSearch = DadSearch;
