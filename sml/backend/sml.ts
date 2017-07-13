/**
 * Created by dister on 6/1/2017.
 */

export class SmlTenantMetadata {
    id: string;
    name: string;
    tenantId: string;
    dataSets: SmlDataSet[];
    dataSources: SmlDataSource[];
    users: SmlUser[];
    idp: SmlIdpInformation[];
}

export class SmlDataSource {
    id?: string;
    name?: string;
    type: string;
    active: boolean;
    properties: any[];
}

export class SmlSubscription {
    id?: string;
    name?: string;
    datasetid:"string";
    filter: SmlFilter;  //to filter out some notifications
    deliveryType: "email" | "text" | "mail" | "phonecall";
}

export class SmlDadConfiguration {}


export class SmlUserProfile {
    firstName?:string;
    lastName?:string;

}

export type SmlUserType = "daduser" | "mcadmin";


export class SmlUser {
    id?: string;
    username?: string;
    userType: SmlUserType
    userprofile?: SmlUserProfile;
    permissions?: string[];
    status?: string;
    subscriptions?: SmlSubscription[];
    dadConfiguration?: SmlDadConfiguration;
}

export class SmlIdpInformation {
    id?: string;
    name?: string;
    endpoint: string;
    configurations: any[];
}

export type SmlCodingLanguage = "JS" | "Python" | "SMLX";

export type SmlTransformationType = "AddRowFeature" | "ProcessDataSet";



export class SmlScript {
    id?: string;
    name?: string;
    lang?: SmlCodingLanguage;
    script?: string;
}

export class SmlDataProcess  extends  SmlScript{
}
export class SmlRowFeature extends  SmlScript {

}


export class SmlTransformation {
  type: SmlTransformationType;
  process?: SmlScript;
}


export type SmlParameterType = "Percent" | "Number" | "String" | "Date" | "DateTime" | "Duration";

export type SmlStorageType = "File" | "Collection";

export class SmlParameter{
  name: string;
  type: SmlParameterType;  //for now pure javascript code
  value: any;
}

export class SmlStreamProfile{
  frecuency?: number;
  timeWindow?: number;
}

export class SmlDateRange{
    startDate: Date;
    endDate: Date;
}

export class SmlQueryProfile{
  dataRanges: SmlDateRange[];
}

export class SmlSubscriptionProfile{
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
    id:string;
    name:string;
    dataSetExp: string; //data_set level expression  example: whole TTC set of buses
    dataPointExp: string; //data_point level expression: example: one TTC bus
}

export class SmlReduction{


}


export class SmlExecutionType {
  where: "client" | "dps" | "cdl";
  when: "userevent" | "dataevent";
}

export type SmlNotificationType = "critical" | "warning" | "info";

export class SmlNotification{
    type: SmlNotificationType;
    id:string;
    name?: string;
    message?:string;
    timeStamp: string;
    data?: any[];
}



export class SmlDataInstance{
  timeStamp: string; //date in string format
  data: any[];
  notifications: SmlNotification[];
}

export class SmlAttribute{
// her is where we explain to the outside world how the returning data shape is
}

export class SmlDataSet{   //Element adds id & name

  //IMPORTANT GENERAL COMMENT: Most attributes in this type are optional,
  // that most normally mneans that we will assuming some default value for it.

    //public basic

    id?:string;
    name?:string;
    data?:SmlDataInstance[]; //for now...missing time series for a sec
    attributes?: SmlAttribute[];
    parameters?: SmlParameter[];

    streamable?: SmlStreamProfile;
    queryable?: SmlQueryProfile;
    subscribable?: SmlSubscriptionProfile;

    executionType?: SmlExecutionType;

    //public extra

    features?: SmlRowFeature[];
    dimensions?: SmlDimension[];
    metrics?: SmlMetric[];
    alerts?: SmlAlert[];
    reductions?: SmlReduction[];

  //private but privacy not enforced for now

    user: SmlUser;
    from?: SmlDataSet[];  // data sources here give us data, events and definitions
    extends?: SmlDataSet[];   // data sources here give us data, events and definitions
    filter?: SmlFilter;
    projection?: SmlProjection;
    transformations?: SmlTransformation[];






}


