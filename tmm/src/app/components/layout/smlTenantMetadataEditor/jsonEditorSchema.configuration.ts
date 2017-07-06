/**
 * Created by dister on 6/6/2017.
 */
import {SmlTenantMetadata, SmlDataSet} from '../../../../sml/sml';


// this is the dataset schema that we need for JSON editor and crud component will use this too
export const smlTenantMetadataSample: SmlTenantMetadata = {
  id: 'SMLTest',  // id of the metadata
  name: 'SML Data Set',
  tenantId: 'testtenant-testuser',
  dataSets: [{
    id: '10-22-1',
    name: 'Test Data Set 01',
    from: ['Doga Ister'],
    persist: true,
    filter: ['/&AS/'],
    merge: ['09-21-31$F'],
    projections: [''],
    metadata: ['']
  }, {
    id: '101',
    name: 'Test Data Set 02',
    from: ['Ray Gervais'],
    persist: true,
    filter: ['/&asdasdasda/'],
    merge: ['09-1231-31$F'],
    projections: [''],
    metadata: ['']
  }],
  dataSource: [{
    id: '10-23-1',
    name: 'Test Data Set 01',
    type: 'MCDP',
    active: true,
    activationKey: '',
    properties: [
      {
        'inputName' : 'Url',
        'inputValue' : 'http://cad109.soti.net/mc/api'
      }],
    dataSets: ['']
  }, {
    id: '10-23-2',
    name: 'Test Data Set 02',
    type: 'API',
    active: true,
    activationKey: '',
    properties: [
      {
        'inputName' : 'Url',
        'inputValue' : 'http://cad109.soti.net/mc/api'
      },
      {
        'inputName' : 'Api Name',
        'inputValue' : 'my custom api'
      },
    ],
    dataSets: ['']
  }],
  users: [{
    id: '10-24-1',
    name: 'Test Data Set 01',
    permissions: ['Write', 'Read', 'Execute'],
    status: 'Admin'
  }, {
    id: '32-1',
    name: 'Test Data Set 02',
    permissions: ['Write', 'Read'],
    status: 'User'
  }],
  idpInformation: [{
    id: '10-25-02',
    name: 'idap Main Config',
    endpoint: 'localhost:1023/endPointFTW',
    configurations: [{
      method: 'GET',
      secure: 'x-access'
    }]
  },
    {
      id: '10-25-02',
      name: 'idap Main Config 2',
      endpoint: 'localhost:1023/endPointFTW',
      configurations: [{
        method: 'POST',
        secure: 'y-access 4 pizza'
      }]
    }]
};

export const smlTenantEmptyMetadataSample: SmlTenantMetadata =
  {
    id: '',  // id of the metadata
    name: '',
    tenantId: '',
    dataSets: [],
    dataSource: [],
    users: [],
    idpInformation: [],
  };

export const smlTenantMetadataEmpty: SmlDataSet = {
  id: '',
  name: '',
  from: [''],
  persist: true,
  filter: '',
  merge: '',
  projections: '',
  metadata: ['']
};


