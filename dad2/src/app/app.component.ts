/**
 * Created by pelustondo on 11/22/2016.
 */
import { Component } from '@angular/core';
import { Router }   from '@angular/router';

@Component({
  selector: 'dadapp',
  template: `
    <div>
    <a  style="  color:blue" *ngIf="this.router.url !== '/config'"  routerLink="/config">Configuration</a>
    <a  style="  color:blue" *ngIf="this.router.url !== '/'"  routerLink="/">Dashboard</a>
    
    <h1 id="title" >{{title}}</h1> 

    </div>
    <router-outlet></router-outlet>
  `
})
export class DadAppComponent {
  constructor(private _router: Router ) {
    this.router = _router;
  }

  router: Router;
  title = 'Data Analytics Dashboard';
}
