import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';

const styles   = require('./signup.css');
const template = require('./signup.html');

@Component({
  selector: 'signup',
  template: template,
  styles: [ styles ]
})
export class Signup {
  constructor(public router: Router, public http: Http) {}

  signup(event, accountid, mcurl, apikey, domainid, username, password, clientsecret) {
    event.preventDefault();
    let body = JSON.stringify({ accountid, mcurl, apikey, domainid, username, password, clientsecret});
    this.http.post('http://localhost:3004/enrollments', body, { headers: contentHeaders })
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

  optional(event, companyname, companyaddress, phone)
  {
    event.preventDefault();
    let body = JSON.stringify({companyname, companyaddress, phone});
    this.http.post('http://localhost:3004/enrollments', body, { headers: contentHeaders })
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
