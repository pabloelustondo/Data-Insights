/**
 * Created by dister on 3/17/2017.
 */
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { AgmCoreModule } from 'angular2-google-maps/core';

@Component({
    selector: 'dadmap',
    styleUrls: ['map.component.css'],
    template: `
        <sebm-google-map [latitude]="lat" [longitude]="lng">
        <sebm-google-map-marker [latitude]="lat" [longitude]="lng"></sebm-google-map-marker>
        </sebm-google-map>
    `,
})

export class DadMap{
    title: string = 'Maps';
    lat: number = 51.678418;
    lng: number = 7.809007;
}

