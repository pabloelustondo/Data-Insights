import {getTestBed} from "@angular/core/testing";
/**
 * Created by dister on 6/7/2017.
 */
declare var require;

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { config } from "../../../../../appconfig";
import { smlTenantMetadataSample, smlTenantMetadataEmpty } from './jsonEditorSchema.configuration';

let globalConfig = require('../../../../../globalconfig.json');

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

  deleteDataSourceByDataSourceId(tenantId, dataSourceId) {
    console.log(globalConfig['tmmback_url'] + '/deleteDataSource/' + tenantId + '/' + dataSourceId);
    return this.http.delete(globalConfig['tmmback_url'] + '/deleteDataSource/' + tenantId + '/' + dataSourceId).toPromise();
  }

  saveDataByTenantId(tenantid, tmtMetadata, callback) {
    if (config.ddb_url != "") {
      console.log(tmtMetadata);

      let url = globalConfig['tmmback_url'] + '/tenant/' + tmtMetadata.tenantId;
      this.http.post(url, tmtMetadata).toPromise().then(
        (res: Response) => {
          callback();
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
      let url = globalConfig['tmmback_url'] + '/tenant/' + tenantId;
    //  let url = 'http://localhost:8029/tenant/' + tenantId;
      return this.http.get(url).toPromise();
    }else {
      return Promise.resolve(smlTenantMetadataSample);
    }
  }

  public insertDataSourceByTenantId(tenantId, data) {
    return this.http.post(globalConfig['tmmback_url'] + '/tenant/dev/dataSource/' + tenantId, data).toPromise();
  }

  public resetDataSourceActivationKey(tenantId, dataSourceId, data) {
    return this.http.put(globalConfig['tmmback_url'] + '/dataSource/' + tenantId + '/' + dataSourceId, data).toPromise();
  }

  public getDataSourceCredential(tenantId, dataSource) {
    return new Promise (function (resolve, reject) {
      resolve ('lalalalala ' + dataSource.id);
    });
    // return this.http.get(globalConfig['tmmback_url'] + '/tenant/dev/' + tenantId + '/dataSourceToken/' + dataSource.id).toPromise();
  }
}
