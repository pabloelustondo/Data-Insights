import {Injectable, OnInit} from '@angular/core';
import { Router, CanActivate, ActivatedRoute, Params } from '@angular/router';
import { tokenNotExpired} from 'angular2-jwt';
import { config } from "../appconfig";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}
  canActivate() {
    if (tokenNotExpired() || config.testing) {
      return true;
    }
    var authurl = config.authorizationserver + "/#/login?url=" + window.location.href;
    window.location.href=authurl;
    return false;
  }
}
