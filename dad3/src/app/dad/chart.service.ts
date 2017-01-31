/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { CHARTS } from './mock.charts';
import { DadChart } from './chart.component';
import { DadWidget } from "./widget.component";
import { DadTable } from "./table.component";
import { WIDGETS } from "./mock.widgets";
import { TABLES } from "./mock.tables";
import * as _ from "lodash";

@Injectable()
export class DadChartConfigsService {

    public clearLocalCopy(){
      localStorage.removeItem("chartdata");
    }

  public save(charts:DadChart[] ){
    let charts_string = JSON.stringify(charts);
    localStorage.setItem("chartdata",charts_string);
  }

    public getChartConfigs(): DadChart[] {

      let charts_string = localStorage.getItem("chartdata");

      if (charts_string != null){
        let charts_obj = JSON.parse(charts_string);
        let DATA = charts_obj as DadChart[];
        return DATA;
      }
      else {
        this.save(CHARTS);
        return CHARTS;
      }
    }

  public getChartConfig(id:string): DadChart {
    let charts = this.getChartConfigs();
    let chartIndex = _.findIndex(charts, function(w) { return w.id == id; });
    return charts[chartIndex];
  }

}

@Injectable()
export class DadWidgetConfigsService {

  public clearLocalCopy(){
    localStorage.removeItem("widgetdata");
}

  public saveOne(widget:DadWidget ){
    let widgets:DadWidget[] = this.getWidgetConfigs();
    let widgetIndex = _.findIndex(widgets, function(w) { return w.id == widget.id; });
    widgets.splice(widgetIndex, 1, widget);
    this.save(widgets);
  }

public save(widgets:DadWidget[] ){
  let widgets_string = JSON.stringify(widgets);
  localStorage.setItem("widgetdata",widgets_string);
}

public getWidgetConfig(id:string): DadWidget {
    let widgets = this.getWidgetConfigs();
    let widgetIndex = _.findIndex(widgets, function(w) { return w.id == id; });
    return widgets[widgetIndex];
}

public getWidgetConfigs(): DadWidget[] {

  let widget_string = localStorage.getItem("widgetdata");

  if (widget_string != null){
    let widget_obj = JSON.parse(widget_string);
    let DATA = widget_obj as DadWidget[];
    return DATA;
  }
  else {
    let widget_string = JSON.stringify(WIDGETS);
    localStorage.setItem("widgetdata",widget_string);
    return WIDGETS;
  }
}
}

@Injectable()
export class DadTableConfigsService {

  public clearLocalCopy(){
    localStorage.removeItem("tabledata");
  }

  public save(tables:DadTable[] ){
    let tables_string = JSON.stringify(tables);
    localStorage.setItem("tabledata",tables_string);
  }

  public getTableConfig(id:string): DadTable {
    let tables = this.getTableConfigs();
    let tableIndex = _.findIndex(tables, function(w) { return w.id == id; });
    return tables[tableIndex];
  }

  public getTableConfigs(): DadTable[] {

    let tables_string = localStorage.getItem("tabledata");

    if (tables_string != null){
      let table_obj = JSON.parse(tables_string);
      let DATA = table_obj as DadTable[];
      return DATA;
    }
    else {
      let tables_string = JSON.stringify(TABLES);
      localStorage.setItem("tabledata",tables_string);
      return TABLES;
    }
  }
}
