import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';

const styles   = require('./login.css');
const template = require('./login.html');

@Component({
  selector: 'login',
  template: template,
  styles: [ styles ]
})
export class Login {
  error;
  url:string;
  adminflow:boolean = false;

  constructor(public router: Router,
              private activatedRoute: ActivatedRoute,
              public http: Http) {
  }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.url = params['url'];
    });
  }

  changeMethod(v){
    console.log(v);

  }

  login(event, loginmethod, domainid, username, password) {
    alert(loginmethod.value)
    event.preventDefault();

    if (loginmethod.value === 'mcuser') {
      window.location.href = "http://www.soti.net";
      return;
    } else {

      let body = JSON.stringify({domainid, username, password});
      this.http.post('http://localhost:3004/sessions/create', body, {headers: contentHeaders})
        .subscribe(
          response => {
            this.error = null;
            localStorage.setItem('id_token', response.json().id_token);
            if (this.url) {
              window.location.href = this.url + "/#/dad/login?id_token=" + response.json().id_token;
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
