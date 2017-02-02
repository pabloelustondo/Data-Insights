import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import * as FileSaver from 'file-saver';


const styles = require('./home.css');
const template = require('./home.html');

@Component({
  selector: 'home',
  template: template,
  styles: [ styles ]
})
export class Home {
  jwt: string;
  decodedJwt: string;
  response: string;
  enrollments: string[];
  api: string;
  isSOTI: boolean;

  constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
    this.isSOTI = this.decodedJwt["domainid"] === 'soti';
  }

  logout() {
    localStorage.removeItem('id_token');
    this.router.navigate(['login']);
  }


  callGetToken() {
    this._callApi('Secured', 'http://localhost:3004/api/protected/token');
  }

  callGetDeviceGroups() {
    this._callApi('Secured', 'http://localhost:3004/api/protected/devicegroups');
  }

  callGetEnrollments() {
    this._callApi('Secured', 'http://localhost:3004/api/enrollments');
  }

  callDeleteAllEnrollments() {
    this._callApi('Secured', 'http://localhost:3004/delete_all');
  }

  downloadFile(){
    var blob = new Blob([this.jwt], { type: 'text/csv' });
    FileSaver.saveAs(blob, "mcdp_dad_access.key");
   // var url= window.URL.createObjectURL(blob);
   // window.open(url);
  }

  _callApi(type, url) {
    this.response = null;
    if (type === 'Anonymous') {
      // For non-protected routes, just use Http
      this.http.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error.text()
        );
    }
    if (type === 'Secured') {
      // For protected routes, use AuthHttp
      this.authHttp.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error.text()
        );
    }
  }
}
