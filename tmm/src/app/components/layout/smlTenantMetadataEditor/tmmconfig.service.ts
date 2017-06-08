/**
 * Created by dister on 6/7/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TmmConfigService {
  config: {
    url: 'localhost:8029';
    tenantId: 'testtenant-testuser';
  };

  constructor(private http: Http) {}

  deleteUserByTenantId(tenantid) {
    return this.http.delete('http://localhost:8029/tenant/' + tenantid);
  }

  saveDataByTenantId(tenantid, tmtMetadata) {
    console.log(tmtMetadata);
    let url = 'http://localhost:8029/tenant/' + tmtMetadata.tenantId;
    this.http.post(url, tmtMetadata).toPromise().then(
      (res: Response) => {
        console.log((res));
      }).catch(
      (error) => {
        alert("Failed to save configuration to database " + error);
        console.log('configuration failed to save');
      }
    );
  }

  public getTenantMetadata(tenantId): Promise<any> {
    let url = 'http://localhost:8029/tenant/' + tenantId;
    return this.http.get(url).toPromise().then(
      (res: Response) => {
        console.log(res);
        Promise.resolve(res);
      }).catch(
      (error) => {
        alert("Failed to save configuration to database " + error);
        console.log('configuration failed to save');
      }
    );
  }
}
