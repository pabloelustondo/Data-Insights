/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { DATA } from './mock.data';
import { Headers, Http,URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { config } from "./appconfig";
import { DadChart } from './chart.component';

@Injectable()
export class DadChartDataService {

    constructor(private http: Http) { }

    getChartData(chart:DadChart): Promise<any> {
        console.log("we got " + config["oda_dev_url"]);

        let params: URLSearchParams = new URLSearchParams();
        for (let chartparam of chart.parameters){
            if (chartparam.parameterType = "DateRange"){
                console.log("Chart:" + chart.id + " Got DateRange:" + chartparam.dateFrom + ":" + chartparam.dateTo);
            params.set('dateFrom', chartparam.dateFrom);
            params.set('dateTo', chartparam.dateTo);}
        }

        return this.http.get(config.oda_dev_url, {search:params} ).toPromise().then(
            response => JSON.parse(response['_body'])
        ).catch(
            err =>{
                console.log("we got " + err.json());
            }
        );
    }
}