/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { MOCK_WIDGET_DATA } from './mock.data';
import { Headers, Http,URLSearchParams, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { config } from "./appconfig";
import { DadChart } from './chart.component';
import { DadWidget } from './widget.component';
import { DadTable } from './table.component';
import { DadElement } from "./dadmodels";
import 'rxjs/add/operator/map';

@Injectable()
export class DadElementDataService {

  constructor(private http: Http) { }

  getElementData(element:DadElement): Promise<any> {
    console.log("we got " + config["oda_dev_url"]);

    let params: URLSearchParams = new URLSearchParams();
    let parameters = element.parameters[0];
    for (let param in parameters){
      console.log("Table:" + element.id + "Mapping Parameter:" + param);
      params.set(param, parameters[param]);
    }
    let endpoint0 = config[element.endpoint];
    let token = localStorage.getItem('id_token');
    let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token': token});
    let data = {metricName:element.metricName, predicates:element.predicates, parameters:element.parameters[0]};

      if(endpoint0.method === "post"){
          return this.http.post(endpoint0.url, data, headers).toPromise().then(
              response => JSON.parse(response['_body'])
          ).catch(
              err =>{
                  console.log("we got " + err.json());
              }
          );
      } else{
            return this.http.get(config[element.endpoint], {search:params} ).toPromise().then(
                response => JSON.parse(response['_body'])
            ).catch(
                err =>{
                    console.log("we got " + err.json());
                }
            );
      }
  }
}




