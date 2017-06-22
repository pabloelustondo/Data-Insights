/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { MOCK_WIDGET_DATA } from './sample.data';
import { Headers, Http,URLSearchParams, Response, RequestOptions } from '@angular/http';
import { config } from "./appconfig";
import { DadChart } from './chart.component';
import { DadWidget } from './widget.component';
import { DadTable } from './table.component';
import { DadElement } from "./dadmodels";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Router } from "@angular/router";
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';

@Injectable()
export class DadElementDataService {

    private url = 'http://10.0.91.2:8022';
    private socket;

    constructor(private http: Http, private router: Router) { }

  getElementData(element:DadElement): Observable<any> {
      console.log("we got " + config["oda_dev_url"]);

    let params: URLSearchParams = new URLSearchParams();
    let parameters = element.parameters[0];
    for (let param in parameters){
      console.log("Table:" + element.id + "Mapping Parameter:" + param);
      params.set(param, parameters[param]);
    }
    let endpoint0 = config[element.endpoint];
    let token = localStorage.getItem('id_token');
    let headers = new Headers({ 'Content-Type': 'application/json',  'x-access-token' : token});
    let data = {
        metricName:element.metricName,
        predicates:element.predicates,
        parameters:element.parameters[0],
    };

    if (element.postBody) {
        data['dataSetId'] = element.postBody.dataSetId;
        data['from'] = element.postBody.from;
    }

    let findData = function(data){
        if (element.dataElement) return data.data[element.dataElement];
        return data.data;
      };


      if (config.testing || config.oda_url == "") return Observable.of(element.data);

      if(endpoint0.method === "post"){


          return this.http.post(endpoint0.url, data, headers)
                          .map((res:Response) => findData(res.json()))
                          .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
      }
      else{
          return this.http.get(config[element.endpoint], {
            search:params,
            headers:headers
          })
                          .map((res:Response) => findData(res.json()))
                          .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
      }
  }

    getMessages(dataSetId: any) {
        let observable = new Observable(observer => {
            this.socket = io(this.url);
            this.socket.on('chat message', (data) => {
                // console.log(data[0].data);
                let d = JSON.parse(data[0].data);
                if (d.dataSetId === dataSetId) {
                    observer.next(d.data);
                }
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
}




