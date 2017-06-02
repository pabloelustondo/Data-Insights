/**
 * Created by dister on 6/2/2017.
 */
import { Injectable } from '@angular/core';
import { Headers, Http,URLSearchParams, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Router } from "@angular/router";

@Injectable()
export class SmlDataService {
  headers: Headers  = new Headers({ 'Content-Type': 'application/json'});// 'x-access-token' : token});
  bodyString: string = JSON.stringify(['_body']);
  url: string = 'TBD!';
  endpoint: any = "TBD";

  constructor(private http: Http,
              private router: Router) { }


  getData(): Observable<any>{
    // let token = localStorage.getItem('id_token');
    return this.http.get(this.url).map(response => response.json());
  }

  getDataId():Observable<any>{
    return this.http.post(this.url,
      this.bodyString,
      this.headers ).map(response => response.json());
  }

}
