/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { CHARTS } from './mock.charts';
import { DadChart } from './chart.component';

@Injectable()
export class DadChartConfigsService {

    public getChartConfigs(): DadChart[] {

      let charts_string = localStorage.getItem("data");

      if (charts_string != null){
        let charts_obj = JSON.parse(charts_string);
        let DATA = charts_obj as DadChart[];
        return DATA;
      }
      else {
        let charts_string = JSON.stringify(CHARTS);
        localStorage.setItem("data",charts_string);
        return CHARTS;
      }
    }
}
