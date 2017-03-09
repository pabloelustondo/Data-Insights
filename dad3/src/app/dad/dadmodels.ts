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
  filter?:any;
  search?:string;
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

export interface DadMetric{
  Type: DadParameterType,
  Name: string,
  DataSource: string,
  Value?:any,
  Dimensions?: DadDimension[],
  attribute?:string;
  name?:string;
  op?:string
}


export enum DadDimensionType {
  Number, String, MiniChart
}

export interface DadDimension{
  Type?: DadDimensionType,
  Name?: string,
  DataSource?: string,
  Value?:any,
  attribute?:string,
  name?:string
}



