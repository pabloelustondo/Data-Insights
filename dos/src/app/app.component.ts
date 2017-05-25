import { Component, OnInit } from '@angular/core';
import {DosStatusService} from "./status.service"
import {appconfig}  from "../../appconfig";

@Component({
  selector: 'app-root',
  providers: [ DosStatusService ],
  template: `
        <div style="font-weight: bold; text-align: center;">SOTI Insights Administration and Monitoring Service</div>
        <br/>
        <table>
        <tr>
        <td style="width: 200px"> Service       </td>
        <td style="width: 200px"> Status (comming soon...)   </td>
        <td style="width: 200px"> Go to page or Test </td> 
         <tr *ngFor="let item of statusReport">
         <td>{{item.name}}</td>
         <td>{{item.status}}</td>
         <td><a [href]="item.url + '/test'">{{item.name}}</a></td>
         </tr>
        </table>        
    `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  statusReport: {name:string, url:string, status:string, info:any}[] = [];

  constructor(private dosStatusService: DosStatusService) {}



  isDosService(configItem:string):boolean{
    return (configItem.toString().indexOf("url") > 0) && (configItem.toString().indexOf("mongodb") < 0);
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
