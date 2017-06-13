import { TmmPage } from './app.po';
import {browser, Ptor} from "protractor";
import { protractor, element, by } from 'protractor';
import webdriver = require("selenium-webdriver");
import { smlTenantMetadataEditor } from '../src/app/components/layout/smlTenantMetadataEditor/smlTenantMetadataEditor.component';
import { smlDataSourceEditor } from '../src/app/smlDataSourceEditor/smlDataSourceEditor';

describe('TMM Module', () => {
  it('Should make sure that the file is loaded', () => {
    expect(true).toBe(true);
  });

  beforeEach(() => {});

  it("Should navigate to the right URL", (done) => {
    browser.get('http://localhost:8028');
    console.log("I just want to make sure this test passes so, I know that Protractor is able to start the browser");
    done();
  });
});

describe('TMM UI Elements', () => {

  it('Should check if the "Click to add a Data Set" button is there', () => {
    browser.get('http://localhost:8028');
    expect(element(by.id('addDataSet')).getText()).toEqual('Click to add a Data set');
    browser.sleep(500);
  });

  it('Should check if the "Delete Selected" button is there', () => {
    expect(element(by.id('deleteDataSet')).getText()).toEqual('Delete Selected');
    browser.sleep(500);
    });

  it('Should check if the "Tenant Name:" is there', () => {
    expect(element(by.id('tenantname')).getText()).toEqual('Tenant Name:');
    browser.sleep(500);
  });

  it('Should check if the "Tenant ID:" is there', () => {
    expect(element(by.id('tenantid')).getText()).toEqual('Tenant ID:');
    browser.sleep(500);
  });

  it("List's header should be equal to 'List of Your Data Sets Definition' ", () => {
    expect(element(by.id('listheader')).getText()).toEqual('List of Your Data Sets Definition');
    browser.sleep(500);
  });

  it("Editor's header should be equal to 'Editor' ", () => {
    expect(element(by.id('editorheader')).getText()).toEqual('Editor');
    browser.sleep(500);
  });

  it("Editor's save button is on the page ", () => {
    expect(element(by.id('save')).getText()).toEqual('Save');
    browser.sleep(500);
  });


  it('Should be able to write in the text area', () => {
    element(by.id('addDataSet')).click();
    element(by.className('jsoneditor-text')).click();
    element(by.className('jsoneditor-text')).clear();
    element(by.className('jsoneditor-text')).sendKeys(
      '{"id": "Test Protractor",  "name": "Test Data Protractor", "from": ["Doga Ister"], "persist": true, "filter": ["/&AS/"], "merge": ["09-21-31$F"], "projections": [""], "metadata": [""]}'
    );
    browser.sleep(1000);
    element(by.id('save')).click();
    browser.sleep(1000);
    expect(element(by.id('Test Protractor')).getText()).toEqual('Test Data Protractor');
    browser.sleep(1000);

  });

});
