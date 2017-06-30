/**
 * Created by dister on 6/1/2017.
 */

export class SmlTenantMetadata {

  id: string;  // id of the metadata
  name: string;
  tenantId: string;
  dataSets: SmlDataSet[];
  dataSources: SmlDataSource[];
  users: SmlUsers[];
  idpInformation: SmlIdpInformation[];
}

export class SmlElement {
  id: string;
  name: string;
}

export class SmlDataSource extends SmlElement {
 type: string;
 active: boolean;
 properties: SmlDataSourceProperty[];
 activationKey: string;
 status?: string;
 dataSets?: string[];
}

export class SmlDataSourceProperty {
  inputName: string;
  inputValue: string;
}

export class SmlUsers extends SmlElement {
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

