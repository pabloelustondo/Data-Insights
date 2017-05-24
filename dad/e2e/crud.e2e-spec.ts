import { CrudPage } from './crud.po';
//protractor dependencies
import {browser, Ptor, wrapDriver} from "protractor";
import { protractor, element, by } from 'protractor';
import { DadCrudComponent } from '../src/app/dad/crud.component';
import webdriver = require("selenium-webdriver");
import {Action} from "rxjs/scheduler/Action";

let sleep = function(){browser.sleep(1000)};

describe('Crud Component', function() {
  it('Should make sure that the file is loaded', () => {
    expect(true).toBe(true);
  });

  it("Should navigate to the right URL", (done) => {
    browser.get('http://localhost:5000');
    console.log("I just want to make sure this test passes so, I know that Protractor is able to start the browser");
    done();
  });
});

describe('Crud Elements', () => {

  it('Should see if the Add Option button is there', () => {
    browser.get('http://localhost:5000');
    expect(element(by.id('selection')).getText()).toEqual('Add Option');
    browser.sleep(2000);
  });

  it('Should choose the Add Option', () => {
    browser.get('http://localhost:5000');
    let optionNum = 1;
    if(optionNum){
      let options = element.all(by.tagName('option')).then(function(options) {
        options[optionNum].click();
      });
      expect(element(by.id('selection')).getText()).toEqual('Add Option');
      browser.sleep(2000);
    }
  });

  it('Should fill the boxes and create', () => {
    let optionName = element(by.id('optionName'));
    let optionAttribute = element(by.id('optionAttribute'));
    let addButton = element(by.id('addNewOption'));
    let created = element(by.id('created'));
    optionName.sendKeys('Doga');
    browser.sleep(2000);
    optionAttribute.sendKeys('is awesome');
    browser.sleep(2000);
    addButton.click();
    expect(created.getText()).toEqual('Doga');
    browser.sleep(2000);
  });

  it('Should change the values in the boxes and update', () => {
    let updatedOptionName = element(by.id('updatedOptionName'));
    let updatedOptionAttribute = element(by.id('updatedOptionAttribute'));
    let updateButton = element(by.id('apply'));
    let created = element(by.id('created'));
    let editButton = element(by.id('edit'));

    editButton.click();
    updatedOptionName.sendKeys('Pablo');
    browser.sleep(2000);
    updatedOptionAttribute.sendKeys('loves you.');
    browser.sleep(2000);
    updateButton.click();
    expect(created.getText()).toEqual('Pablo');
    browser.sleep(2000);
  });

  it('Should be able to delete the selected option', () => {
    let editButton = element(by.id('edit'));
    let deleteButton = element(by.id('delete'));

    editButton.click();
    browser.sleep(2000);
    deleteButton.click();
    browser.sleep(2000);
  });

  it('Should be able to cancel the edit', () => {
    let editButton = element(by.id('edit'));
    let cancelButton = element(by.id('cancel'));

    editButton.click();
    browser.sleep(2000);
    cancelButton.click();
    browser.sleep(2000);
  });
});



