import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';
declare var require: any;
declare var window: any;
let appconfig = require('../../../appconfig.json');
let globalconfig = require('../../../globalconfig.json');

Object.keys(appconfig).forEach(function(key){
  globalconfig[key] = appconfig[key];
})
appconfig = globalconfig;

const backendUrl = appconfig.dssback_url;
const styles   = require('./signup.css');
const template = require('./signup.html');


export interface SignupInfo {
  accountid : string;
  mcurl : string;
  apikey : string;
  domainid : string;
  username : string;
  password : string;
  clientsecret : string;
  companyname? : string;
  companyphone? : string;
  companyaddress? : string;

}

@Component({
  selector: 'signup',
  template: template,
  styles: [ styles ]
})


export class Signup {

  constructor(public router: Router, public http: Http) {}

  testsignup (event, SignupInfo) {

  }

  signup(event, accountid, mcurl, apikey, domainid, username, password, clientsecret,
         companyName, companyAddress, companyPhone) {
    event.preventDefault();
    let body = JSON.stringify({ accountid, mcurl, apikey, domainid, username, password,
      clientsecret, companyPhone, companyAddress, companyName});
    this.http.post( backendUrl + '/enrollments', body, { headers: contentHeaders })
      .subscribe(
        response => {
          localStorage.setItem('id_token', response.json().id_token);
          this.router.navigate(['home']);
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  optional(event, companyname, companyaddress, phone) {
    event.preventDefault();
    let body = JSON.stringify({companyname, companyaddress, phone});
    this.http.post(backendUrl + '/enrollments', body, { headers: contentHeaders })
      .subscribe(
        response => {
          localStorage.setItem('id_token', response.json().id_token);
          this.router.navigate(['home']);
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  login(event) {
    event.preventDefault();
    this.router.navigate(['login']);
  }

}
