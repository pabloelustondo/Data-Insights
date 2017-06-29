import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { selDataSetsComponent } from './selDataSets.component';

describe('selDataSetsComponent', () => {
  let component: selDataSetsComponent;
  let fixture: ComponentFixture<selDataSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ selDataSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(selDataSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
