import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { DadComponent }   from './dashboard.component';
import { DadChartComponent} from "./chart.component";
import { DadAppComponent }   from './app.component';

@NgModule({
    imports:      [ BrowserModule,FormsModule ],
    declarations: [ DadAppComponent, DadComponent, DadChartComponent ],
    bootstrap:    [ DadAppComponent ]
})
export class AppModule { }

