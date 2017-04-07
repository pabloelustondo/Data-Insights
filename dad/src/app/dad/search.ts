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
        if(!element.newFilter.readExpression) return data;

        let result = [];
        data.forEach(function(d){
            let ss = element.newFilter.readExpression;
            Object.keys(d).forEach( function(key){
                let value = d[key];
                if(typeof value=="number") {
                    ss = ss.replace(key, value);
                }
                if(typeof value=="string"){
                    ss = ss.replace(key, "\'" + value + "\'");
                }
            })
            if (eval(ss)) result.push(d);
        });
        return result;
    }


    alertExpression(element:DadElement, data:any[]): boolean {
        if(!element.alert.alertExpression) return false;

        let ss = function alertExp(){
            let ds = [];
            let sds = eval("ds.operation")

            let res = sds;
            return ss;
        };


            /*
        let result = [];
        data.forEach(function(d){
            let ss = element.newFilter.readExpression;
            Object.keys(d).forEach( function(key){
                let value = d[key];
                if(typeof value=="number") {
                    ss = ss.replace(key, value);
                }
                if(typeof value=="string"){
                    ss = ss.replace(key, "\'" + value + "\'");
                }
            })
            if (eval(ss)) result.push(d);
        });
        return result;*/
    }
}