/**
 * Created by vdave on 2/13/2017.
 */
import {Component, Input, OnInit} from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { contentHeaders } from '../common/headers';
import { Form } from '@angular/forms';
import * as FileSaver from 'file-saver';
declare var require: any;
declare var window: any;


const styles = require('./home.css');
const _template = require('../source/source-form.component.html');

@Component({
  selector: 'sourceForm',
  template:  _template,
  styles: [ styles ]
})
export class SourceForms  implements OnInit {
  jwt : string;
  decodedJwt : string;
  response : string;
  enrollStatus : boolean;
  enrollments : string[];
  api : string;
  isSOTI : boolean;
  @Input()
  agentId : string;



  constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
    this.isSOTI = this.decodedJwt['domainid'] === 'soti';
  }

  ngOnInit() {
    this.agentId = '';
  }

  onSubmit(event, form) {
    var x = form;

    console.log('you submitted value : ', form);
    this.router.navigate(['sf']);

  }

  addSource(event, mcurl, agentid) {

    var decoded = this.decodedJwt;

    var agent = {
      tenantid : agentid,
      agentid : agentid,
      mcurl : mcurl
    };


    console.log('in add source : ', mcurl);
    console.log('in add source : ', agentid);
    console.log('it will be enrolled don\'t worry. ', JSON.stringify(agent));

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
