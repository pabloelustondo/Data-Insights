/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { Headers, Http,URLSearchParams, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Router } from "@angular/router";
import {appconfig}  from "../../appconfig";


@Injectable()
export class DosStatusService {

  dosback_url = appconfig.dosback_url;

  constructor(private http: Http) { }

  getStatus(): Observable<any> {

    let params: URLSearchParams = new URLSearchParams();
    params.set("secret", "1234");

    let token = localStorage.getItem('id_token');
    let headers = new Headers({ 'Content-Type': 'text/html',  'x-access-token' : token});

    return this.http.get(appconfig.dosback_url + "/report", {
            search:params,
            headers:headers
          }).catch((error:any) => {
      return Observable.throw('Server error')
    });
  }
}




