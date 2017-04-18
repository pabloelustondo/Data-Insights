import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';
let appconfig = require('../../appconfig.json');


const backendUrl = appconfig.dssback_url;
const styles   = require('./login.css');
const template = require('./login.html');

@Component({
  selector: 'login',
  template: template,
  styles: [ styles ]
})
export class Login {
  error;
  redirectUrl : string;
  url : string;
  code : string;
  domainid : string;
  manualLogin : boolean;
  adminflow : boolean = false;

  constructor(public router: Router,
              private activatedRoute: ActivatedRoute,
              public http: Http) {
  }

  ngOnInit() {
    // subscribe to router event
    this.manualLogin = false;
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.url = params['url'];
      this.code = params['code'];
      this.domainid = params['state'];
      if (this.domainid) {

        if (this.domainid.indexOf('?redirectUrl=') !== -1) {
          this.url = this.domainid.substring(this.domainid.indexOf('?redirectUrl=') + 13);
        }
      }

      if (this.code && this.domainid) {

        let code = this.code;
        let domainid = this.domainid;
        let body = JSON.stringify({domainid, code});
        this.http.post(backendUrl + '/sessions/create', body, {headers: contentHeaders})
          .subscribe(
            response => {
              this.error = null;
              localStorage.setItem('id_token', response.json().id_token);
              if (this.url) {
                window.location.href = this.url + '/#/dad/login?id_token='
                  + response.json().id_token;
              }
              this.router.navigate(['home']);
            },
            error => {
              this.error = error.text();
              console.log(error.text());
            }
          );
      }
    });
  }

  changeMethod( v ) {
    console.log( v );
    if (v === 'mcuser') {
      this.manualLogin = false;
    } else {
      this.manualLogin = true;
    }

  }

  login(event, loginmethod, domainid, username, password) {


    if (event) {
      event.preventDefault();
    }

    if (loginmethod.value === 'mcuser' && !this.code) {

      // we need to get the url for the domain id entered,
      // which by the way is a good way to verify the domain id
      let url = backendUrl + '/urlbydomainid?domainid=' + domainid.value;
      this.http.get(backendUrl + '/urlbydomainid?domainid=' + domainid.value)
        .subscribe(
          response => {
            let result = JSON.parse(response['_body']);
            if (this.url) {
              window.location.href = result.url +
                '/oauth/authorize?response_type=code&client_id=' + result.clientId + '&state=' +
                domainid.value + '?redirectUrl=' + this.url;
            } else {
              window.location.href = result.url +
                '/oauth/authorize?response_type=code&client_id=' + result.clientId +  '&state=' +
                domainid.value;
            }

          },
          error => {
            alert('the provided domain id could not be found');
            console.log(error.text());
          }
        );

    } else {
      let code = this.code;

      let body = JSON.stringify({
        domainid: domainid.value,
        username: username.value,
        password: password.value,
        code: code});
      this.http.post(backendUrl + '/sessions/create', body, { headers: contentHeaders })
        .subscribe(
          response => {
            this.error = null;
            localStorage.setItem('id_token', response.json().id_token);
            if (this.url) {
             window.location.href = this.url + '/#/dad/login?id_token=' + response.json().id_token;
            }
            this.router.navigate(['home']);
          },
          error => {
            this.error = error.text();
            console.log(error.text());
          }
        );

    }
  }

  signup(event) {
    event.preventDefault();
    this.router.navigate(['signup']);
  }
}
