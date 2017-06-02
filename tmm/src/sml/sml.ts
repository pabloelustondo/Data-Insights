0/**
 * Created by dister on 6/1/2017.
 */

export class SmlTenantMetadata {

  id: string;  //id of the metadata
  name: string;
  tenantId: string;
  dataSets: SmlDataSet[];
  dataSource: SmlDataSource[];
  users: SmlUsers[];
  idpInformation: SmlIdpInformation[];
}

export class SmlElement{
  id: string;
  name: string;

  validate(){
    return (this.id !== undefined && this.name !== undefined)
  }
}

export class SmlDataSource extends SmlElement{
 type: string;
 active: boolean;
 properties: any[];
}

export class SmlUsers extends SmlElement{
  permissions: string[];
  status: string;
}

export class SmlIdpInformation extends SmlElement{
  endpoint: string;
  configurations: any[];
}

export class SmlDataSet extends SmlElement{
  from: string[]; //source from
  persist: boolean;
  filter?: any;
  merge?: any;
  projections?: any;
  metadata: any[];
}

