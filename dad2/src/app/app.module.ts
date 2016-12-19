import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { DadAppComponent } from './app.component';
import { DadComponent }   from './dashboard.component';
import { DadChartComponent} from "./chart.component";
import { DadWidgetComponent} from "./widget.component";
import {DadConfigComponent}   from './configuration.component';
import { MyDatePickerModule } from 'mydatepicker';
import { DatePickerModule } from 'ng2-datepicker';



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
    MyDatePickerModule,
    DatePickerModule,
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
        component: DadWidgetComponent
      }
    ])
  ],
  declarations: [
    DadAppComponent, DadComponent, DadChartComponent, DadConfigComponent, DadWidgetComponent

  ],
  providers: [],
  bootstrap: [DadAppComponent]
})
export class AppModule { }
