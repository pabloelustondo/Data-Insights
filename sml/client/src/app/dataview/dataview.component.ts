import { Component, OnInit,OnDestroy } from '@angular/core';
import { ChatService }       from '../chat/chat.service';

@Component({
  selector: 'daddataview',
  styles: [`
    .sebm-google-map-container {
       height: 300px;
     }
  `],
  template: `
  <h1>DataView with Map</h1>
  <div *ngIf="messages" style="border:solid">
  <table>
    <tr *ngFor="let message of messages">
      <td>{{message.t}}</td>
      <td>{{message.text}}</td>
      </tr>
   </table>
  </div>
  Map
    <sebm-google-map 
      [latitude]="lat"
      [longitude]="lon"
      [zoom]="zoom"
      [disableDefaultUI]="false"
      [zoomControl]="false"
      (mapClick)="mapClicked($event)">
    
      <sebm-google-map-marker 
          *ngFor="let m of markers; let i = index"
          (markerClick)="clickedMarker(m.label, i)"
          [latitude]="m.lat"
          [longitude]="m.lng"
          [label]="m.label"
          [markerDraggable]="m.draggable"
          (dragEnd)="markerDragEnd(m, $event)">
          
        <sebm-google-map-info-window>
          <strong>InfoWindow content</strong>
        </sebm-google-map-info-window>
        
      </sebm-google-map-marker>
      
      <sebm-google-map-circle [latitude]="lat + 0.3" [longitude]="lng" 
          [radius]="5000"
          [fillColor]="'red'"
          [circleDraggable]="true"
          [editable]="true">
      </sebm-google-map-circle>

    </sebm-google-map>

  `,
  providers: [ChatService]
})
export class DadDataViewComponent implements OnInit, OnDestroy {
  messages:any[] = [];
  connection;
  message:any;
  centerlat:number = 43.6532;
  centerlon:number = 79.3832;
  lat:number = 43.6532;
  lon:number = 79.3832;

  constructor(private chatService:ChatService) {}

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      message.text = JSON.stringify(message.d).substr(0,80);
      this.messages.push(message);
    })
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
