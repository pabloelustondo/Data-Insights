import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { DadComponent } from './dad.component';
import { routing } from './dad.routing';
import { demoChart } from './demoChart';
import { DadChartComponent } from './iChart';
@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [
    DadComponent,
    demoChart,
    DadChartComponent
  ]
})
export default class DadModule {}
