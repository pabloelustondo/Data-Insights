import  {DadConfigService} from '../DadConfig.service';
import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import {HttpModule, Http, Response, ResponseOptions, BaseRequestOptions, XHRBackend} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {config} from "../appconfig";
import {CHARTS} from "../sample.charts";

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

            dadConfig.clearLocalCopy("elementdata");
            let ls = localStorage.getItem("elementdata");
            expect(ls).toBe(null);
        }));

    it('should save',
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

            dadConfig.save(CHARTS);
            let ls = localStorage.getItem("elementdata");
            let parsed = JSON.parse(ls);
            expect(parsed.length).toBe(CHARTS.length);
        }));
});





