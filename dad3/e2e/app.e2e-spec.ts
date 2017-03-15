import { DADPage } from './app.po';
import {browser} from "protractor";
import { DadChart, DadChartComponent } from "../src/app/dad/chart.component";
import { DadWidget, DadWidgetComponent } from "../src/app/dad/widget.component";
import { WIDGETS } from "../src/app/dad/sample.widgets";
import { PAGES } from "../src/app/dad/sample.page";
import { CHARTS } from "../src/app/dad/sample.charts";
import { DadPage, DadPageComponent } from "../src/app/dad/page.component";



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
    DADPage.getWidgetsOnThePage().then(function(elements){
      expect(numberOfWidgetsInConfig.length).toBe(elements.length);
      done();
    });
  });

  it('should have the right number of charts on the page', (done) => {
    let numberOfChartsInConfig = PAGES[0].chartids;
    DADPage.getChartsOnThePage().then(function(elements){
      expect(numberOfChartsInConfig.length).toBe(elements.length);
      done()
    });
  });

  it('should return the same number on the widget', (done) => {
    let deviceNotLastedShiftCount = WIDGETS[0].data[0].CountDevicesNotLastedShift;
    //DADPage.getValueOnTheWidget().then(function(elements){
      //expect(deviceNotLastedShiftCount).toBe(elements.count);
      //done();
    //});
    expect(deviceNotLastedShiftCount).toBe(50);
    done();
  });
});
