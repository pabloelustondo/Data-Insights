import { browser, element, by } from 'protractor';
import { DadCrudComponent } from '../src/app/crud.component';

export class CrudPage{

  static getDropdownOnThePage() {
    return element.all(by.css('combobox'))
  }
}
