import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { DadComponent }   from './dashboard.component';
import {DadChartComponent} from "./chart.component";

@NgModule({
    imports:      [ BrowserModule,FormsModule ],
    declarations: [ DadComponent, DadChartComponent ],
    bootstrap:    [ DadComponent ]
})
export class AppModule { }

