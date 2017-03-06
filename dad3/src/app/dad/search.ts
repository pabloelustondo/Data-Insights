/**
 * Created by dister on 3/2/2017.
 */
import { DadElement } from './dadmodels';
import * as _ from "lodash";

export class DadSearch{
    search(element:DadElement, data:any[]): any[] {
        if(!element.search){
            return data;
        }
    }
}