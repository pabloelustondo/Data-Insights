"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var configuration_component_1 = require('./configuration.component');
var login_component_1 = require('./login.component');
var table_component_1 = require('./table.component');
var auth_guard_1 = require('./common/auth.guard');
var page_component_1 = require("./page.component");
var bigchart_component_1 = require("./bigchart.component");
var drillcharts_component_1 = require("./drillcharts.component");
var routes = [
    {
        path: '',
        data: {
            title: ''
        },
        children: [
            {
                path: 'page/:id',
                component: page_component_1.DadPageComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    title: ''
                }
            },
            {
                path: 'conf',
                component: configuration_component_1.DadConfigComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    title: 'Configuration'
                }
            },
            {
                path: 'login',
                component: login_component_1.DadLoginComponent,
                data: {
                    title: 'Configuration'
                }
            },
            {
                path: 'page/:id/table/:count/:id',
                component: table_component_1.DadTableComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    title: 'List of devices'
                }
            },
            {
                path: 'page/:id/bigchart/:id',
                component: bigchart_component_1.DadBigChartComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    title: 'Big Chart'
                }
            },
            {
                path: 'page/:id/drillcharts/:id',
                component: drillcharts_component_1.DadDrillChartsComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    title: 'Drill Charts'
                }
            },
            {
                path: 'page/:id/drillcharts/:id/table/:count/:id/:tableid',
                component: table_component_1.DadTableComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    title: 'Drill Charts Table'
                }
            }
        ]
    },
];
var DadRoutingModule = (function () {
    function DadRoutingModule() {
    }
    DadRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], DadRoutingModule);
    return DadRoutingModule;
}());
exports.DadRoutingModule = DadRoutingModule;
