import { Component } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { contentHeaders } from '../common/headers';
import * as FileSaver from 'file-saver';

// import { DadTable } from '../../../dad3/src/app/dad/table.component';

const backendUrl = 'https://localhost:3004';
const styles = require('./home.css');
const template = require('./home.html');

export type DataSourceTypeOptions = 'Mobicontrol' | 'NextBus' | 'Other...';

@Component({
  selector: 'home',
  template: template,
  styles: [ styles ]
})
export class Home {
  jwt : string;
  decodedJwt : string;
  response : string;
  showTermsAndConditions : boolean;
  acceptedTermsAndConditions : boolean;
  enrollStatus : boolean;
  enrollments : string[];
  showEnrollments : boolean;
  api : string;
  error : any;
  url : string;
  isSOTI : boolean;
  dataSource: any[];
  McUrl : any[];
  rowsTake = 10;
  options: any[] = [{'option': 'MobiControl'}, {'option': 'NextBus'}, {'option': 'Other...'}];
  dataSourceType: DataSourceTypeOptions;

  constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
    this.isSOTI = this.decodedJwt['domainid'] === 'soti';
  }

  logout() {
    localStorage.removeItem('id_token');
    this.router.navigate(['login']);
  }

  showAddSource() {
    console.log('enter show add source');

    if (!this.enrollStatus) {
      this.enrollStatus = true;
    } else {
      this.enrollStatus = false;
    }
  }

  showDataSources() {
      if (!this.showEnrollments) {
        this.showEnrollments = true;
      } else {
        this.showEnrollments = false;
      }
      this.getMcUrl();
  }

  callGetToken() {
    this._callApi('Secured', backendUrl + '/api/protected/token');
  }

  callGetDeviceGroups() {
    this._callApi('Secured', backendUrl + '/api/protected/devicegroups');
  }

  callGetEnrollments() {

    var headers = new Headers({
      'Content-Type' : 'application/json',
      'x-access-token' : this.jwt
    });
    this.http.get( backendUrl + '/api/myenrollments', { headers: headers })
      .subscribe(
        response => {
          let response_body = response['_body'];
          var blob = new Blob([response_body], { type: 'text/csv' });
          this.error = null;
          this.response =  JSON.parse(response.text());
          //    this.router.navigate(['home']);
        },
        error => {
          this.error = error.text();
          console.log(error.text());
        }
      );
  }

  callDeleteAllEnrollments() {
    if (this.isSOTI) {
      this._callApi('Secured',  backendUrl + '/delete_all');
    } else {
      this._callApi('Secured',  backendUrl + '/delete_all_mine');
    }
  }

  downloadFile(conditionStatus: any) {
    if (this.acceptedTermsAndConditions) {
      var blob = new Blob([this.jwt], {type: 'text/csv'});
      FileSaver.saveAs(blob, 'mcdp_dad_access.key');
    } else {
      this.showTermsAndConditions = true;
    }

  }

  downloadCredentials(agentId: any) {
    let _agentId = agentId.innerHTML;
    var headers = new Headers({
      'Content-Type' : 'application/json',
      'x-access-token' : this.jwt
    });
    this.http.get( backendUrl + '/sourceCredentials/' + _agentId, { headers: headers })
      .subscribe(
        response => {
          let response_body = response['_body'];
          var blob = new Blob([response_body], { type: 'text/csv' });
          FileSaver.saveAs(blob, 'MCDP_Access.key');
          this.error = null;
        },
        error => {
          this.error = error.text();
          console.log(error.text());
        }
      );
  }

  resetCredentials(agentId: any) {
    let _agentId = agentId.innerHTML.trim();

    var headers = new Headers({
      'Content-Type' : 'application/json',
      'x-access-token' : this.jwt
    });

    this.http.post( backendUrl + '/resetCredentials/' + _agentId, { headers: headers })
      .subscribe(
        response => {
          alert('successfully reset, download new credentials');
          this.error = null;
         // this.router.navigate(['home']);
        },
        error => {
          alert('reset failed.');
          this.error = error.text();
          console.log(error.text());
        }
      );
  }

  getMcUrl() {
    var headers = new Headers({
      'Content-Type' : 'application/json',
      'x-access-token' : this.jwt
    });

    this.http.get( backendUrl + '/getDataSources', { headers: headers})
      .subscribe(
        response => {
          var data = JSON.parse(response['_body']);
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

  deleteAgent (agentId: any, dataSourceType: any) {

    let _agentId = agentId.innerHTML.trim();
    var agent = {
      dataSourceType : dataSourceType,
      agentid : _agentId
    };

    var headers = new Headers({
      'Content-Type' : 'application/json',
      'x-access-token' : this.jwt
    });


    let body = JSON.stringify(agent);
    this.http.post( backendUrl + '/deleteDataSource', body, { headers: headers })
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

  addSource(dataSourceForm) {
    var decoded = this.decodedJwt;

    let inputs = dataSourceForm.getElementsByTagName('input');
    let inputLengths = inputs.length;
    //create a array of all inputs
    let inputValues = [];

    for (let ctr = 0;  ctr < inputLengths; ctr++) {
      let inputInformation = {
        inputName : inputs[ctr].id,
        inputValue :  inputs[ctr].value
      };
      inputValues.push(inputInformation);
    }

    var agent = {
      tenantid : decoded['tenantId'],
      dataSourceType : this.dataSourceType,
      agentid : 'asdas',
      data : inputValues
    };

    console.log('it will be enrolled don\'t worry. ', JSON.stringify(agent));

    this.enrollStatus = null;

    let body = JSON.stringify(agent);
    this.http.post( backendUrl + '/registerDataSource', body, { headers: contentHeaders })
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
