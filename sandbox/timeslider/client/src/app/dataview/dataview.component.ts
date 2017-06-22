import { Component, OnInit,OnDestroy } from '@angular/core';
import { ChatService }       from '../chat/chat.service';
import {DadElement, DadDataView} from './sml_dad'
import { dataViewConfig } from "./dataviewconfig"
import { AgmCoreModule } from '@agm/core';


@Component({
  selector: 'daddataview',
  styleUrls: ['map.component.css'],
  template: `
  <h1>DataView</h1>
  Monitor ON: <input [(ngModel)]="monitor"  (change)="updateMonitor()" type="checkbox">
  
  <input [(ngModel)]="slider" id="test" type="range" (change)="sliderChange()"/>
  
  <h2 *ngIf="messages">{{messages.length}} - {{slider}}</h2>
  <h2 *ngIf="message">Current: {{message.text}}</h2>
 
  
  <div *ngIf="messages" style="border:solid">
  <table>
    <tr *ngFor="let message of messages">
      <td>{{message.t}}</td>
      <td>{{message.text}}</td>
      </tr>
   </table>
  </div>
  `,
  providers: [ChatService]
})
export class DadDataViewComponent implements OnInit, OnDestroy {
  monitor:boolean = false;
  messages:any[] = [];
  connection;
  message:any;
  config:DadDataView = dataViewConfig;
  slider = 0;

  TorontoLatitude: 43.7001100;
  TorontoLongitude: 79.4163000;

  centerlon:number = this.TorontoLongitude;
  centerlat:number = this.TorontoLatitude;
  lon:number = this.TorontoLongitude;
  lat:number = this.TorontoLatitude;

  constructor(private chatService:ChatService) {}

  updateMonitor(){
    if (this.monitor) this.monitorOn();
    else this.monitorOff();

    this.message = this.messages[this.slider];
  }

  monitorOn(){
    this.messages = [];
    this.slider = 0;
    this.connection = this.chatService.getMessages().subscribe(message => {
      if (message.data){
        message.data.forEach((data) =>{
          message.text = JSON.stringify(data).substr(0,80);
          this.messages.unshift(message);
          this.message = message;
        });
        while (this.messages.length > dataViewConfig.timeWindow){ this.messages.pop(); }
      }else {
        this.messages.push({error:"record with no data"});
      }
    })
  }

  sliderChange(){
    this.monitor = false;
    this.monitorOff();
    this.message = this.messages[0]
    console.log(this.message[0]);
  }

  monitorOff() {
    this.connection.unsubscribe();
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
