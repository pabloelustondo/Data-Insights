/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { Injectable } from '@angular/core';
import { DATA } from './mock.data';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class DadChartDataService {

    constructor(private http: Http) { }

    /*
     getChartData(): any {
     return DATA;
     }
     return this.http.get(this.heroesUrl)
     .toPromise()
     .then(response => response.json().data as Hero[])
     .catch(this.handleError);


     */

    getChartData(): Promise<any> {

        return this.http.get("http://localhost:3002/awstest").toPromise().then(
            response => JSON.parse(response['_body'])
        ).catch(
            err =>{
                console.log("we got " + err.json());
            }
        );

     //   return Promise.resolve(DATA);
    }

}