/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { DATA } from './mock.data';

@Injectable()
export class DadChartConfigsService {
    public getChartData(): any {
        return DATA;
    }
}