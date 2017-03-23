/**
 * Created by dister on 3/17/2017.
 */
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
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
    <div id="mapid"></div>

    `,
})
export class DadMap2 implements OnInit {

   @Input()
    map: DadChart;
    _data: any[];
    @Input()
    set data(d){
        if (d) {
            this._data = d.columns;
        }
    };

    title: string = 'Next Bus Map 2';

    ngOnInit() {
        let map = L.map('mapid').setView([this._data[0][0], this._data[0][1]], 13);
        map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.

        let tileUrl = 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=a96f5dd5205f4726a660af6e3f7c5c14',
            layer = new L.TileLayer(tileUrl, {maxZoom: 22});

// add the layer to the map
        map.addLayer(layer);

        let busIcon = L.icon({
            iconUrl: '../../img/bus_green.png',
        });

        this._data.forEach( function (x) {
            L.marker([x[0], x[1]], {icon: busIcon}).addTo(map)
                .openPopup();
        });
    }
}

