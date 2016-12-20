/**
 * Created by pelustondo on 11/22/2016.
 */
import { Component } from '@angular/core';
import { Router }   from '@angular/router';

@Component({
  selector: 'dadapp',
  template: `
    <div>
    <a  style="  color:blue" *ngIf="router.url !== '/config'"  routerLink="/config"><button>See the configuration</button></a>
    <a  style="  color:blue" *ngIf="router.url !== '/'"  routerLink="/"><button>See the dashboard</button></a>
    
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
