import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { DadChartComponent } from "./chart.component";
import { DadWidgetComponent } from "./widget.component";
import { DadConfigComponent } from './configuration.component';
import { DadTableComponent } from './table.component';
import { DadLoginComponent } from './login.component';
import { DadComponent } from './dashboard.component';
import { DadRoutingModule } from './dad-routing.module';
import { CommonModule } from '@angular/common'; //<-- This one
import { DropdownModule } from 'ng2-bootstrap';
import { DatepickerModule } from 'ng2-bootstrap/components/datepicker';
import { TimepickerModule }         from 'ng2-bootstrap/components/timepicker';
import { DadParametersComponent } from "./parameters.component";
import { DadBigChartComponent } from "./bigchart.component";
import { DadDrillChartsComponent } from "./drillcharts.component";
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DadMap } from './map.component';
import { DadMap2 } from './map2.component';

import { AUTH_PROVIDERS } from 'angular2-jwt';
import { AuthGuard } from './common/auth.guard';
import {DadPageComponent} from "./page.component";

//Local Storage
let LocalStorageServiceConfig = {
    prefix: 'DataAnalytics',
    storageType: 'sessionStorage'
};

@NgModule({
    imports: [
        DadRoutingModule,
        ChartsModule,
        CommonModule,
        FormsModule,
        HttpModule,
        RouterModule,
        DropdownModule,
        DatepickerModule,
        TimepickerModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDK7Z_arQKxXVf0ZiUDl4_yackjHiD9HNA'
        })
    ],
    declarations: [ DadComponent, DadChartComponent, DadConfigComponent,
        DadWidgetComponent, DadTableComponent, DadParametersComponent, DadLoginComponent, DadPageComponent, DadBigChartComponent, DadDrillChartsComponent, DadMap, DadMap2],
    providers: [
        AuthGuard, ...AUTH_PROVIDERS
    ]
})
export class DadModule { }
