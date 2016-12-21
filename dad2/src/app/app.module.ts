import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { DadAppComponent } from './app.component';
import { DadComponent }   from './dashboard.component';
import { DadChartComponent } from "./chart.component";
import { DadWidgetComponent } from "./widget.component";
import { DadConfigComponent }   from './configuration.component';
import { DadTableComponent }   from './table.component';
import { DatePickerModule } from 'ng2-datepicker';
import { DateTimePickerModule } from 'ng2-date-time-picker';
import {DropDown} from "./NumberDropDown";
import {SelectModule} from "angular2-select";

//Local Storage
let LocalStorageServiceConfig = {
  prefix: 'DataAnalytics',
  storageType: 'sessionStorage'
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DateTimePickerModule,
    DatePickerModule,
    SelectModule,
    RouterModule.forRoot([
      {
        path:'',
        component: DadComponent
      },
      {
        path:'config',
        component: DadConfigComponent
      },
      {
        path:'table',
        component: DadTableComponent
      }
    ])
  ],
  declarations: [
    DadAppComponent, DadComponent, DadChartComponent, DadConfigComponent, DadWidgetComponent, DadTableComponent, DropDown

  ],
  providers: [],
  bootstrap: [DadAppComponent]
})
export class AppModule { }
