/**
 * Created by dister on 3/17/2017.
 */
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DadChart } from './chart.component';
import { DadMap } from './map.component';

@Component({
    selector: 'dadmap2',
    styleUrls: ['map.component.css'],
    template: `
    {{title}}
    <div *ngIf="_data">
        <sebm-google-map [latitude]="_data[0][0]" [longitude]="_data[0][1]">
        <sebm-google-map-marker *ngFor="let item of _data" [latitude]="item[0]" [longitude]="item[1]"></sebm-google-map-marker>
        </sebm-google-map>
    </div>
    `,
})
export class DadMap2{
    @Input()
    map: DadChart;
    _data: any[];
    @Input()
    set data(d){
        if (d) {
            this._data = d.columns;
        }
    };
    title: string = 'Next Bus Maps 2';

}
