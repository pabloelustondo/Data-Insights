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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var appconfig_1 = require("./appconfig");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/catch");
var Rx_1 = require("rxjs/Rx");
var DadElementDataService = (function () {
    function DadElementDataService(http, router) {
        this.http = http;
        this.router = router;
    }
    DadElementDataService.prototype.getElementData = function (element) {
        console.log("we got " + appconfig_1.config["oda_dev_url"]);
        var params = new http_1.URLSearchParams();
        var parameters = element.parameters[0];
        for (var param in parameters) {
            console.log("Table:" + element.id + "Mapping Parameter:" + param);
            params.set(param, parameters[param]);
        }
        var endpoint0 = appconfig_1.config[element.endpoint];
        var token = localStorage.getItem('id_token');
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        var data = { metricName: element.metricName, predicates: element.predicates, parameters: element.parameters[0] };
        var findData = function (data) {
            if (element.dataElement)
                return data[element.dataElement];
            return data.data;
        };
        if (appconfig_1.config.testing || appconfig_1.config.oda_url == "")
            return Rx_1.Observable.of(element.data);
        if (endpoint0.method === "post") {
            var bodyString = JSON.stringify(['_body']);
            return this.http.post(endpoint0.url, data, headers)
                .map(function (res) { return findData(res.json()); })["catch"](function (error) { return Rx_1.Observable["throw"](error.json().error || 'Server error'); });
        }
        else {
            return this.http.get(appconfig_1.config[element.endpoint], {
                search: params,
                headers: headers
            })
                .map(function (res) { return findData(res.json()); })["catch"](function (error) { return Rx_1.Observable["throw"](error.json().error || 'Server error'); });
        }
    };
    return DadElementDataService;
}());
DadElementDataService = __decorate([
    core_1.Injectable()
], DadElementDataService);
exports.DadElementDataService = DadElementDataService;
