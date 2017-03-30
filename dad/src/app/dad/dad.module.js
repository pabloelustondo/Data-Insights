"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ng2_charts_1 = require('ng2-charts/ng2-charts');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var chart_component_1 = require("./chart.component");
var widget_component_1 = require("./widget.component");
var configuration_component_1 = require('./configuration.component');
var table_component_1 = require('./table.component');
var login_component_1 = require('./login.component');
var dashboard_component_1 = require('./dashboard.component');
var dad_routing_module_1 = require('./dad-routing.module');
var common_1 = require('@angular/common'); //<-- This one
var ng2_bootstrap_1 = require('ng2-bootstrap');
var datepicker_1 = require('ng2-bootstrap/components/datepicker');
var timepicker_1 = require('ng2-bootstrap/components/timepicker');
var parameters_component_1 = require("./parameters.component");
var bigchart_component_1 = require("./bigchart.component");
var drillcharts_component_1 = require("./drillcharts.component");
var core_2 = require('angular2-google-maps/core');
var map_component_1 = require('./map.component');
var angular2_jwt_1 = require('angular2-jwt');
var auth_guard_1 = require('./common/auth.guard');
var page_component_1 = require("./page.component");
//Local Storage
var LocalStorageServiceConfig = {
    prefix: 'DataAnalytics',
    storageType: 'sessionStorage'
};
var DadModule = (function () {
    function DadModule() {
    }
    DadModule = __decorate([
        core_1.NgModule({
            imports: [
                dad_routing_module_1.DadRoutingModule,
                ng2_charts_1.ChartsModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                router_1.RouterModule,
                ng2_bootstrap_1.DropdownModule,
                datepicker_1.DatepickerModule,
                timepicker_1.TimepickerModule,
                core_2.AgmCoreModule.forRoot({
                    apiKey: 'AIzaSyDK7Z_arQKxXVf0ZiUDl4_yackjHiD9HNA'
                })
            ],
            declarations: [dashboard_component_1.DadComponent, chart_component_1.DadChartComponent, configuration_component_1.DadConfigComponent,
                widget_component_1.DadWidgetComponent, table_component_1.DadTableComponent, parameters_component_1.DadParametersComponent, login_component_1.DadLoginComponent, page_component_1.DadPageComponent, bigchart_component_1.DadBigChartComponent, drillcharts_component_1.DadDrillChartsComponent, map_component_1.DadMap],
            providers: [
                auth_guard_1.AuthGuard
            ].concat(angular2_jwt_1.AUTH_PROVIDERS)
        })
    ], DadModule);
    return DadModule;
}());
exports.DadModule = DadModule;
