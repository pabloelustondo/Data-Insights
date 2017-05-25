import { Component, OnInit } from '@angular/core';
import {DosStatusService} from "./status.service"
import {appconfig}  from "../../appconfig";

@Component({
  selector: 'app-root',
  providers: [ DosStatusService ],
  template: `
        <div>SOTI Insights Administration and Monitoring Service</div>
        <table>
        <tr><td>Service</td><td>Status</td><td>Go 2 BDD Test</td><td>Go 2 Page</td></tr>    
         <tr *ngFor="let item of statusReport">
         <td>{{item.name}}</td>
         <td>{{item.status}}</td>
         <td><a [href]="item.url + '/e2etest'">{{item.name}}</a></td>
         <td><a [href]="item.url">{{item.name}}</a></td>
         </tr>
        </table>        
    `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  statusReport: {name:string, url:string, status:string, info:any}[] = [];

  constructor(private dosStatusService: DosStatusService) {}



  isDosService(configItem:string):boolean{
    return configItem.toString().indexOf("url") > 0;
  }

  dasServicesList(appconfig:any): {name:string, url:string}[] {
    let servicekeys = Object.keys(appconfig).filter((key) => this.isDosService(key));
    let services = [];
    servicekeys.forEach((key) => {services.push({name:this.dasServiceName(key), url:appconfig[key]})})
    return services;
  }

  dasServiceName(dasServiceKey:string):string{
    return dasServiceKey.replace("_url","");
  }

  ngOnInit(){

    let dasServiceList = this.dasServicesList(appconfig);

    dasServiceList.forEach( (dasService) => {

      this.statusReport = [];
         // dasService is just a url for now
        this.dosStatusService.getStatus(dasService.url).subscribe( (status) => {

          this.statusReport.push({name:dasService.name, status:"up", url:dasService.url, info:status});
        }, (error) => {
          this.statusReport.push({name:dasService.name, status:"down", url:dasService.url, info:status});
        });
      });
  }

}
