"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by dister on 5/2/2017.
 */
var core_1 = require('@angular/core');
var sample_charts_1 = require('./sample.charts');
var _ = require("lodash");
var http_1 = require('@angular/http');
var appconfig_1 = require("./appconfig");
var angular2_jwt_1 = require('angular2-jwt');
var DadConfigService = (function () {
    function DadConfigService(http) {
        this.http = http;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        if (appconfig_1.config.testing) {
            this.user = { username: "user", tenantid: "test", userid: "test-user" };
        }
        else {
            var token = localStorage.getItem('id_token');
            var u = this.jwtHelper.decodeToken(token);
            var username = u.username;
            var tenantid = u.tenantId;
            var userid = tenantid + "-" + username;
            this.user = { username: username, tenantid: tenantid, userid: userid };
        }
        localStorage.setItem('daduser', JSON.stringify(this.user));
    }
    DadConfigService.prototype.getUserConfigurationFromDdb = function () {
        //this method will get the current configuration from server and store it in local storage
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var url = appconfig_1.config.dadback_url + "/daduser/" + this.user.userid;
        return this.http.get(url).toPromise();
    };
    DadConfigService.prototype.saveUserConfigurationToDdb = function (data) {
        //this method will save the current configuration in local storage to the server
        var timeStamp = Date.now().toString();
        var charts = data.config.charts;
        var widgets = data.config.widgets;
        var tables = data.config.tables;
        var pages = data.config.pages;
        var config = { timeStamp: timeStamp,
            charts: charts,
            widgets: widgets,
            tables: tables,
            pages: pages };
        var elements = localStorage.getItem("config");
        var daduserconfig = {
            userid: this.user.userid,
            username: this.user.username,
            tenantid: this.user.tenantid,
        };
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var url = config.dadback_url + "/daduser/" + daduserconfig.userid;
        this.http.post(url, daduserconfig).toPromise().then(function (res) {
            console.log('configuration saved' + JSON.stringify(res));
        }).catch(function (error) {
            console.log('configuration failed to save');
        });
    };
    DadConfigService.prototype.clearLocalCopy = function () {
        localStorage.removeItem("elementdata");
    };
    DadConfigService.prototype.save = function (elements) {
        var elements_string = JSON.stringify(elements);
        localStorage.setItem("elementdata", elements_string);
        if (!appconfig_1.config.testing)
            this.saveUserConfigurationToDdb();
    };
    DadConfigService.prototype.saveOne = function (element) {
        var _this = this;
        var elements;
        this.getConfigs().then(function (elements) {
            var chartIndex = _.findIndex(elements, function (w) { return w.id == element.id; });
            if (chartIndex === -1) {
                elements.push(element);
            }
            else {
                elements.splice(chartIndex, 1, element);
            }
            _this.save(elements);
        });
    };
    DadConfigService.prototype.getChartConfigs = function () {
        if (elements_string == null && appconfig_1.config.testing) {
            localStorage.setItem("chartdata", JSON.stringify(sample_charts_1.CHARTS));
            return Promise.resolve(sample_charts_1.CHARTS);
        }
        return Promise.resolve(appconfig_1.config.charts);
    };
    DadConfigService.prototype.getConfigs = function () {
        var _this = this;
        var elements_string = localStorage.getItem("elementdata");
        //cast here
        if (elements_string != null) {
            var elements_obj = JSON.parse(elements_string);
            var DATA = elements_obj;
            return Promise.resolve(DATA);
        }
        else {
            return this.getUserConfigurationFromDdb().then(function (data) {
                var dataObj = JSON.parse(data._body)[0];
                _this.saveConfigFromDb(dataObj);
                var chartsString = localStorage.getItem("config");
                var charts = JSON.parse(chartsString);
                return Promise.resolve(charts);
            }, function (error) {
                console.log(error);
            });
        }
    };
    DadConfigService.prototype.saveConfigFromDb = function (data) {
        var charts = data.config.charts;
        var widgets = data.config.widgets;
        var tables = data.config.tables;
        var pages = data.config.pages;
        //comment: for some reason charts, widgets...etc.. are already JSON...why?
        localStorage.setItem("chartdata", charts);
        localStorage.setItem("widgetdata", widgets);
        localStorage.setItem("tabledata", tables);
        localStorage.setItem("pagedata", pages);
    };
    DadConfigService.prototype.getConfig = function (id) {
        return this.getConfigs().then(function (charts) {
            var chartIndex = _.findIndex(charts, function (w) { return w.id == id; });
            if (chartIndex > -1)
                return Promise.resolve(charts[chartIndex]);
            else
                return Promise.resolve(null);
        });
    };
    DadConfigService = __decorate([
        core_1.Injectable()
    ], DadConfigService);
    return DadConfigService;
}());
exports.DadConfigService = DadConfigService;
