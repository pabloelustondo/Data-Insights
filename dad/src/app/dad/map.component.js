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
var DadMap = (function () {
    function DadMap() {
        this.title = 'Next Bus Maps';
    }
    Object.defineProperty(DadMap.prototype, "data", {
        set: function (d) {
            if (d) {
                this._data = d.columns;
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    __decorate([
        core_1.Input()
    ], DadMap.prototype, "map", void 0);
    __decorate([
        core_1.Input()
    ], DadMap.prototype, "data", null);
    DadMap = __decorate([
        core_1.Component({
            selector: 'dadmap',
            styleUrls: ['map.component.css'],
            template: "\n    {{title}}\n    <div *ngIf=\"_data\">\n        <sebm-google-map [latitude]=\"_data[0][0]\" [longitude]=\"_data[0][1]\">\n        <sebm-google-map-marker [iconUrl]=\"'../../img/bus_green.png'\" *ngFor=\"let item of _data\" [latitude]=\"item[0]\" [longitude]=\"item[1]\"></sebm-google-map-marker>\n        </sebm-google-map>\n    </div>\n    ",
        })
    ], DadMap);
    return DadMap;
}());
exports.DadMap = DadMap;
