import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { smlTenantMetadataEditor } from './components/layout/smlTenantMetadataEditor/smlTenantMetadataEditor.component';
import { AppComponent } from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { HttpModule } from "@angular/http";

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      declarations: [AppComponent, smlTenantMetadataEditor ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    this.fixture = TestBed.createComponent(AppComponent);
    this.app = this.fixture.debugElement.componentInstance;
  });

  it('should create the app', async(() => {
    expect(this.app).toBeTruthy();
  }));
});
