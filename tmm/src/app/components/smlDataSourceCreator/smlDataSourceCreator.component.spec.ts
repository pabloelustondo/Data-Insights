import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { smlDataSourceCreator } from './smlDataSourceCreator.component';

describe('selDataSetsComponent', () => {
  let component: smlDataSourceCreator;
  let fixture: ComponentFixture<smlDataSourceCreator>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ smlDataSourceCreator ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(smlDataSourceCreator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
