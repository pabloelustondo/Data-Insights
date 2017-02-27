/**
 * Created by dister on 2/24/2017.
 */
import { DadElement } from './dadmodels';
import { DadTable } from './table.component';
import { DadChart } from './chart.component';
import { DadWidget } from './widget.component';
import { DadComponent } from './dashboard.component';

export class DadFilter {
    filter(element:DadElement, data:any[]): any[] {
        if(!element.filter){
            return data;
        }
        let filteredData = _.filter(data, _.matches(element.filter));
            return filteredData;
    }
}



