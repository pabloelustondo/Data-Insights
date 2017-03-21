import { DADPage } from './app.po';
import {browser} from "protractor";
import {DadChart, DadChartComponent } from "../src/app/dad/chart.component";
import { DadWidget, DadWidgetComponent } from "../src/app/dad/widget.component";
import { CHARTS } from "../src/app/dad/sample.charts";
import { WIDGETS } from "../src/app/dad/sample.widgets";
import { PAGES } from "../src/app/dad/sample.page";
import { DadPage, DadPageComponent } from "../src/app/dad/page.component";
import { protractor, element, by } from 'protractor';

let sleep = function(){browser.sleep(1000)};

describe('SOTI DATA ANALYTICS DASHBOARD', () => {
  it('should see if the file is loaded and used', () => {
    expect(true).toBe(true);
  });
});

describe('DAD elements', () => {
  it('should have the right number of widgets on the page', (done) => {
    let numberOfWidgetsInConfig = PAGES[0].widgetids;
    DADPage.getWidgetsOnThePage().then(function (elements) {
      expect(numberOfWidgetsInConfig.length).toBe(elements.length);
      console.log("There is/are" + " " + elements.length + " " + "widget(s) on the page.");
      done();
    });
});

  it('should have the right number of charts on the page', (done) => {
    let numberOfChartsInConfig = PAGES[0].chartids;
    DADPage.getChartsOnThePage().then(function (elements) {
      expect(numberOfChartsInConfig.length).toBe(elements.length);
      console.log("There is/are" + " " + elements.length + " " + "chart(s) on the first page")
      sleep();
      done()
    });
  });

  it('should return the same name on the first widget', (done) => {
    let widget = WIDGETS[0];
    let id = widget.id + '_0_name';
    element.all(by.id(id)).then(function (elements) {
      expect(elements[0].getText()).toBe(widget.metrics[0].Name);
      console.log("First widget's title should be" + " " + widget.metrics[0].Name);
      sleep();
      done();
    });
  });

  it('should return the same value on the first widget', (done) => {
    let widget = WIDGETS[0];
    let id = widget.id + '_0_value';
    let value = widget.data[0].CountDevicesNotLastedShift;
    let string_value = "" + value + "";
    element.all(by.id(id)).then(function (elements) {
      expect(elements[0].getText()).toBe(string_value);
      console.log("First widget's value is" + " " + string_value);
      sleep();
      done();
    });
  });

  it('should go to the charts page by clicking the number', (done) => {
    let widget = WIDGETS[0];
    let id = widget.id + '_0_value';
    element.all(by.id(id)).then(function (elements) {
      elements[0].click().then(function() {
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('/drillcharts/chartbardrill');
        console.log("My test can click the first widget's value and drill down to the charts and URL will be:" + browser.baseUrl + "/drillcharts/chartbardrill");
        sleep();
        done();
      });
    });
  });
});

describe('Drill Charts', () => {
  it('should have the right number of charts on the page', (done) => {
    let chart = CHARTS[3];
    DADPage.getChartsOnThePage().then(function (elements) {
      expect(chart.reductions.length).toBe(elements.length);
      console.log("There is/are" + " " + elements.length + " " + "chart(s) on the second page")
      sleep();
      done();
    });
  });

  it('should return the same dimension on the first chart', (done) => {
    let chart = CHARTS[3];
    let id = chart.id + '0' + '_dimension';
    let chartRedDim = chart.reductions[0].dimension.name;
    element.all(by.id(id)).then(function (elements) {
      let elem = elements[0].getText();
      expect(elem).toBe(chartRedDim);
      console.log("First chart's dimension should be" + " " + chartRedDim)
      sleep();
      done();
    });
  });

  it('should change the dimension', (done) => {
    let chart = CHARTS[3];
    let id = chart.id + '0' + '_dimension';
    let chartRedDim = chart.reductions[1].dimension.name;
    element.all(by.id(id)).then(function (elements) {
      elements[1].click().then(function () {
        let elem = elements[1].getText();
        expect(elem).toBe(chartRedDim);
        console.log("First chart's dimension should be" + " " + chartRedDim);
        sleep();
        done();
      });
    });
  });

  it('should go to the tables by clicking the chart', (done) => {
    element.all(by.css('.c3-event-rect-3')).then(function (elements) {
      elements[0].then(  element => {

        element.click().then(function() {
          browser.sleep(1000);
          expect(browser.getCurrentUrl()).toContain('/table/1/chartbardrill0/table1chartbardrill0metric');
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

