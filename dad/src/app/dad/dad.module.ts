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
import { DadRoutingModule } from './dad-routing.module';
import { CommonModule } from '@angular/common'; //<-- This one

import {BrowserModule} from "@angular/platform-browser";
import { DropdownModule } from 'ng2-bootstrap';
import { DatepickerModule } from 'ng2-bootstrap/components/datepicker';
import { TimepickerModule }         from 'ng2-bootstrap/components/timepicker';
import { DadParametersComponent } from "./parameters.component";
import { DadBigChartComponent } from "./bigchart.component";
import { DadDrillChartsComponent } from "./drillcharts.component";
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DadMap } from './map.component';
import { DadMap2 } from './map2.component';
import {DadCrudComponent} from './crud.component';

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
            apiKey: 'AIzaSyDFEe9DgsS2r2Bmt-ffYZUjSb2VZNWiGFQ'
        })
    ],
    declarations: [DadChartComponent, DadConfigComponent,
        DadWidgetComponent, DadTableComponent, DadParametersComponent, DadLoginComponent, DadPageComponent, DadBigChartComponent, DadDrillChartsComponent, DadMap, DadMap2, DadCrudComponent],
    providers: [
        AuthGuard, ...AUTH_PROVIDERS
    ]
})
export class DadModule { }
