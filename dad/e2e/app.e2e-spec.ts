import { DADPage } from './app.po';
import {browser} from "protractor";
import {DadChart, DadChartComponent } from "../src/app/dad/chart.component";
import { DadWidget, DadWidgetComponent } from "../src/app/dad/widget.component";
import { CHARTS } from "../src/app/dad/sample.charts";
import { WIDGETS } from "../src/app/dad/sample.widgets";
import { PAGES } from "../src/app/dad/sample.page";
import { DadPage, DadPageComponent } from "../src/app/dad/page.component";
import { protractor, element, by } from 'protractor';

let sleep = function(){browser.sleep(3000)};

describe('SOTI DATA ANALYTICS LOGIN PAGE', () => {

  beforeEach(() => {
    browser.get('http://localhost:3003');
  });

  it('should see if the file is loaded and used', () => {
    expect(true).toBe(true);
  });

  sleep();

  it("title is SOTI Insight", function() {
    let title = element(by.id('title'));
    expect(title.getText()).toBe('SOTI Insight');
  });

  sleep();

  it("it should have 1 login button", function(done) {
    element.all(by.tagName('button')).then(function (button) {
      expect(button.length).toBe(1);
      done();
    });
  });
});

describe('should login to the page', () => {

  beforeEach(() => {
    browser.get('http://localhost:3003');
  });

  it("should put the user's tenant ID('test') and hit the login button", function() {
    let tenantID = element(by.id('domainid'));
    let button = element(by.className('btn btn-default'));
    tenantID.sendKeys('test');
    browser.sleep(2000);
    button.click();
    browser.ignoreSynchronization = true;
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3004/oauth/authorize?response_type=code&client_id=undefined&state=test');
  });

  it("should put the user name('Doga') and hit the login button", function () {
   //password can be empty
    browser.get('http://localhost:3004/oauth/authorize?response_type=code&client_id=undefined&state=test');
    let userName = element(by.id('username'));
    let Password = element(by.id('password'));
    let logBut = element(by.js ("return document.getElementsByName('login');"));
    userName.sendKeys('Doga');
    browser.sleep(2000);
    Password.sendKeys('123456');
    browser.sleep(2000);
    logBut.click();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toEqual("http://localhost:3003/#/home");
  });
/*
  it("should come to the DAD", function (){
    expect(browser.getCurrentUrl).toEqual('http://localhost:4200/#/dad/page/batstats');
    browser.sleep(2000);
  });
*/

});




/*
  it("title is SOTI Data Analytics Dashboard", function() {
    browser.get('http://localhost:4200/#/dad/page/batstats');
    expect(browser.getTitle()).toEqual('SOTI Data Analytics Dashboard');
  });

  it("it should have 4 widgets", function(done) {
    browser.get('http://localhost:4200/#/dad/page/batstats');
    element.all(by.css('dadWidget')).then(function (elements) {
      expect(elements.length).toBe(2);
      done();
    });
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
    });
  });
});
*/

      /*elements[0].click().then(function() {
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('/table/1/chartbardrill0/table1chartbardrill0metric');
        sleep();
        done();
      });*/




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

