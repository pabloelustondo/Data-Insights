import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidResourceComponent } from './invalid-resource.component';

describe('InvalidResourceComponent', () => {
  let component: InvalidResourceComponent;
  let fixture: ComponentFixture<InvalidResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvalidResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
