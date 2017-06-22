import { Component } from '@angular/core';

@Component({
  selector: 'client-app',
  template: `
   <a routerLink="/messages">messages</a> <a routerLink="/">home</a>
   <br/>
   <router-outlet></router-outlet>
`
})
export class ClientAppComponent {
}
