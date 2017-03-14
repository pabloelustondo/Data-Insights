import { DADPage } from './app.po';
import {browser} from "protractor";
import { DadChart, DadChartComponent } from "../src/app/dad/chart.component";
import { DadWidget, DadWidgetComponent } from "../src/app/dad/widget.component";
import { WIDGETS } from "../src/app/dad/sample.widgets";
import { PAGES } from "../src/app/dad/sample.page";
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

describe('DAD', () => {
  it('should have right number of widgets on the page', () => {
    let numberOfWidgetsInConfig = PAGES[0].widgetids;
    let numberOfWidgetsInPage = DADPage.getWidgetsOnThePage();
    expect(numberOfWidgetsInConfig.length).toBe(numberOfWidgetsInPage);
  });
});

/*
describe('DAD', () => {
  let dadChart;
  beforeEach(() => {
    dadChart = new DadChart();
    browser.get('http://localhost:4200/#/dad/page/batstats');
  });

  it('should find the chart on the main page', () => {
    expect(dadChartdtype.isPresent()).toBeTruthy();
  })
});
*/