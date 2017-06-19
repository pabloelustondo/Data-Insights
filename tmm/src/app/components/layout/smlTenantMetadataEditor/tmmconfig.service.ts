/**
 * Created by dister on 6/7/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { config } from "../../../../../appconfig";
import { smlTenantMetadataSample, smlTenantMetadataEmpty } from './jsonEditorSchema.configuration';
const globalConfig = require('../../appconfig.json');
@Injectable()
export class TmmConfigService {
  config: {
    url: 'localhost:8029';
    tenantId: 'testtenant-testuser';
  };

  constructor(private http: Http) {}

  deleteUserByTenantId(tenantid) {
    if (config.ddb_url != "") {
      return this.http.delete(config.ddb_url + '/tenant/' + tenantid);
    }
  }

  saveDataByTenantId(tenantid, tmtMetadata) {
    if (config.ddb_url != "") {
      console.log(tmtMetadata);
      let url = globalConfig.tmmback_url + tmtMetadata.tenantId;
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
  }

  public getTenantMetadata(tenantId): Promise<any> {
    if (config.ddb_url != "") {
      let url = 'http://localhost:8029/tenant/' + tenantId;
      return this.http.get(url).toPromise();
    }else {
      return Promise.resolve(smlTenantMetadataSample);
    }
  }
}
