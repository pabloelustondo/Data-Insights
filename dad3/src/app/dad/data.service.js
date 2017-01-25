"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by pabloelustondo on 2016-11-21.
 */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var appconfig_1 = require("./appconfig");
var DadElementDataService = (function () {
    function DadElementDataService(http) {
        this.http = http;
    }
    DadElementDataService.prototype.getElementData = function (element) {
        console.log("we got " + appconfig_1.config["oda_dev_url"]);
        var params = new http_1.URLSearchParams();
        var parameters = element.parameters[0];
        for (var param in parameters) {
            console.log("Table:" + element.id + "Mapping Parameter:" + param);
            params.set(param, parameters[param]);
        }
        // config[chart.endpoint]
        var endpoint0 = appconfig_1.config[element.endpoint];
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var data = { metricName: element.metricName, predicates: element.predicates, parameters: element.parameters[0] };
        if (endpoint0.method === "post") {
            return this.http.post(endpoint0.url, data, headers).toPromise().then(function (response) { return JSON.parse(response['_body']); }).catch(function (err) {
                console.log("we got " + err.json());
            });
        }
        else {
            return this.http.get(appconfig_1.config[element.endpoint], { search: params }).toPromise().then(function (response) { return JSON.parse(response['_body']); }).catch(function (err) {
                console.log("we got " + err.json());
            });
        }
    };
    DadElementDataService = __decorate([
        core_1.Injectable()
    ], DadElementDataService);
    return DadElementDataService;
}());
exports.DadElementDataService = DadElementDataService;
var DadTableDataService = (function () {
    function DadTableDataService(http) {
        this.http = http;
    }
    DadTableDataService.prototype.getTableData = function (table) {
        var params = new http_1.URLSearchParams();
        var tableparameters = table.parameters[0];
        for (var tableparam in tableparameters) {
            params.set(tableparam, tableparameters[tableparam]);
        }
        return this.http.get(appconfig_1.config[table.endpoint], { search: params }).toPromise().then(function (response) { return JSON.parse(response['_body']); }).catch(function (err) {
            console.log("error " + err.json());
        });
    };
    DadTableDataService = __decorate([
        core_1.Injectable()
    ], DadTableDataService);
    return DadTableDataService;
}());
exports.DadTableDataService = DadTableDataService;
