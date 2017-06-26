//import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class ChatService {
  private url = 'http://localhost:5000';
  private socket;

  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  getMessages():any {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        console.log("got message");
        observer.next(data);
      });
      this.socket.on('history', (data) => {
        console.log("got history");
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
