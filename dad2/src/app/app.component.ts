/**
 * Created by pelustondo on 11/22/2016.
 */
import { Component } from '@angular/core';
import { Router }   from '@angular/router';

@Component({
  selector: 'dadapp',
  template: `
<main>
    <header>    
    <nav>
    <a  style="  color:blue; float:left" *ngIf="router.url !== '/config'"  routerLink="/config"><img width="30px" heigth="30px" src="/assets/images/settings.jpg"></a>
    <a  style="  color:blue; float:left" *ngIf="router.url !== '/'"  routerLink=""><img width="30px" heigth="30px" src="/assets/images/dash.png"></a>
    </nav>
    <h3>{{title}}</h3>
    </header>
    <router-outlet></router-outlet>
</main>
  `
})
export class DadAppComponent {
  constructor(private _router: Router ) {
    this.router = _router;
  }

  router: Router;
  title = 'SOTI Data Analytics Dashboard';
}
