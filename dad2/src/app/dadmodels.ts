/**
 * Created by pablo elustondo on 12/7/2016.
 */
import {DadChart} from "./chart.component";
import {DadWidget} from "./widget.component";

export class DadDateRange{
  dateFrom: string;
  dateTo:string;
}

export enum DadParameterType {
  Number, String, Date, Time
}

export interface DadParameter{
  Type: DadParameterType,
  Name: string,
  DataSource: string,
  Value?:any
}

export enum DadMetricType {
  Number, String, Date, Time
}

export interface DadMetric{
  Type: DadParameterType,
  Name: string,
  DataSource: string,
  Value?:any,
  Dimensions: DadDimension[]
}


export enum DadDimensionType {
  Number, String, MiniChart
}

export interface DadDimension{
  Type: DadDimensionType,
  Name: string,
  DataSource: string,
  Value?:any
}



