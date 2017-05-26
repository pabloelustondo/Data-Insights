import { Component, OnInit } from '@angular/core';
import {DosStatusService} from "./status.service"
import {appconfig}  from "../../appconfig";

@Component({
  selector: 'app-root',
  providers: [ DosStatusService ],
  template: `
<span class="base">
        <div style="font-weight: bold; text-align: center;">SOTI Insights Administration and Monitoring Service</div>
        <br/>
        <table style="font-weight: bold;  margin: auto;">
        <tr>
        <td > Status   </td>
          <td > &nbsp; &nbsp;  </td>
        <td > Service   </td>
         <tr  *ngFor="let item of statusReport">
         <td [class]="item.status" >{{item.status}}</td>
           <td > &nbsp; &nbsp;  </td>
         <td ><a [href]="item.url + '/test'">{{item.name}}</a></td>
         </tr>
        </table> 
</span>
    `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  statusReport: {name:string, url:string, status:string, info:any}[] = [];

  constructor(private dosStatusService: DosStatusService) {}

  ngOnInit(){

    this.statusReport = [];
         // dasService is just a url for now

        this.dosStatusService.getStatus().subscribe( (statusReport) => {
          this.statusReport = JSON.parse(statusReport._body);
        }, (error) => {
          this.statusReport = [];
        });
  }

}
