import { browser, element, by } from 'protractor';

export class DADPage {

  static getWidgetsOnThePage() {
    return element(by.css('dadWidget'))
  }

}
