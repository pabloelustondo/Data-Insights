/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { DadConfigComponent } from '../configuration.component';

describe('DadConfigComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DadConfigComponent
      ],
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(DadConfigComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Data Analytics Dashboard'`, async(() => {
    let fixture = TestBed.createComponent(DadConfigComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Data Analytics Dashboard');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(DadConfigComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Data Analytics Dashboard');
  }));
});
