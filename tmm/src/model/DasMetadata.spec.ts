/**
 * Created by pabloelustondo on 2017-04-20.
 */
import { DasMetadata } from './DasMetadata'
import { DasMetadataService } from "../app/dasmetadata.service";
import { Headers, Http, BaseRequestOptions, Response, ResponseOptions, XHRBackend } from '@angular/http';
import * as TypeMoq from "typemoq";
import { async,  getTestBed, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('DasMetadata', () => {
  let mds: DasMetadataService;
  let backend: MockBackend;

  beforeEach(async(() => { // This  code is almost exactly from angular recomendation
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        MockBackend,
        DasMetadataService, //ONLY CHANGE FROM STANDARD CODE
        {
          deps: [
            MockBackend,
            BaseRequestOptions
          ],
          provide: Http,
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ]
    });

    const testbed = getTestBed();
    backend = testbed.get(MockBackend);
    mds = testbed.get(DasMetadataService);

    function setupConnections(backend: MockBackend, options: any) {
      backend.connections.subscribe((connection: MockConnection) => {
        if (connection.request.url === 'api/forms') {
          const responseOptions = new ResponseOptions(options);
          const response = new Response(responseOptions);

          connection.mockRespond(response);
        }
      });
    }

  }));

  it('should get created and add id and name', () => {
    let m = new DasMetadata();
    m.id = "11111";
    m.tenantId = 'test';
    expect(m).toBeTruthy();
  });

  it('should give me test metadata on tenant is "test"', () => {
    mds.get(this.tenantId).then((md)=>{
      expect(md).toBeTruthy();
    })
  });


});
