import { DADPage } from './app.po';
import {browser} from "protractor";
import { DadChart, DadChartComponent } from "../src/app/dad/chart.component";
import { DadWidget, DadWidgetComponent } from "../src/app/dad/widget.component";
import { CHARTS } from "../src/app/dad/sample.charts";
import { WIDGETS } from "../src/app/dad/sample.widgets";
import { PAGES } from "../src/app/dad/sample.page";
import { DadPage, DadPageComponent } from "../src/app/dad/page.component";
import { protractor, element, by } from 'protractor';



describe('SOTI DATA ANALYTICS DASHBOARD', () => {
  it('should see if the file is loaded and used', () => {
    expect(true).toBe(true);
  });

  it('first page URL should be http://localhost:4200/#/dad/page/batstats', () => {
    let url = 'http://localhost:4200/#/dad/page/batstats';
    browser.get(url);
    expect(browser.driver.getCurrentUrl()).toEqual(url);
  });
});

describe('DAD elements', () => {
  it('should have the right number of widgets on the page', (done) => {
    let numberOfWidgetsInConfig = PAGES[0].widgetids;
    DADPage.getWidgetsOnThePage().then(function (elements) {
      expect(numberOfWidgetsInConfig.length).toBe(elements.length);
      done();
    });
  });

  it('should have the right number of charts on the page', (done) => {
    let numberOfChartsInConfig = PAGES[0].chartids;
    DADPage.getChartsOnThePage().then(function (elements) {
      expect(numberOfChartsInConfig.length).toBe(elements.length);
      done()
    });
  });

  it('should return the same name on the first widget', (done) => {
    let widget = WIDGETS[0];
    let id = widget.id + '_0_name';
    element.all(by.id(id)).then(function (elements) {
      expect(elements[0].getText()).toBe(widget.metrics[0].Name);
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
      done();
    });
  });

  it('should go to the charts page by clicking the number', (done) => {
    let widget = WIDGETS[0];
    let id = widget.id + '_0_value';
    browser.sleep(1000);
    element.all(by.id(id)).then(function (elements) {
      elements[0].click().then(function() {
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('/drillcharts/chartbardrill');
        done();
      });
    });
  });
});

describe('Drill Charts', () => {
  it('should have the right number of widgets on the page', (done) => {
    let chart = CHARTS[3];
    DADPage.getChartsOnThePage().then(function (elements) {
      expect(chart.reductions.length).toBe(elements.length);
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
      done();
    });
  });

});


/*
  it('should go to the tables page by clicking on the chart', (done) => {
    let chart = CHARTS[3];
    let id = chart.id + '_0_value';
    element.all(by.id(id)).then(function (elements) {
      elements[0].click().then(function() {
        expect(browser.getCurrentUrl()).toContain('/drillcharts/chartbardrill/table/1/chartbardrill0/table1chartbardrill0metric');
        done();
      });
    });
  });
*/

