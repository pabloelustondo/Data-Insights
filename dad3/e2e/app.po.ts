import { browser, element, by } from 'protractor';
import { DadWidget, DadWidgetComponent } from '../src/app/dad/widget.component';
export class DADPage {

  static getWidgetsOnThePage() {
    return element.all(by.css('dadWidget'))
  }

  static getChartsOnThePage() {
    return element.all(by.css('dadChart'))
  }

  static getValueOnTheWidget() {
    let widgetID =  element(by.id('widget1'));
    widgetID.data[0][widget.metrics[0].DataSource]
  }

}
