import {NgModule} from '@angular/core';
import {ClientAppComponent} from './client.component';
import {ChatComponent} from './chat/chat.component';
import {DadDataViewComponent} from './dataview/dataview.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule}   from '@angular/router';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [ClientAppComponent, ChatComponent, DadDataViewComponent],
  bootstrap: [ClientAppComponent],
  imports: [BrowserModule, FormsModule,
    AgmCoreModule.forRoot({
    apiKey: 'AIzaSyDK7Z_arQKxXVf0ZiUDl4_yackjHiD9HNA'
  }),
    RouterModule.forRoot([
    {
      path: '',
      component: DadDataViewComponent
    },
      {
        path: 'messages',
        component: ChatComponent
      }
  ])]
})
export class AppModule {}
