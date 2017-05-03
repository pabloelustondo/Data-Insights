import  {DadConfigService} from '../DadConfig.service';
import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import {HttpModule, Http, Response, ResponseOptions, BaseRequestOptions, XHRBackend} from '@angular/http';
import 'rxjs/add/operator/toPromise';

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
});





