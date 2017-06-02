import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DasMetaDataModelComponent } from './components/models/das-meta-data-model/das-meta-data-model.component';

@NgModule({
  declarations: [
    AppComponent,
    DasMetaDataModelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
