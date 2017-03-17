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
    {{title}}
        <sebm-google-map [latitude]="lat" [longitude]="lng">
        <sebm-google-map-marker [latitude]="lat" [longitude]="lng"></sebm-google-map-marker>
        </sebm-google-map>
    `,
})

export class DadMap{
    title: string = 'Next Bus Maps';
    lat: number = 43.6532;
    lng: number = -79.3832;
}

