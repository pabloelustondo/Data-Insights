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
var sample_widgets_1 = require("./sample.widgets");
var sample_tables_1 = require("./sample.tables");
var sample_page_1 = require('./sample.page');
var _ = require("lodash");
var http_1 = require('@angular/http');
var appconfig_1 = require("./appconfig");
var angular2_jwt_1 = require('angular2-jwt');
var DadUserConfig = (function () {
    function DadUserConfig(user) {
        this.username = user.username;
        this.tenantid = user.tenantid;
        this.userid = user.userid;
        this.timeStamp = new Date().toDateString();
        this.configs = [];
    }
    DadUserConfig.prototype.addDefaultConfiguration = function () {
        var _this = this;
        alert("A default configuration for tenant " + this.tenantid + " will be created");
        sample_charts_1.CHARTS.forEach(function (e) {
            e.elementType = 'chart';
            _this.configs.push(e);
        });
        sample_widgets_1.WIDGETS.forEach(function (e) {
            e.elementType = 'widget';
            _this.configs.push(e);
        });
        sample_tables_1.TABLES.forEach(function (e) {
            e.elementType = 'table';
            _this.configs.push(e);
        });
        sample_page_1.PAGES.forEach(function (e) {
            e.elementType = 'page';
            _this.configs.push(e);
        });
    };
    return DadUserConfig;
}());
exports.DadUserConfig = DadUserConfig;
var DadConfigService = (function () {
    function DadConfigService(http, activatedRoute) {
        this.http = http;
        this.activatedRoute = activatedRoute;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        this.localkeyPrefix = "userconfig"; //
        this.config = appconfig_1.config;
    }
    DadConfigService.prototype.ngOnInit = function () {
        this.activatedRoute.queryParams.subscribe(function (params) {
            var id_token = params['id_token'];
            localStorage.setItem('id_token', id_token);
            window.location.href = window.location.protocol + '//' + window.location.host;
        });
    };
    DadConfigService.prototype.getUserConfigurationFromDdb = function () {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var url = appconfig_1.config.dadback_url + "/daduser/" + this.user.userid;
        return this.http.get(url).toPromise();
    };
    DadConfigService.prototype.saveUserConfigurationToDdb = function () {
        //this method will save the current configuration in local storage to the server
        if (appconfig_1.config.testing)
            return;
        var daduserconfig = JSON.parse(localStorage.getItem(this.localkey));
        var timeStamp = Date.now().toString();
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var url = appconfig_1.config.dadback_url + "/daduser/" + daduserconfig.userid;
        this.http.post(url, daduserconfig).toPromise().then(function (res) {
            console.log('configuration saved' + JSON.stringify(res));
        }).catch(function (error) {
            alert("Failed to save configuration to database " + error);
            console.log('configuration failed to save');
        });
    };
    /* Everything is same */
    //This is tested and works
    DadConfigService.prototype.resetToDefaultConfiguration = function () {
        var newUserConfig = new DadUserConfig(this.user);
        newUserConfig.addDefaultConfiguration();
        localStorage.setItem(this.localkey, JSON.stringify(newUserConfig));
        this.saveUserConfigurationToDdb();
    };
    DadConfigService.prototype.clearLocalCopy = function () {
        localStorage.removeItem(this.localkey);
    };
    //This is tested and works
    DadConfigService.prototype.saveOne = function (element) {
        this.save([element]);
    };
    DadConfigService.prototype.deleteOne = function (element) {
        if (!this.user)
            this.getUser();
        var daduserconfig = JSON.parse(localStorage.getItem(this.localkey));
        if (!daduserconfig)
            daduserconfig = new DadUserConfig(this.user);
        daduserconfig.configs = daduserconfig.configs.filter(function (config) { return config.id !== element.id; });
        localStorage.setItem(this.localkey, JSON.stringify(daduserconfig));
        this.saveUserConfigurationToDdb();
    };
    //Under test config
    DadConfigService.prototype.save = function (elements) {
        if (!this.user)
            this.getUser();
        var daduserconfig = JSON.parse(localStorage.getItem(this.localkey));
        if (!daduserconfig)
            daduserconfig = new DadUserConfig(this.user);
        var configs = daduserconfig.configs;
        elements.forEach(function (element) {
            var elementIndex = _.findIndex(configs, function (w) { return w.id == element.id; });
            if (elementIndex === -1) {
                configs.push(element);
            }
            else {
                configs.splice(elementIndex, 1, element);
            }
        });
        localStorage.setItem(this.localkey, JSON.stringify(daduserconfig));
        this.saveUserConfigurationToDdb();
    };
    DadConfigService.prototype.getUser = function () {
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
        this.localkey = this.user.tenantid + '_' + this.user.username + '_' + this.localkeyPrefix;
    };
    //next test
    DadConfigService.prototype.getConfig = function () {
        //this method will return the configuration that are expected to be in the local storage.
        //if not we are going to get this from DB. IF we are in test mode we will get it from test data.
        var _this = this;
        if (!this.user)
            this.getUser();
        var userconfigString = localStorage.getItem(this.localkey);
        if (userconfigString != null) {
            var userconfig = JSON.parse(userconfigString);
            return Promise.resolve(userconfig);
        }
        ;
        //at this point we do not have some configuration in local storage so we need to find some in db or create a new
        if (appconfig_1.config.testing) {
            var newUserConfig = new DadUserConfig(this.user);
            newUserConfig.addDefaultConfiguration();
            localStorage.setItem(this.localkey, JSON.stringify(newUserConfig));
            return Promise.resolve(newUserConfig);
        }
        else {
            return this.getUserConfigurationFromDdb().then(function (data) {
                var userConfig = JSON.parse(data._body)[0];
                if (userConfig) {
                    localStorage.setItem(_this.localkey, JSON.stringify(userConfig));
                    return Promise.resolve(userConfig);
                }
                else {
                    //create brand new configuration
                    var newUserConfig = new DadUserConfig(_this.user);
                    newUserConfig.addDefaultConfiguration();
                    localStorage.setItem(_this.localkey, JSON.stringify(newUserConfig));
                    return Promise.resolve(newUserConfig);
                }
            }, function (error) {
                alert("error in getConfig()" + error.toString());
                return Promise.resolve({}); //TO-DO fix this not sure what to do in case of error
            });
        }
    };
    /*This part is created because functions are used in the other components but service will be working under one name
     * since names are casted. DON'T CHANGE!
     */
    DadConfigService.prototype.getChartConfigs = function () {
        return this.getConfig().then(function (config) {
            var charts = _.filter(config.configs, function (config) { return config.elementType == 'chart'; });
            return Promise.resolve(charts);
        });
    };
    DadConfigService.prototype.getWidgetConfigs = function () {
        return this.getConfig().then(function (config) {
            var elements = _.filter(config.configs, function (config) { return config.elementType == 'widget'; });
            return Promise.resolve(elements);
        });
    };
    DadConfigService.prototype.getTableConfigs = function () {
        return this.getConfig().then(function (config) {
            var elements = _.filter(config.configs, function (config) { return config.elementType == 'table'; });
            return Promise.resolve(elements);
        });
    };
    DadConfigService.prototype.getPageConfigs = function () {
        return this.getConfig().then(function (config) {
            var elements = _.filter(config.configs, function (config) { return config.elementType == 'page'; });
            return Promise.resolve(elements);
        });
    };
    DadConfigService.prototype.getChartConfig = function (id) {
        return this.getConfig().then(function (config) {
            var charts = _.filter(config.configs, function (config) { return config.elementType == 'chart' && config.id == id; });
            return Promise.resolve(charts[0]);
        });
    };
    DadConfigService.prototype.getWidgetConfig = function (id) {
        return this.getConfig().then(function (config) {
            var elements = _.filter(config.configs, function (config) { return config.elementType == 'widget' && config.id == id; });
            return Promise.resolve(elements[0]);
        });
    };
    DadConfigService.prototype.getTableConfig = function (id) {
        return this.getConfig().then(function (config) {
            var elements = _.filter(config.configs, function (config) { return config.elementType == 'table' && config.id == id; });
            return Promise.resolve(elements[0]);
        });
    };
    DadConfigService.prototype.getPageConfig = function (id) {
        return this.getConfig().then(function (config) {
            var elements = _.filter(config.configs, function (config) { return config.elementType == 'page' && config.id == id; });
            return Promise.resolve(elements[0]);
        });
    };
    DadConfigService = __decorate([
        core_1.Injectable()
    ], DadConfigService);
    return DadConfigService;
}());
exports.DadConfigService = DadConfigService;
