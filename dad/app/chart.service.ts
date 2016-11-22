/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { CHARTS } from './mock.charts';
import { DadChart } from './chart.component';

@Injectable()
export class DadChartConfigsService {
    public getChartConfigs(): DadChart[] {
        return CHARTS;
    }
}