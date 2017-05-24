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




