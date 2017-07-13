/**
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
  id?: string;
  name?: string;
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

export type SmlCodingLanguage = "JS" | "Python" | "SMLX";
export type SmlTransformationType = "AddRowFeature" | ";

export class SmlRowFeature extends SmlElement{
  name: string;
  func: string;  //for now pure javascript code

}

export class SmlDataProcess  extends  SmlElement{
  lang?: SmlCodingLanguage
  code: string
}

export class SmlTransformation {
  type: SmlTransformationType;
  lang?: SmlCodingLanguage;
  script?: string;

}


export type SmlParameterType = "Percent" | "Number" | "String" | "Date" | "DateTime" | "Duration";



export class SmlParameter{
  name: string;
  type: SmlParameterType;  //for now pure javascript code
  value: any;
}

export class SmlDataSetMerge{
// to be defined. The idea is to merge the data from first dataset to the data of anothere dataset
}

export class SmlDataSet extends SmlElement{
  data?:any[];  //it is posible to define a dataset by extension just entering data
  parameters?: SmlParameter[];
  from?: string[]; //it is also posible to define a dataset by reading from other datasets
  inHistory?: number; //how many historical/time window records I need to calculate a row of output
  persist?: boolean; //thi flag is to let DPS know that this dataset needs to be saved in DB
  filter?: any; //this is first filter that is applied to the rows of the data. Is the first thing applied.
  transformations?: SmlTransformation[]; //once the data is filtered we can add derived value to enrich the input data set.
  features?: SmlRowFeature[]; //once the data is filtered we can add derived value to enrich the input data set.
  projections?: any; //this object let us filter out columns as opposed to rows.
  // .here we just discard columns.
  merge?: any; //the idea here is to

  metadata?: any[];
}

