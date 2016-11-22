import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';

import { DadComponent }   from './dashboard.component';
import { DadChartComponent} from "./chart.component";
import { DadAppComponent }   from './app.component';
import { DadConfigComponent }   from './configuration.component';

@NgModule({
    imports: [ BrowserModule,FormsModule,
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
    declarations: [ DadAppComponent, DadComponent, DadChartComponent, DadConfigComponent ],
    bootstrap:    [ DadAppComponent ]
})
export class AppModule { }

