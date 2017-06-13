import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SmlTenantMetadata } from 'sml/sml';

@Injectable()
export class SmlDataServiceService {
  config: {
    url: 'http://localhost:8029';
  }
  constructor(private http: Http, private smlMetaData: SmlTenantMetadata) { }

  deleteUserByTenantId(tenantId) {
    return this.http.delete(this.config.url + '/tenant/' + tenantId).map(res => res.json());
  }

  updateDataSetByTenantId(dataSet, tenantId) {
    return this.http.get('').map(res => res.json());
  }
}
