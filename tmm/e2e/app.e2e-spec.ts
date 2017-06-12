import { TmmPage } from './app.po';
import {browser, Ptor} from "protractor";
import { protractor, element, by } from 'protractor';
import webdriver = require("selenium-webdriver");
import { smlTenantMetadataEditor } from '../src/app/components/layout/smlTenantMetadataEditor/smlTenantMetadataEditor.component';

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
    browser.sleep(1000);
  });

  it('Should check if the "Delete Selected" button is there', () => {
    expect(element(by.id('deleteDataSet')).getText()).toEqual('Delete Selected');
    browser.sleep(1000);
    });

  it('Should check if the "Tenant Name:" is there', () => {
    expect(element(by.id('tenantname')).getText()).toEqual('Tenant Name:');
    browser.sleep(1000);
  });

  it('Should check if the "Tenant ID:" is there', () => {
    expect(element(by.id('tenantid')).getText()).toEqual('Tenant ID:');
    browser.sleep(1000);
  });

  it("List's header should be equal to 'List of Your Data Sets Definition' ", () => {
    expect(element(by.id('listheader')).getText()).toEqual('List of Your Data Sets Definition');
    browser.sleep(1000);
  });

  it("Editor's header should be equal to 'Editor' ", () => {
    expect(element(by.id('editorheader')).getText()).toEqual('Editor');
    browser.sleep(1000);
  });

  it('Should be able to write in the text area', () => {
    element(by.className('jsoneditor-text')).click();
    element(by.className('jsoneditor-text')).clear();
    element(by.className('jsoneditor-text')).sendKeys(
      '{id: 10-22-1,  name: Test Data Protractor, from: [Doga Ister], persist: true, filter: [/&AS/], merge: [09-21-31$F], projections: [""],metadata: [""]}'
    );
    browser.sleep(1000);
  });

});

//jsoneditor-text
//jsoneditor-modes jsoneditor-separator
/*
{
 "id": "10-22-1",
 "name": "Test Data Set 01",
 "from": [
 ""
 ],
 "persist": true,
 "filter": [
 "/&AS/"
 ],
 "merge": [
 "09-21-31$F"
 ],
 "projections": [
 ""
 ],
 "metadata": [
 ""
 ]
 }
* */
