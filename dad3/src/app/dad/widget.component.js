"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by doga ister on 12/14/2016.
 */
var core_1 = require('@angular/core');
var data_service_1 = require("./data.service");
var chart_service_1 = require('./chart.service');
var mapper_1 = require("./mapper");
var dadmodels_1 = require("./dadmodels");
(function (DadWidgetType) {
    DadWidgetType[DadWidgetType["OneNumber"] = 0] = "OneNumber";
    DadWidgetType[DadWidgetType["Example"] = 1] = "Example";
})(exports.DadWidgetType || (exports.DadWidgetType = {}));
var DadWidgetType = exports.DadWidgetType;
;
var DadWidget = (function (_super) {
    __extends(DadWidget, _super);
    function DadWidget() {
        _super.apply(this, arguments);
    }
    return DadWidget;
}(dadmodels_1.DadElement));
exports.DadWidget = DadWidget;
var DadWidgetComponent = (function () {
    function DadWidgetComponent(dadWidgetDataService, dadWidgetConfigsService) {
        this.dadWidgetDataService = dadWidgetDataService;
        this.dadWidgetConfigsService = dadWidgetConfigsService;
        this.mapper = new mapper_1.Mapper();
        this.dadParameterType = dadmodels_1.DadParameterType;
        this.editMode = false;
        this.moreDetails = false;
    }
    DadWidgetComponent.prototype.onRefresh = function (message) {
        var _this = this;
        this.dadWidgetConfigsService.saveOne(this.widget);
        this.dadWidgetDataService.getElementData(this.widget).then(function (data) {
            _this.data = data.data[0];
            _this.fixNullsInMetrics();
        }).catch(function (err) { return console.log(err.toString()); });
    };
    DadWidgetComponent.prototype.addingZero = function (x) {
        return (x < 10) ? "0" + x : "" + x;
    };
    DadWidgetComponent.prototype.onEdit = function (message) {
        if (!this.editMode)
            this.editMode = true;
        else
            this.editMode = false;
    };
    DadWidgetComponent.prototype.onMoreDetails = function (message) {
        if (!this.moreDetails)
            this.moreDetails = true;
        else
            this.moreDetails = false;
    };
    DadWidgetComponent.prototype.changeData = function (event) {
        var _this = this;
        this.dadWidgetDataService.getElementData(this.widget).then(function (data) {
            _this.data = data.data[0];
            _this.fixNullsInMetrics();
        });
    };
    DadWidgetComponent.prototype.percentageOfTotal = function () {
        if (this.data[this.widget.metrics[0].DataSource] == 0) {
            return 0;
        }
        else {
            var percentage = this.data[this.widget.metrics[0].DataSource] / this.data[this.widget.metrics[1].DataSource];
            return Math.floor(percentage * 100);
        }
    };
    DadWidgetComponent.prototype.fixNullsInMetrics = function () {
        if (!this.data || !this.widget.metrics)
            return;
        for (var i = 0; i < this.widget.metrics.length; i++)
            if (this.data[this.widget.metrics[i].DataSource] === null)
                this.data[this.widget.metrics[i].DataSource] = 0;
    };
    DadWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("Widgets are loading... :" + this.widget.id);
        // this.mapParameters2ui();
        this.dadWidgetDataService.getElementData(this.widget).then(function (data) {
            _this.data = data.data[0];
            _this.fixNullsInMetrics();
        }).catch(function (err) { return console.log(err.toString()); });
    };
    __decorate([
        core_1.Input()
    ], DadWidgetComponent.prototype, "widget", void 0);
    DadWidgetComponent = __decorate([
        core_1.Component({
            selector: 'dadwidget',
            providers: [data_service_1.DadElementDataService, chart_service_1.DadWidgetConfigsService],
            template: " \n  <div *ngIf=\"widget.type==0\"  class=\"col-sm-6 col-lg-3\">  \n  <div class=\"inside\">\n     <div class=\"content card card-inverse card-primary\">\n                <div class=\"card-block pb-0\">\n                    <div class=\"btn-group float-xs-right\" dropdown>\n                        <button type=\"button\" class=\"btn btn-transparent dropdown-toggle p-0\" dropdownToggle>\n                            <i class=\"icon-settings\"></i>\n                        </button>\n                        <div class=\"dropdown-menu dropdown-menu-right\" dropdownMenu>\n                            <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onEdit('lalal')\">Edit</div></button>\n                            <button *ngIf=\"widget.metrics.length>2\" class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onMoreDetails('lalal')\">More Details</div></button>\n                            <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onRefresh('lalal')\">Refresh</div></button>\n                        </div>\n                    </div>\n                    <p>{{widget.metrics[0].Name}}</p>\n                    <h3 *ngIf=\"data\" class=\"mb-0\">\n                    <a [routerLink]=\"['table', data[widget.metrics[0].DataSource],widget.id]\">\n                    <span style=\"font-size: 140px; color:white;\">{{data[widget.metrics[0].DataSource]}} </span>\n                    </a>\n                    <br/>out of {{data[widget.metrics[1].DataSource]}} </h3><br/>\n                    <div *ngIf=\"data\" class=\"col-sm-6\">\n                       <progress style=\" display:inline-block; margin-left:-15px;\" class=\"progress progress-xs progress-danger\" value=\"{{data[widget.metrics[0].DataSource]}}\" max=\"{{data[widget.metrics[1].DataSource]}}\"></progress>                                                          \n                    </div>\n                    <div *ngIf=\"data\">{{percentageOfTotal()}}%</div>     \n                    <br/>\n                    <br/>\n                    \n                    <div *ngIf=\"moreDetails && data && widget.metrics.length>2\">\n                    <div style=\"font-size:15px;\">{{widget.metrics[2].Name}}</div> \n                    <div style=\"font-size:15px;\">{{  data[widget.metrics[2].DataSource] }}</div> \n                    <div class=\"col-sm-6\">\n                           <progress style=\"margin-left:-15px;\" *ngIf=\"data\" class=\"progress progress-xs progress-danger\" value=\"{{data[widget.metrics[2].DataSource]}}\" max=\"{{data[widget.metrics[1].DataSource]}}\"></progress>\n                    </div><br/>\n                    </div>\n                    \n                                      \n                    <!--<p style=\"font-size:12px;\">{{widget.metrics[3].Name}}</p>-->\n                    <div *ngIf=\"moreDetails && data && widget.metrics.length>3\">\n                    <div style=\"font-size:15px;\">{{widget.metrics[3].Name}}</div> \n                    <div style=\"font-size:15px;\">{{  data[widget.metrics[3].DataSource] }}</div> \n                    <div class=\"col-sm-6\">\n                        <progress style=\"margin-left:-15px;\" *ngIf=\"data\" class=\"progress progress-xs progress-danger\" value=\"{{data[widget.metrics[3].DataSource]}}\" max=\"{{data[widget.metrics[1].DataSource]}}\"></progress>\n                    </div><br/><br/><br>\n                    </div>  \n                    \n                    <dadparameters [element]=\"widget\" [editMode]=\"editMode\"></dadparameters>  \n                </div>       \n     </div>\n  </div>     \n    </div>\n    "
        })
    ], DadWidgetComponent);
    return DadWidgetComponent;
}());
exports.DadWidgetComponent = DadWidgetComponent;
