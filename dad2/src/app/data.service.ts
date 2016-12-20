/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { DATA } from './mock.data';
import { Headers, Http,URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { config } from "./appconfig";
import { DadChart } from './chart.component';
import { DadWidget } from './widget.component';
import { DadTable } from './table.component';


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
// config[chart.endpoint]
        return this.http.get(config[chart.endpoint], {search:params} ).toPromise().then(
            response => JSON.parse(response['_body'])
        ).catch(
            err =>{
                console.log("we got " + err.json());
            }
        );
    }
}

@Injectable()
export class DadWidgetDataService {

  constructor(private http: Http) { }

  getWidgetData(widget:DadWidget): Promise<any> {
    console.log("we got " + config["oda_dev_url"]);

    let params: URLSearchParams = new URLSearchParams();
    let tableparameters = widget.parameters[0];
    for (let tableparam in tableparameters){
      console.log("Table:" + widget.id + "Mapping Parameter:" + tableparam);
      params.set(tableparam, tableparameters[tableparam]);
    }
// config[chart.endpoint]
    return this.http.get(config[widget.endpoint], {search:params} ).toPromise().then(
      response => JSON.parse(response['_body'])
    ).catch(
      err =>{
        console.log("we got " + err.json());
      }
    );
  }
}

@Injectable()
export class DadTableDataService {

  constructor(private http: Http) { }

  getTableData(table:DadTable): Promise<any> {

    let params: URLSearchParams = new URLSearchParams();
    let tableparameters = table.parameters[0];
    for (let tableparam in tableparameters){
        console.log("Table:" + table.id + "Mapping Parameter:" + tableparam);
        params.set(tableparam, tableparameters[tableparam]);
    }

    return this.http.get(config[table.endpoint], {search:params} ).toPromise().then(
      response => JSON.parse(response['_body'])
    ).catch(
      err =>{
        console.log("error " + err.json());
      }
    );
  }
}

