/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { CHARTS } from './mock.charts';
import { DadChart } from './chart.component';
import {DadWidget} from "./widget.component";
import {WIDGETS} from "./mock.widgets";

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
}

@Injectable()
export class DadWidgetConfigsService {

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
