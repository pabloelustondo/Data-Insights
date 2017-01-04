/**
 * Created by pablo elustondo on 12/7/2016.
 */

import {DadTable} from "./table.component";
import {DadChart} from "./chart.component";


export enum DadTableColumnType {
  Number, String, MiniChart
}

export interface DadTableColumn{
  Type: DadTableColumnType,
  Name: string,
  DataSource: string,
  MiniChart?: DadChart
}
