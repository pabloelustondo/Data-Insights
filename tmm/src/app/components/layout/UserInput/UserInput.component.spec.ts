import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInput } from './UserInput.component';

describe('UserInput', () => {
  let component: UserInput;
  let fixture: ComponentFixture<UserInput>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInput ]
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
