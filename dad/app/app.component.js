"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by pelustondo on 11/22/2016.
 */
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var DadAppComponent = (function () {
    function DadAppComponent(_router) {
        this._router = _router;
        this.title = 'Data Analytics Dashboard';
        this.router = _router;
    }
    DadAppComponent = __decorate([
        core_1.Component({
            selector: 'dadapp',
            template: "\n    <div>\n    <h1>{{title}}</h1> \n    \n    <a *ngIf=\"this.router.url !== '/config'\"  routerLink=\"/config\">Configuration</a>\n    <a *ngIf=\"this.router.url !== '/'\"  routerLink=\"/\">Dashboard</a>\n    </div>\n    <router-outlet></router-outlet>\n  "
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], DadAppComponent);
    return DadAppComponent;
}());
exports.DadAppComponent = DadAppComponent;
//# sourceMappingURL=app.component.js.map