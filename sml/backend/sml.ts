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

export class SmlStreamType{
  stream: boolean;   // when this (kind of redundante) boolean is true, this datasets will report events about its changes.
  frecuency?: number;
  timeWindow?: number;
}

export class SmlHistoryType{
  stored: true; // when this (kind of redundante) boolean is true, this datasets will be stored in data lake
  frecuency?: number;
  timeWindow?: number;
}


export class SmlFilter{
  stored: boolean;

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

//struguling with good names
export class SmlExecuteType {
  where: "client" | "dps" | "cdl";
  when: "userevent" | "dataevent";
}

export class SmlDataPoint{
  timeStamp: string; //date in string format
  data: any[];
}

export class SmlDataAttribute{
// her is where we explain to the outside world how the returning data shape is
}

export class SmlDataSet extends SmlElement{   //Element adds id & name

  //IMPORTANT GENERAL COMMENT: Most attributes in this type are optional,
  // that most normally mneans that we will assuming some default value for it.

  //private = not enforced for now

  from?: SmlDataSet[];  // data sources here give us data, events and definitions
  extend?: SmlDataSet[];   // data sources here give us data, events and definitions
  filter?: SmlFilter;
  transformations?: SmlTransformation[];

  //public basic

  data?:SmlDataPoint[]; //for now...missing time series for a sec
  dataAttributes?: SmlDataAttribute[];
  parameters?: SmlParameter[];
  streamType?: SmlStreamType;
  historyType?: SmlHistoryType;
  executeType?: SmlExecuteType;


  //public extra

  features?: SmlRowFeature[];
  projections?: SmlProjection[];
  dimensions?: SmlDimension[];
  metrics?: SmlMetric[];
  alerts?: SmlAlert[];
  reductions?: SmlReduction[];



}

