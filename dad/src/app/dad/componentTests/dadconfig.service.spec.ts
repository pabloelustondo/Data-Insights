import  {DadConfigService} from '../DadConfig.service';
import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import {HttpModule, Http, Response, ResponseOptions, BaseRequestOptions, XHRBackend} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {config} from "../appconfig";

describe('DadConfigComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        DadConfigService,
        MockBackend,
        {provide: XHRBackend, useClass: MockBackend}
      ]
    })
  });

  it('should create the service',
      inject([DadConfigService, MockBackend], (dadConfig, mockBackend) => {

        const mockResponse = {
          data: [
            {tellMe: 'Service is created'},
          ]
        };

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        dadConfig.getConfig("Doga").then((config) => {
          expect(config).toBe(null);
        });
      }));

    it('should get the URL and the headers',
        async(inject([DadConfigService, MockBackend], (dadConfig, mockBackend) => {

            const mockResponse = {
                data: [
                    {tellMe: 'Service is created'},
                ]
            };

            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })));
            });

            dadConfig.getUserConfigurationFromDdb().then((config) => {
                expect(config).toBe(dadConfig.url);
            });

        })) );

    it('should clear the local storage',
        inject([DadConfigService, MockBackend], (dadConfig, mockBackend) => {

            const mockResponse = {
                data: [
                    {tellMe: 'Service is created'},
                ]
            };

            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })));
            });

            dadConfig.clearLocalCopy("chartdata");
            let ls = localStorage.getItem("chartdata");
            expect(ls).toBe(null);
        }));
});





