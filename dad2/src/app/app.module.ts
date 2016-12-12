import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { DadAppComponent } from './app.component';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import { DadComponent }   from './dashboard.component';
import { DadChartComponent} from "./chart.component";
import { DadConfigComponent }   from './configuration.component';

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
  declarations: [
    DadAppComponent, DadComponent, DadChartComponent, DadConfigComponent
  ],
  providers: [
    LocalStorageService,
    {
      provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: LocalStorageServiceConfig
    }
  ],
  bootstrap: [DadAppComponent]
})
export class AppModule { }
