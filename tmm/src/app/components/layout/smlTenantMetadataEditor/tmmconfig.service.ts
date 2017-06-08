/**
 * Created by dister on 6/7/2017.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class TmmConfigService {
  config:{
    url: 'http://localhost:8029';
    tenantId: 'testtenant-testuser';
  };

  constructor(private http: Http, private activatedRoute: ActivatedRoute) {}

  deleteUserByTenantId() {
    return this.http.delete(this.config.url + '/tenant/' + this.config.tenantId).map(res => res.json());
  }

  saveDataByTenantId(tenantMetadata) {
    return this.http.post(this.config.url + '/tenant/' + this.config.tenantId, tenantMetadata);
  }

  public getTenantMetadata(): Promise<any> {
    let url = this.config.url + '/tenant/' + this.config.tenantId;
    return this.http.get(this.config.url).toPromise();
  }
}
