/**
 * Created by pabloelustondo on 2017-06-21.
 */

import { SmlDataSet } from "./sml"


export type DadElementType = "chart" | "widget" | "table" | "page" | "data";

export class DadElement {
  id: string;
  elementType: DadElementType;
  name?: string;
  data?: any;
  timeWindow?:number;
  mappedData?: any;
  parameters?: any[];
  metricName?: string;
  predicates?: string[];
  uiparameters?: DadParameter[];
  a?:string;
  b?:string;
  lon?: string;
  lat?: string;
  parameterMappers?:any[];
  endpoint?: string;
  dataset?: SmlDataSet;
  metrics?: DadMetric[];
  dimensions?: DadDimension[];
  tableId?: string;
  chart?: DadChart;
  transformation?: any;
  transformations?: any[];
  reduction?:any;
  reductions?:any[];
  newFilter?: any;
  f?: any;
  filter?:any;
  filters?: DadFilter[];
  alert?:any;
  alerts?: DadAlert[];
  search?:string;
  dataElement?: string;
  intervalTime?: number;
  intervalRefreshOption?: boolean = false;
  readExpression?: any;
  alertExpression?: string;
}

export class DadDataView extends DadElement {
  type?: string;
}

export class DadDateRange{
  dateFrom: string;
  dateTo:string;
}

export type DadParameterType = "Number" | "String" | "Date" | "Time" | "DateTime" | "Duration";


export interface DadParameterMapper {
  map2model(v:any):any;
  map2view(v:any):any;
}

export interface DadParameter{
  Type: DadParameterType,
  Name: string,
  DataSource: string,
  Value?:any,
  Mapper?: DadParameterMapper
}

export type DadMetricType = "Number" | "String" | "Date" | "Time";

export type MetricOperator = 'count' | 'sum' | 'avg';

export interface DadMetric{
  Type?: DadParameterType,
  Name?: string,
  DataSource?: string,
  Value?:any,
  Dimensions?: DadDimension[],
  attribute?:string;
  name?:string;
  op?:MetricOperator
}

export type DadDimensionType = 'Number' | 'String' | 'MiniChart';

export type DadFilterType = 'Number' | 'String';

export type DadAlertType = 'Number' | 'String';

export interface DadDimension{
  Type?: DadDimensionType,
  Name?: string,
  DataSource?: string,
  Value?:any,
  attribute?:string,
  name?:string
}

export interface DadFilter{
  Type?: DadFilterType,
  Name?: string,
  DataSource?: string,
  Value?:any,
  attribute?:any,
  name?:any
}

export interface DadAlert{
  Type?: DadAlertType,
  Name?: string,
  DataSource?: string,
  Value?:any,
  expression?:string,
  name?:string
}

export class DadChart extends DadElement {
  type: string;
  width?: number;
  height?: number;
  mini?: boolean = false;
  big?: boolean = false;
  horizontal?: boolean = false;
  embeddedChart?: boolean = false;
  regionM?: number;
  aname?: String;
  bname?: String;
  action?: String;
  widgetClickChart?: boolean = false;
  drillchart?: any;
}

export class DadUser {
  userid: string;
  username: string;
  tenantid: string;
}
