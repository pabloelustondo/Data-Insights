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
    _map: any;
    markers: any[]; // Create a marker array to hold your markers
    @Input()

    map: DadChart;
    _data: any[];
    @Input()
    set data(d){
        if (d) {
            this._data = d.columns;
            if (this._map){
                let self = this;
                // reset all markers first
                for (let i =0; i < self.markers.length; i++) {
                    self.markers[i].remove();
                }
                 this._data.forEach( function (x) {
                     let busIcon = L.icon({
                        iconUrl: '../../img/bus_green.png',
                     });

                     // this part draws them again
                     let latLang: any = L.latLng(x[0], x[1]);
                     let oneMarker:any = L.marker(latLang, {
                         icon: busIcon
                     });
                     self.markers.push(oneMarker);

                     oneMarker.addTo(self._map).openPopup();
                 });
            }
          //  this.markerPoints.uptate();

        }
    };

    title: string = 'Next Bus Map 2';

    ngOnInit() {
        let self = this;

        this._map = L.map('mapid').setView([this._data[0][0], this._data[0][1]], 13);
        //map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.

        let tileUrl = 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=a96f5dd5205f4726a660af6e3f7c5c14',
            layer = new L.TileLayer(tileUrl, {maxZoom: 22});

// add the layer to the map
        this._map.addLayer(layer);
        this.markers = [];
        let busIcon = L.icon({
            iconUrl: '../../img/bus_green.png',
        });

        this._data.forEach( function (x) {

            let latLang: any = L.latLng(x[0], x[1]); //create latLang for marker
            // create marker
            let oneMarker:any = L.marker(latLang, {
               icon: busIcon
            });

            //store markers in array
            self.markers.push(oneMarker);

            //draw the point
            oneMarker.addTo(self._map).openPopup();

             /*L.marker([x[0], x[1]], {icon: busIcon}).addTo(self._map)
                .openPopup();*/

            //L.marker(latLang, {icon: busIcon}).addTo(self._map)
            //    .openPopup();

        });
    }
}

