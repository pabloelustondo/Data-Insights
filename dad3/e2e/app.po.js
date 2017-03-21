"use strict";
var protractor_1 = require('protractor');
var DADPage = (function () {
    function DADPage() {
    }
    DADPage.getWidgetsOnThePage = function () {
        return protractor_1.element.all(protractor_1.by.css('dadWidget'));
    };
    DADPage.getChartsOnThePage = function () {
        return protractor_1.element.all(protractor_1.by.css('dadChart'));
    };
    return DADPage;
}());
exports.DADPage = DADPage;
