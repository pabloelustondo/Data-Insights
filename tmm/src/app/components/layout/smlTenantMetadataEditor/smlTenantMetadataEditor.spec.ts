import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { smlTenantMetadataEditor } from './smlTenantMetadataEditor.component';
import { TmmConfigService  } from './tmmconfig.service';
import {Http, HttpModule} from '@angular/http';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('The SML Metadata Editor', () => {
  let component: smlTenantMetadataEditor;
  let fixture: ComponentFixture<smlTenantMetadataEditor>;
  let tmmConfigService: TmmConfigService;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ HttpModule ],
        declarations: [ smlTenantMetadataEditor ],
        providers: [ TmmConfigService ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA ]
      }).compileComponents();

      this.fixture = TestBed.createComponent(smlTenantMetadataEditor);
      this.component = this.fixture.componentInstance;

      this.tmmConfigService = this.fixture.debugElement.injector.get(TmmConfigService);

  }));

   it('should be created', () => {
    expect(this.component).toBeTruthy();
   });
   it('should contain a tmmConfig object', () => {
     expect(this.tmmConfigService).toBeTruthy();
   });
   it('should contain a metadata object', () => {
     expect(this.component.tenantMetadata).toBeTruthy();
   });
   it('should assign the returned getTenantMetadata response to metadata object', () => {
     let dataSet = this.component.tenantMetadata;
     this.tmmConfigService.getTenantMetadata('testtenant-testuser').then((data) => {
       expect(data).toBe(dataSet);
     });
   });
});
