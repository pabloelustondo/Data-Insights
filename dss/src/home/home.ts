import { Component } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { contentHeaders } from '../common/headers';
import * as FileSaver from 'file-saver';
import { DadTable } from '../../../dad3/src/app/dad/table.component';


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
  enrollStatus: boolean;
  enrollments: string[];
  showEnrollments: boolean;
  api: string;
  error;
  url:string;
  isSOTI: boolean;
  McUrl: any[];

  constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
    this.isSOTI = this.decodedJwt["domainid"] === 'soti';
  }

  logout() {
    localStorage.removeItem('id_token');
    this.router.navigate(['login']);
  }


  showAddSource(){
    console.log('enter show add source');
    if (this.enrollStatus === undefined || this.enrollStatus === null){
      this.enrollStatus = true;
      return;
    }
  }

  showDataSources(){
      if (!this.showEnrollments) this.showEnrollments = true;
      else this.showEnrollments = false;

    this.getMcUrl();
  }

  callGetToken() {
    this._callApi('Secured', 'http://localhost:3004/api/protected/token');
  }

  callGetDeviceGroups() {
    this._callApi('Secured', 'http://localhost:3004/api/protected/devicegroups');
  }

  callGetEnrollments() {
    if (this.isSOTI) {
      this._callApi('Secured', 'http://localhost:3004/api/enrollments');
    } else {
      this._callApi('Secured', 'http://localhost:3004/api/myenrollments');
    }
  }

  callDeleteAllEnrollments() {
    if (this.isSOTI) {
      this._callApi('Secured', 'http://localhost:3004/delete_all');
    } else {
      this._callApi('Secured', 'http://localhost:3004/delete_all_mine');
    }
  }

  downloadFile(){
    var blob = new Blob([this.jwt], { type: 'text/csv' });
    FileSaver.saveAs(blob, "mcdp_dad_access.key");
   // var url= window.URL.createObjectURL(blob);
   // window.open(url);
  }

  downloadCredentials(agentId: any){

    let _agentId = agentId.innerHTML;

    var headers = new Headers({
      'Content-Type': 'application/json',
      'x-access-token' : this.jwt
    });
    this.http.get('http://localhost:3004/sourceCredentials/'+ _agentId, { headers: headers })
      .subscribe(
        response => {
          let response_body = JSON.parse(response._body);
          var blob = new Blob([response_body.activationKey], { type: 'text/csv' });
          FileSaver.saveAs(blob, "mcdp_dad_access.key");
          this.error = null;
          this.router.navigate(['home']);
        },
        error => {
          this.error = error.text();
          console.log(error.text());
        }
      );
  }

  resetCredentials(){

    var headers = new Headers({
      'Content-Type': 'application/json',
      'x-access-token' : this.jwt
    });

    this.http.post('http://localhost:3004/resetCredentials/:agentId', { headers: headers })
      .subscribe(
        response => {
          this.error = null;
          this.router.navigate(['home']);
        },
        error => {
          this.error = error.text();
          console.log(error.text());
        }
      );
  }



  getMcUrl() {


    var headers = new Headers({
      'Content-Type': 'application/json',
      'x-access-token' : this.jwt
    });

    this.http.get('http://localhost:3004/getDataSources', { headers: headers})
      .subscribe(
        response => {
          var data = JSON.parse(response._body);
         this.McUrl = data;
          this.error = null;
          this.router.navigate(['home']);
        },
        error => {
          this.error = error.text();
          console.log(error.text());
        }
      );
  }

  addSource(mcurl, agentId){
    var decoded = this.decodedJwt;

    var agent = {
      tenantid : decoded.tenantid,
      agentid : agentId,
      mcurl : mcurl
    };


    console.log('in add source : ', mcurl);
    console.log('in add source : ', agentId);
    console.log('it will be enrolled don\'t worry. ', JSON.stringify(agent));

    this.enrollStatus = null;
      console.log('it will be enrolled don\'t worry. ', agentId);

    let body = JSON.stringify(agent);
    this.http.post('http://localhost:3004/registerDataSource', body, { headers: contentHeaders })
      .subscribe(
        response => {
          this.error = null;
          this.router.navigate(['home']);
        },
        error => {
          this.error = error.text();
          console.log(error.text());
        }
      );
  }

  _callApi(type, url) {
    this.response = null;
    if (type === 'Anonymous') {
      // For non-protected routes, just use Http
      this.http.get(url)
        .subscribe(
          response => this.response = JSON.parse(response.text()),
          error => this.response = error.text()
        );
    }
    if (type === 'Secured') {
      // For protected routes, use AuthHttp
      this.authHttp.get(url)
        .subscribe(
          response => this.response = JSON.parse(response.text()),
          error => this.response = error.text()
        );
    }
  }


}
