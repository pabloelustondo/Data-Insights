import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSMLDatasourceComponent } from './smlDataSourceEditor';

describe('EditorSMLDatasourceComponent', () => {
  let component: EditorSMLDatasourceComponent;
  let fixture: ComponentFixture<EditorSMLDatasourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSMLDatasourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSMLDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
