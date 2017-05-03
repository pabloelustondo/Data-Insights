"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by dister on 3/17/2017.
 */
var core_1 = require('@angular/core');
var DadMap2 = (function () {
    function DadMap2() {
        this.title = 'Next Bus Map';
    }
    Object.defineProperty(DadMap2.prototype, "data", {
        set: function (d) {
            if (d) {
                this._data = d.columns;
                if (this._map) {
                    var self_1 = this;
                    // reset all markers first
                    for (var i = 0; i < self_1.markers.length; i++) {
                        self_1.markers[i].remove();
                    }
                    this.onTheMove();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    DadMap2.prototype.onTheMove = function () {
        var self = this;
        var busIcon = L.icon({
            iconUrl: '../../img/bus_green.png',
        });
        this._data.forEach(function (x) {
            var latLang = L.latLng(x[0], x[1]); //create latLang for marker
            // create marker
            var oneMarker = L.marker(latLang, {
                icon: busIcon
            });
            //store markers in array
            self.markers.push(oneMarker);
            //draw the point
            oneMarker.addTo(self._map).openPopup();
        });
    };
    DadMap2.prototype.ngOnInit = function () {
        var self = this;
        this._map = L.map('mapid').setView([this._data[0][0], this._data[0][1]], 13);
        this._map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
        var tileUrl = 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=a96f5dd5205f4726a660af6e3f7c5c14', layer = new L.TileLayer(tileUrl, { maxZoom: 22 });
        // add the layer to the map
        this._map.addLayer(layer);
        this.markers = [];
        this.onTheMove();
    };
    __decorate([
        // Create a marker array to hold your markers
        core_1.Input()
    ], DadMap2.prototype, "map", void 0);
    __decorate([
        core_1.Input()
    ], DadMap2.prototype, "data", null);
    DadMap2 = __decorate([
        core_1.Component({
            selector: 'dadmap2',
            styleUrls: ['map.component.css'],
            template: "\n\n    <div id=\"mapid\"></div>\n\n    ",
        })
    ], DadMap2);
    return DadMap2;
}());
exports.DadMap2 = DadMap2;
