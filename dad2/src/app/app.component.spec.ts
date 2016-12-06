/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { DadAppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DadAppComponent
      ],
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(DadAppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Data Analytics Dashboard'`, async(() => {
    let fixture = TestBed.createComponent(DadAppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Data Analytics Dashboard');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(DadAppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Data Analytics Dashboard');
  }));
});
