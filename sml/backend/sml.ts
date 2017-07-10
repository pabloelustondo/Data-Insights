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
export type SmlTransformationType = "AddRowFeature" | "ProcessDataSet";

export class SmlRowFeature extends SmlElement{
  name: string;
  func: string;  //for now pure javascript code

}

export class SmlDataProcess  extends  SmlElement{
  lang?: SmlCodingLanguage
  script?: string
}

export class SmlTransformation {
  type: SmlTransformationType;
  lang?: SmlCodingLanguage;
  script?: string;
}


export type SmlParameterType = "Percent" | "Number" | "String" | "Date" | "DateTime" | "Duration";

export type SmlStorageType = "None" | "File" | "Collection"

export class SmlParameter{
  name: string;
  type: SmlParameterType;  //for now pure javascript code
  value: any;
}

export class SmlStream{
  frecuency?: number;
  timeWindow?: number;
}


export class SmlFilter{


}


export class SmlProjection{


}

export class SmlDimension{


}

export class SmlMetric{


}

export class SmlAlert{


}

export class SmlReduction{


}

export class SmlDataSet extends SmlElement{
  //public

  data?:any[]; //for now...missing time series for a sec
  parameters?: SmlParameter[];
  stream?: SmlStream;
  persistanceType?: SmlStorageType;
  features?: SmlRowFeature[];
  projections?: SmlProjection[];
  dimensions?: SmlDimension[];
  metrics?: SmlMetric[];
  alerts?: SmlAlert[];
  reductions?: SmlReduction[];

  //private = not enforced for now

  from?: string[];
  filter?: any;
  transformations?: SmlTransformation[];

}

