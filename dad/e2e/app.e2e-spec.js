"use strict";
var app_po_1 = require('./app.po');
var protractor_1 = require("protractor");
var sample_charts_1 = require("../src/app/dad/sample.charts");
var sample_widgets_1 = require("../src/app/dad/sample.widgets");
var sample_page_1 = require("../src/app/dad/sample.page");
var protractor_2 = require('protractor');
var sleep = function () { protractor_1.browser.sleep(1000); };
describe('SOTI DATA ANALYTICS DASHBOARD', function () {
    it('should see if the file is loaded and used', function () {
        expect(true).toBe(true);
    });
    it("title is SOTI Data Analytics Dashboard", function () {
        protractor_1.browser.get('http://localhost:4200/#/dad/page/batstats');
        expect(protractor_1.browser.getTitle()).toEqual('SOTI Data Analytics Dashboard');
    });
    it("it should have 4 widgets", function (done) {
        protractor_1.browser.get('http://localhost:4200/#/dad/page/batstats');
        protractor_2.element.all(protractor_2.by.css('dadWidget')).then(function (elements) {
            expect(elements.length).toBe(4);
            done();
        });
    });
});
describe('DAD elements', function () {
    it('should have the right number of widgets on the page', function (done) {
        var numberOfWidgetsInConfig = sample_page_1.PAGES[0].widgetids;
        app_po_1.DADPage.getWidgetsOnThePage().then(function (elements) {
            expect(numberOfWidgetsInConfig.length).toBe(elements.length);
            console.log("There is/are" + " " + elements.length + " " + "widget(s) on the page.");
            done();
        });
    });
    it('should have the right number of charts on the page', function (done) {
        var numberOfChartsInConfig = sample_page_1.PAGES[0].chartids;
        app_po_1.DADPage.getChartsOnThePage().then(function (elements) {
            expect(numberOfChartsInConfig.length).toBe(elements.length);
            console.log("There is/are" + " " + elements.length + " " + "chart(s) on the first page");
            sleep();
            done();
        });
    });
    it('should return the same name on the first widget', function (done) {
        var widget = sample_widgets_1.WIDGETS[0];
        var id = widget.id + '_0_name';
        protractor_2.element.all(protractor_2.by.id(id)).then(function (elements) {
            expect(elements[0].getText()).toBe(widget.metrics[0].Name);
            console.log("First widget's title should be" + " " + widget.metrics[0].Name);
            sleep();
            done();
        });
    });
    it('should return the same value on the first widget', function (done) {
        var widget = sample_widgets_1.WIDGETS[0];
        var id = widget.id + '_0_value';
        var value = widget.data[0].CountDevicesNotLastedShift;
        var string_value = "" + value + "";
        protractor_2.element.all(protractor_2.by.id(id)).then(function (elements) {
            expect(elements[0].getText()).toBe(string_value);
            console.log("First widget's value is" + " " + string_value);
            sleep();
            done();
        });
    });
    it('should go to the charts page by clicking the number', function (done) {
        var widget = sample_widgets_1.WIDGETS[0];
        var id = widget.id + '_0_value';
        protractor_2.element.all(protractor_2.by.id(id)).then(function (elements) {
            elements[0].click().then(function () {
                protractor_1.browser.sleep(1000);
                expect(protractor_1.browser.getCurrentUrl()).toContain('/drillcharts/chartbardrill');
                console.log("My test can click the first widget's value and drill down to the charts and URL will be:" + protractor_1.browser.baseUrl + "/drillcharts/chartbardrill");
                sleep();
                done();
            });
        });
    });
});
describe('Drill Charts', function () {
    it('should have the right number of charts on the page', function (done) {
        var chart = sample_charts_1.CHARTS[3];
        app_po_1.DADPage.getChartsOnThePage().then(function (elements) {
            expect(chart.reductions.length).toBe(elements.length);
            console.log("There is/are" + " " + elements.length + " " + "chart(s) on the second page");
            sleep();
            done();
        });
    });
    it('should return the same dimension on the first chart', function (done) {
        var chart = sample_charts_1.CHARTS[3];
        var id = chart.id + '0' + '_dimension';
        var chartRedDim = chart.reductions[0].dimension.name;
        protractor_2.element.all(protractor_2.by.id(id)).then(function (elements) {
            var elem = elements[0].getText();
            expect(elem).toBe(chartRedDim);
            console.log("First chart's dimension should be" + " " + chartRedDim);
            sleep();
            done();
        });
    });
    it('should change the dimension', function (done) {
        var chart = sample_charts_1.CHARTS[3];
        var id = chart.id + '0' + '_dimension';
        var chartRedDim = chart.reductions[1].dimension.name;
        protractor_2.element.all(protractor_2.by.id(id)).then(function (elements) {
            elements[1].click().then(function () {
                var elem = elements[1].getText();
                expect(elem).toBe(chartRedDim);
                console.log("First chart's dimension should be" + " " + chartRedDim);
                sleep();
                done();
            });
        });
    });
    it('should go to the tables by clicking the chart', function (done) {
        protractor_2.element.all(protractor_2.by.css('.c3-event-rect-3')).then(function (elements) {
            elements[0].then(function (element) {
                element.click().then(function () {
                    protractor_1.browser.sleep(1000);
                    expect(protractor_1.browser.getCurrentUrl()).toContain('/table/1/chartbardrill0/table1chartbardrill0metric');
                    sleep();
                    done();
                });
            });
            /*elements[0].click().then(function() {
              browser.sleep(1000);
              expect(browser.getCurrentUrl()).toContain('/table/1/chartbardrill0/table1chartbardrill0metric');
              sleep();
              done();
            });*/
        });
    });
});
/*
describe('Drill Tables', () => {
  it('should have the right number of widgets on the page', (done) => {
    let numberOfWidgetsInConfig = PAGES[0].widgetids;
    DADPage.getWidgetsOnThePage().then(function (elements) {
      expect(numberOfWidgetsInConfig.length).toBe(elements.length);
      console.log("There is/are" + " " + elements.length + " " + "widget(s) on the page.");
      done();
    });
  });
});
*/
