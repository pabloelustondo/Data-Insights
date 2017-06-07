import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { smlTenantMetadataEditor } from './smlTenantMetadataEditor.component';

describe('smlTenantMetadataEditor', () => {
  let component: smlTenantMetadataEditor;
  let fixture: ComponentFixture<UserInput>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ smlTenantMetadataEditor ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
