/**
 * Created by pablo elustondo on 12/7/2016.
 */
import {DadChart} from "./chart.component";
import {DadWidget} from "./widget.component";
import {DadTable} from "./table.component";

export class DadElement {
  id: string;
  name?: string;
  data?: any;
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
  metrics?: DadMetric[];
  dimensions?: DadDimension[];
  tableId?: string;
  chart?: DadChart;
  transformation?: any;
  transformations?: any[];
  reduction?:any;
  reductions?:any[];
  newFilter?: any;
  filter?:any;
  filters?: DadFilter[];
  search?:string;
  dataElement?: string;
  intervalTime?: number;
  intervalRefreshOption?: boolean =false;
  readExpression?: any;
}

export class DadDateRange{
  dateFrom: string;
  dateTo:string;
}

export enum DadParameterType {
  Number, String, Date, Time, DateTime, Duration
}

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

export enum DadMetricType {
  Number, String, Date, Time
}


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


export enum DadDimensionType {
  Number, String, MiniChart
}

export enum DadFilterType {
  Number, String
}

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
  attribute?:string,
  name?:string
}



