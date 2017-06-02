import { browser, element, by } from 'protractor';

export class TmmPage {
  navigateTo() {
    return browser.get('/');
  }

  getTableHeaders() {
    return element.all(by.css('table h2'));
  }
}
