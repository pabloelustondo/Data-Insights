/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { DATA } from './mock.data';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { config } from "./appconfig";


@Injectable()
export class DadChartDataService {

    constructor(private http: Http) { }

    getChartData(): Promise<any> {
        console.log("we got " + config["oda_dev_url"]);
        return this.http.get("http://34.192.3.52:5495/awstest").toPromise().then(
            response => JSON.parse(response['_body'])
        ).catch(
            err =>{
                console.log("we got " + err.json());
            }
        );
    }
}