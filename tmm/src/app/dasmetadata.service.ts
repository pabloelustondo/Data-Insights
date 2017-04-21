/**
 * Created by pabloelustondo on 2017-04-20.
 */

import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
let appconfig = require("../../../appconfig.json");
import 'rxjs/add/operator/toPromise';

import { DasMetadata } from '../model/dasmetadata';

@Injectable()
export class DasMetadataService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private mdburl = appconfig.mdb_url;

  constructor(private http: Http) { }


  get(tenantId: number): Promise<DasMetadata> {
    const url = `${this.mdburl}/${tenantId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as DasMetadata)
      .catch(this.handleError);
  }

  delete(tenantId: number): Promise<void> {
    const url = `${this.mdburl}/${tenantId}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(name: string): Promise<DasMetadata> {
    return this.http
      .post(this.mdburl, JSON.stringify({name: name}), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as DasMetadata)
      .catch(this.handleError);
  }

  update(dasMetadata: DasMetadata): Promise<DasMetadata> {
    const url = `${this.mdburl}/${dasMetadata.tenantId}`;
    return this.http
      .put(url, JSON.stringify(dasMetadata), {headers: this.headers})
      .toPromise()
      .then(() => dasMetadata)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}


