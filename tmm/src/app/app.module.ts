import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { UserInput } from './components/layout/UserInput/UserInput.component';
import {RouterModule} from "@angular/router";


const routes = [
  { path: '**', component: UserInput },
];

@NgModule({
  declarations: [
    AppComponent,
    UserInput
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
