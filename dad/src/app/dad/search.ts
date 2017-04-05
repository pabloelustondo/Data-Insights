/**
 * Created by dister on 3/2/2017.
 */
import { DadElement } from './dadmodels';
import * as _ from "lodash";

export class DadSearch{
    search(element:DadElement, data:any[]): any[] {
        if(!element.search) return data;

        let result = [];
        data.forEach(function(d){
            let s = JSON.stringify(d);
            if (s.indexOf(element.search) > -1) result.push(d);
        });

        return result;
    }

    readExpression(element:DadElement, data:any[]): any[] {
        if(!element.readExpression) return data;

        let result = [];
        data.forEach(function(d){
            let ss = element.readExpression;
            Object.keys(d).forEach( function(key){
                ss = ss.replace(key, d[key]);
            })
            if (eval(ss)) result.push(d);
        });
        return result;
    }
}