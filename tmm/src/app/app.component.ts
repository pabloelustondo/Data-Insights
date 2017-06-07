import {Component, resolveForwardRef} from '@angular/core';
import { Router } from '@angular/router';
import {UserInput} from './components/layout/UserInput/UserInput.component';

@Component({
  selector: 'body',
  template: `
    <div>
      <userinput></userinput>
    </div>
  `,
})
export class AppComponent {

  constructor(){}

  OnInit(){}
}
