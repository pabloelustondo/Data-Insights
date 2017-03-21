"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by dister on 1/12/2017.
 */
var core_1 = require('@angular/core');
var data_service_1 = require("./data.service");
var chart_service_1 = require('./chart.service');
var mapper_1 = require("./mapper");
var dadmodels_1 = require("./dadmodels");
var DadParametersComponent = (function () {
    function DadParametersComponent(dadElementDataService, dadWidgetConfigsService) {
        this.dadElementDataService = dadElementDataService;
        this.dadWidgetConfigsService = dadWidgetConfigsService;
        this.mapper = new mapper_1.Mapper();
        this.dadParameterType = dadmodels_1.DadParameterType;
        this.editMode = false;
        this.refreshMode = false;
        this.parametersChanged = new core_1.EventEmitter();
    }
    Object.defineProperty(DadParametersComponent.prototype, "onRefresh", {
        set: function (value) {
            if (this.element.uiparameters[0].Value) {
                this.mapParameters2model();
                this.mapParameters2ui();
                this.parametersChanged.emit(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    DadParametersComponent.prototype.ngOnInit = function () {
        this.mapParameters2ui();
        this.mapParameters2model();
    };
    DadParametersComponent.prototype.onEdit = function (message) {
        if (!this.editMode)
            this.editMode = true;
        else
            this.editMode = false;
    };
    DadParametersComponent.prototype.onRefreshButton = function () {
        this.onRefresh = true;
    };
    DadParametersComponent.prototype.mapParameters2model = function () {
        //this action will map UI parameters into model parameters back
        var parameters = this.element.parameters[0]; //maybe we need to stop having a list?
        if (!this.element.uiparameters) {
            return;
        }
        for (var _i = 0, _a = this.element.uiparameters; _i < _a.length; _i++) {
            var uiparam = _a[_i];
            if (uiparam.Type === this.dadParameterType.DateTime || uiparam.Type === this.dadParameterType.Date) {
                var datetime = new Date(uiparam.Value['D']);
                var time = uiparam.Value['T'];
                datetime.setUTCHours(time.getUTCHours(), time.getUTCMinutes());
                parameters[uiparam.DataSource] = datetime.toISOString();
            }
            if (uiparam.Type === this.dadParameterType.Number) {
                parameters[uiparam.DataSource] = uiparam.Value;
            }
            if (uiparam.Type === this.dadParameterType.String) {
                parameters[uiparam.DataSource] = uiparam.Value;
            }
            if (uiparam.Type === this.dadParameterType.Duration) {
                parameters[uiparam.DataSource] = this.mapDate2LongDuration(uiparam.Value);
            }
        }
    };
    DadParametersComponent.prototype.mapParameters2ui = function () {
        //this action will map model parameters into UI parameters
        var parameters = this.element.parameters[0]; //maybe we need to stop having a list?
        if (!this.element.uiparameters) {
            return;
        }
        for (var _i = 0, _a = this.element.uiparameters; _i < _a.length; _i++) {
            var uiparam = _a[_i];
            if (uiparam.Type === this.dadParameterType.DateTime || uiparam.Type === this.dadParameterType.Date) {
                var d = void 0;
                if (parameters[uiparam.DataSource + "Auto"] == "yesterday") {
                    var dold = new Date(parameters[uiparam.DataSource]);
                    var hrs = dold.getHours();
                    var mins = dold.getMinutes();
                    var secs = dold.getSeconds();
                    d = new Date();
                    d.setDate(d.getDate() - 1);
                    d.setHours(hrs, mins, secs);
                }
                else {
                    d = new Date(parameters[uiparam.DataSource]);
                }
                var yyyy = d.getFullYear();
                var m = d.getMonth() + 1;
                var day = d.getDate();
                var mm = (m < 10) ? "0" + m : "" + m;
                var dd = (day < 10) ? "0" + day : "" + day;
                uiparam.Value = {};
                uiparam.Value['D'] = yyyy + "-" + mm + "-" + dd;
                uiparam.Value['T'] = d;
            }
            if (uiparam.Type === this.dadParameterType.Number) {
                uiparam.Value = parameters[uiparam.DataSource];
            }
            if (uiparam.Type === this.dadParameterType.String) {
                uiparam.Value = parameters[uiparam.DataSource];
            }
            if (uiparam.Type === this.dadParameterType.Duration) {
                var Iduration = parameters[uiparam.DataSource];
                var Tduration = this.mapLongDuration2Date(Iduration);
                uiparam.Value = Tduration;
            }
        }
    };
    DadParametersComponent.prototype.mapLongDuration2Date = function (duration) {
        var hrs = Math.floor(duration);
        var mins = (duration - hrs) * 60;
        var time = new Date();
        time.setHours(hrs, mins);
        return time;
    };
    DadParametersComponent.prototype.mapDate2LongDuration = function (duration) {
        var hrs = duration.getHours();
        var mins = duration.getMinutes();
        var durationLong = hrs + mins / 60;
        return durationLong;
    };
    DadParametersComponent.prototype.fixDataNulls = function () {
        if (this.data[this.element.metrics[0].DataSource] === null)
            this.data[this.element.metrics[0].DataSource] = 0;
        if (this.data[this.element.metrics[1].DataSource] === null)
            this.data[this.element.metrics[1].DataSource] = 0;
        if (this.data[this.element.metrics[2].DataSource] === null)
            this.data[this.element.metrics[2].DataSource] = 0;
        if (this.data[this.element.metrics[3].DataSource] === null)
            this.data[this.element.metrics[3].DataSource] = 0;
    };
    DadParametersComponent.prototype.addingZero = function (x) {
        return (x < 10) ? "0" + x : "" + x;
    };
    __decorate([
        core_1.Input()
    ], DadParametersComponent.prototype, "element", void 0);
    __decorate([
        core_1.Input()
    ], DadParametersComponent.prototype, "editMode", void 0);
    __decorate([
        core_1.Input()
    ], DadParametersComponent.prototype, "onRefresh", null);
    __decorate([
        core_1.Output()
    ], DadParametersComponent.prototype, "parametersChanged", void 0);
    DadParametersComponent = __decorate([
        core_1.Component({
            selector: 'dadparameters',
            providers: [data_service_1.DadElementDataService, chart_service_1.DadWidgetConfigsService, chart_service_1.DadChartConfigsService],
            template: "\n    <div class=\"row\">\n        <div *ngIf=\"editMode\">          \n            <div *ngFor=\"let uiparam of element.uiparameters\">\n                <div><label>{{uiparam.Name}}</label></div>\n                <div *ngIf=\"uiparam.Type == dadParameterType.Date\">\n                    <input type=\"date\" [(ngModel)]=\"uiparam.Value['D']\"/>       \n                </div>\n               \n                <div *ngIf=\"uiparam.Type == dadParameterType.DateTime\">\n                    <input type=\"date\" [(ngModel)]=\"uiparam.Value['D']\"/>       \n                    <timepicker [(ngModel)]=\"uiparam.Value['T']\" (change)=\"changed()\" [hourStep]=\"hstep\" [minuteStep]=\"mstep\" [showMeridian]=false [readonlyInput]=\"false\"></timepicker>       \n                </div>\n    \n                <div *ngIf=\"uiparam.Type == dadParameterType.Duration\">\n                    <timepicker [(ngModel)]=\"uiparam.Value\" (change)=\"changed()\" [hourStep]=\"hstep\" [minuteStep]=\"mstep\" [showMeridian]=false [readonlyInput]=\"false\"></timepicker>\n                </div>\n                <div *ngIf=\"uiparam.Type == dadParameterType.Number\"><input type=\"number\" min=\"0\" max=\"100\" [(ngModel)]=\"uiparam.Value\" /></div>  \n                <div *ngIf=\"uiparam.Type == dadParameterType.String\"><input type=\"text\" [(ngModel)]=\"uiparam.Value\" /></div>   \n            </div>\n            <!--refresh button here-->\n            <br/>\n            <div class=\"col-md-4 text-center\">\n                <button (click)=\"onRefreshButton()\" style=\" margin-left:-15px;\" type=\"button\" class=\"btn btn-secondary\">\n                    <span class=\"glyphicons glyphicons-refresh\"></span>\n                </button>\n                <br/><br/>\n            </div>\n            <div>\n            <!--This is actually close button-->\n                <div class=\"col-md-4 text-center\">\n                <button (click)=\"onEdit()\" type=\"button\" class=\"btn btn-secondary\">\n                    <span class=\"glyphicons glyphicons-remove\"></span>\n                </button>\n                </div>\n            </div>     \n        </div>\n    </div>      \n      \n    <div class=\"row\">\n        <div *ngIf=\"!editMode\">          \n            <span *ngFor=\"let uiparam of element.uiparameters\">\n                <span *ngIf=\"uiparam.Type == dadParameterType.DateTime\">\n                    {{uiparam.Value['D']  }} {{addingZero(uiparam.Value['T'].getHours())}}:{{addingZero(uiparam.Value['T'].getMinutes())}}                        \n                </span>\n                 <span *ngIf=\"uiparam.Type == dadParameterType.String && uiparam.Value!='custom'\">({{uiparam.Value}})</span> \n            </span>      \n        </div>\n    </div>\n    "
        })
    ], DadParametersComponent);
    return DadParametersComponent;
}());
exports.DadParametersComponent = DadParametersComponent;
