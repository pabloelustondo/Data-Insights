/**
 * Created by dister on 2/24/2017.
 */
import { DadElement } from './dadmodels';
import { DadSearch } from './search';
import * as _ from "lodash";

export class DadFilter {
    filter(element:DadElement, data:any[]): any[] {

        if(!element.filter){
            return data;
        }

        let filteredData = _.filter(data, _.matches(element.filter));


        let search = new DadSearch();
        return search.search(element, filteredData);
    }
}



