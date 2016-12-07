import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { DadAppComponent } from './app.component';

import { DadComponent }   from './dashboard.component';
import { DadChartComponent} from "./chart.component";
import { DadConfigComponent }   from './configuration.component';


@NgModule({
  declarations: [
    DadAppComponent, DadComponent, DadChartComponent, DadConfigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path:'',
        component: DadComponent
      },
      {
        path:'config',
        component: DadConfigComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [DadAppComponent]
})
export class AppModule { }
