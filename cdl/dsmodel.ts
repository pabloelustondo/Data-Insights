/**
 * Created by pabloelustondo on 2017-04-24.
 * DRAFT!!!... Some things are duplicated on the UI... but let fix the server side first then we update the UI.
 */

export interface DasDataSet {
    tenantid: string;
    dsid: string;   //id of this data set for example 'vehicles'
    dsname?: string;
    data?: any[];
    
    dataSourceId?: string, //id of the data source this data source feeds from. for example nexbus.
    parameters?: DasParameter[], //parameters to be applied to the data source ... kind oof filter.
    merge?: DasDataSetMerge; //merge datasource with other data sources

//draft ported from UI
    transformation?: any;
    transformations?: any[];
    reduction?:any;
    reductions?:any[];
    newFilter?: any;
    filter?:any;
    filters?: DasFilter[];
    alert?:any;
    alerts?: DasAlert[];
    search?:string;
}


export interface ExtensibleDasDataSet {
    dsName: string,
    dsId: string,
    persist: boolean,
    relationships: DasRelationship[]
}
export interface DasRelationship {
    operations  : DasOperation []
}

export interface DasOperation {
    type: string,
    dataSets : DasDataSetFields []
}

export interface DasDataSetFields {
    dataSourceId : string,
    fields: string[]
}

export interface DasDataSetMerge {
    dsid?: string;
    commonFeature: string;  // common feature that will be used to create the join
}

export interface DasParameter {
    name: string,
    value: string
}


export type DasParameterType = "Number" | "String" | "Date" | "Time" | "DateTime" | "Duration";

export type DasMetricType = "Number" | "String" | "Date" | "Time";

export type MetricOperator = 'count' | 'sum' | 'avg';

export interface DasMetric{
    Type?: DasParameterType,
    Name?: string,
    DataSource?: string,
    Value?:any,
    Dimensions?: DasDimension[],
    attribute?:string;
    name?:string;
    op?:MetricOperator
}

export type DasDimensionType = 'Number' | 'String' | 'MiniChart';

export type DasFilterType = 'Number' | 'String';

export type DasAlertType = 'Number' | 'String';

export interface DasDimension{
    Type?: DasDimensionType,
    Name?: string,
    DataSource?: string,
    Value?:any,
    attribute?:string,
    name?:string
}

export interface DasFilter{
    Type?: DasFilterType,
    Name?: string,
    DataSource?: string,
    Value?:any,
    attribute?:any,
    name?:string
}

export interface DasAlert{
    Type?: DasAlertType,
    Name?: string,
    DataSource?: string,
    Value?:any,
    expression?:string,
    name?:string
}

