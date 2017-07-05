import {Injectable, OnInit} from '@angular/core';
import { Router, CanActivate, ActivatedRoute, Params } from '@angular/router';
import { tokenNotExpired} from 'angular2-jwt';
import { config } from "../../appconfig";

@Injectable()
export class AuthGuard implements CanActivate {
  token: any; 

  constructor(private router: Router) {}
  canActivate() {
    if (tokenNotExpired()) {
      return true;
    } else {
      var authurl = config.ddb_url + "/#/login?url=" + window.location.href;
      window.location.href=authurl;
      return false;
    }
  }

  saveToken(jwt) {
    this.token = jwt;
    localStorage.setItem('token', jwt);
    return true;
  }

  deleteToken() {
    this.token = null; 
    localStorage.clear();
    return true;
  }
}
