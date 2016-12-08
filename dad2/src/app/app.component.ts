/**
 * Created by pelustondo on 11/22/2016.
 */
import { Component } from '@angular/core';
import { Router }   from '@angular/router';

@Component({
  selector: 'dadapp',
  template: `
    <div>
    <a  style="  color:blue" *ngIf="this.router.url !== '/config'"  routerLink="/config"><button>See the configuration</button></a>
    <a  style="  color:blue" *ngIf="this.router.url !== '/'"  routerLink="/"><button>See the dashboard</button></a>
    
    <!--
    <div ng-controller="AppCtrl" ng-cloak="" class="navBar" ng-app="DataAnalytics">
      <md-content class="md-padding">
        <md-nav-bar md-selected-nav-item="currentNavItem" nav-bar-aria-label="navigation links">
          <md-nav-item md-nav-click="goto('config')" name="Dashboard">Configuration</md-nav-item>
          <md-nav-item md-nav-click="goto('')" name="page2">Dashboard</md-nav-item>
        </md-nav-bar>
      </md-content>
    </div> -->
    
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
