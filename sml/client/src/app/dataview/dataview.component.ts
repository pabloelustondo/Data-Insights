import { Component, OnInit,OnDestroy } from '@angular/core';
import { ChatService }       from '../chat/chat.service';

@Component({
  selector: 'daddataview',
  template: `
  <h1>DataView</h1>
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
  messages:any[] = [];
  connection;
  message:any;

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
