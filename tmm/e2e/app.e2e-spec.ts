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
    browser.sleep(2000);
  });

  it('Should check if the "Delete Selected" button is there', () => {
   // browser.get('http://localhost:8028');
    expect(element(by.id('deleteDataSet')).getText()).toEqual('Delete Selected');
    browser.sleep(2000);
    });

  it('Should check if the "Tenant Name:" is there', () => {
   // browser.get('http://localhost:8028');
    expect(element(by.id('tenantname')).getText()).toEqual('Tenant Name:');
    browser.sleep(2000);
  });

  it('Should check if the "Tenant ID:" is there', () => {
   // browser.get('http://localhost:8028');
    expect(element(by.id('tenantid')).getText()).toEqual('Tenant ID:');
    browser.sleep(2000);
  });
});
