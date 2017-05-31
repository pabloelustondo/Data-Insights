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
var core_1 = require('@angular/core');
var data_service_1 = require("./data.service");
var dadconfig_service_1 = require('./dadconfig.service');
var mapper_1 = require("./mapper");
var dadmodels_1 = require("./dadmodels");
var appconfig_1 = require("./appconfig");
(function (DadWidgetType) {
    DadWidgetType[DadWidgetType["OneNumber"] = 0] = "OneNumber";
    DadWidgetType[DadWidgetType["Chart"] = 1] = "Chart";
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
    function DadWidgetComponent(dadWidgetDataService, dadConfigService, router, route) {
        this.dadWidgetDataService = dadWidgetDataService;
        this.dadConfigService = dadConfigService;
        this.router = router;
        this.route = route;
        this.mapper = new mapper_1.Mapper();
        this.editMode = false;
        this.moreDetails = false;
        this.refreshMode = false;
    }
    DadWidgetComponent.prototype.onRefresh = function () {
        if (!this.refreshMode)
            this.refreshMode = true;
        else
            this.refreshMode = false;
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
    DadWidgetComponent.prototype.onRemoveFromPage = function () {
        var new_widgets = [];
        var new_widgetids = [];
        for (var w = 0; w < this.page.widgetids.length; w++) {
            if (this.page.widgetids[w] !== this.widget.id) {
                new_widgetids.push(this.page.widgetids[w]);
                new_widgets.push(this.page.widgets[w]);
            }
        }
        this.page.widgets = new_widgets;
        this.page.widgetids = new_widgetids;
        this.dadConfigService.saveOne(this.page);
    };
    DadWidgetComponent.prototype.onMoreDetails = function (message) {
        if (!this.moreDetails)
            this.moreDetails = true;
        else
            this.moreDetails = false;
    };
    DadWidgetComponent.prototype.onDrill = function (message) {
        //[routerLink]="['drillcharts', widget.drillTo ]"
        this.router.navigate(['drillcharts', this.widget.drillTo], { relativeTo: this.route });
    };
    DadWidgetComponent.prototype.onRawData = function (message) {
        this.router.navigate(['table', this.data[0][this.widget.metrics[0].DataSource], this.widget.id, this.widget.tableId], { relativeTo: this.route });
    };
    DadWidgetComponent.prototype.changeData = function () {
        var _this = this;
        this.dadWidgetDataService.getElementData(this.widget).subscribe(function (data) {
            _this.data = data;
            _this.fixNullsInMetrics();
        });
    };
    DadWidgetComponent.prototype.percentageOfTotal = function () {
        if (this.data[0][this.widget.metrics[0].DataSource] == 0) {
            return 0;
        }
        else {
            var percentage = this.data[0][this.widget.metrics[0].DataSource] / this.data[0][this.widget.metrics[1].DataSource];
            return Math.floor(percentage * 100);
        }
    };
    DadWidgetComponent.prototype.fixNullsInMetrics = function () {
        if (!this.data || !this.widget.metrics)
            return;
        for (var i = 0; i < this.widget.metrics.length; i++)
            if (this.data[0][this.widget.metrics[i].DataSource] === null)
                this.data[0][this.widget.metrics[i].DataSource] = 0;
    };
    DadWidgetComponent.prototype.realDataMonitoring = function () {
        var _this = this;
        if (this.widget.intervalRefreshOption === true) {
            var timeInterval = this.widget.intervalTime;
            this.intervalId = setInterval(function () {
                _this.changeWidgetData();
            }, timeInterval);
        }
    };
    DadWidgetComponent.prototype.onRealDataMonitoring = function () {
        this.widget.intervalRefreshOption = !this.widget.intervalRefreshOption;
        this.realDataMonitoring();
        if (this.widget.intervalRefreshOption === false) {
            this.ngOnDestroy();
        }
    };
    DadWidgetComponent.prototype.ngOnDestroy = function () {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };
    DadWidgetComponent.prototype.changeWidgetData = function () {
        var _this = this;
        this.dadWidgetDataService.getElementData(this.widget).subscribe(function (data) {
            _this.data = data;
        });
    };
    DadWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("Widgets are loading... :" + this.widget.id);
        // this.mapParameters2ui();
        if (!this.data && this.widget.data && appconfig_1.config.testing) {
            this.data = this.widget.data;
        }
        if (!appconfig_1.config.testing) {
            this.dadWidgetDataService.getElementData(this.widget).subscribe(function (data) {
                _this.data = data;
                if (_this.data.errorMessage != null) {
                    alert(_this.data.errorMessage);
                }
                _this.fixNullsInMetrics();
            });
        }
        this.realDataMonitoring();
    };
    __decorate([
        core_1.Input()
    ], DadWidgetComponent.prototype, "widget", void 0);
    __decorate([
        core_1.Input()
    ], DadWidgetComponent.prototype, "page", void 0);
    DadWidgetComponent = __decorate([
        core_1.Component({
            selector: 'dadwidget',
            providers: [data_service_1.DadElementDataService, dadconfig_service_1.DadConfigService],
            template: "   \n\n<div class=\"dadWidget\">\n  <div class=\"col-sm-4 col-lg-3\">  \n     <div class=\"inside\">\n        <div class=\"content card card-inverse card-primary\">\n            <div class=\"card-block pb-0\">\n                <div class=\"btn-group float-xs-right\" dropdown>\n                    <button type=\"button\" class=\"btn btn-transparent dropdown-toggle p-0\" dropdownToggle>\n                        <i class=\"icon-settings\"></i>\n                    </button>   \n\n                    <div class=\"dropdown-menu dropdown-menu-right\" dropdownMenu>\n                        <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onEdit('lalal')\">Edit</div></button>\n                        <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onRawData()\">See raw fact data</div></button>\n                        <button *ngIf=\"widget.type==0 && widget.metrics.length>2\" class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onMoreDetails('lalal')\">More Details</div></button>\n                        <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onRefresh()\">Refresh</div></button>\n                        <button class=\"dropdown-item\" style=\"cursor:pointer;\"> <div (click)=\"onRemoveFromPage('lalal')\">Remove From Page</div></button>            \n                    </div>\n                </div>\n                \n                <label style=\"margin-right: 10px;\" class=\"switch switch-text switch-pill switch-success pull-right pb-1\">\n                    <input type=\"checkbox\" class=\"switch-input\" (click)=\"onRealDataMonitoring()\">\n                    <span class=\"switch-label\" data-on=\"On\" data-off=\"Off\"></span>\n                    <span class=\"switch-handle\"></span>\n                </label>\n \n               <div *ngIf=\"widget.type===0\">\n                <div [id]=\"widget.id + '_0_name'\" class=\"card-title m-l-5\">{{widget.metrics[0].Name}}</div>\n                <h3 id=\"mrbs\" *ngIf=\"data\" class=\"mb-0\">\n                    <div style=\"cursor:pointer;\" *ngIf=\"!(data[0][widget.metrics[0].DataSource]===0)\" (click)=\"onDrill('lalala')\">\n                        <span [id]=\"widget.id + '_0_value'\" style=\"font-size: 7.5vw; color:white;\">{{data[0][widget.metrics[0].DataSource]}} </span>\n                    </div>\n                    <a *ngIf=\"(data[0][widget.metrics[0].DataSource]===0)\">\n                        <span style=\"font-size: 7.5vw; color:white;\">{{data[0][widget.metrics[0].DataSource]}} </span>\n                    </a>\n                    <br/>out of {{data[0][widget.metrics[1].DataSource]}} \n                </h3><br/>\n                <div *ngIf=\"data\" class=\"col-sm-6\">\n                   <progress style=\" display:inline-block; margin-bottom: -.5px; margin-left: -15px;\" class=\"progress progress-xs progress-danger pull-md-left\" value=\"{{data[0][widget.metrics[0].DataSource]}}\" max=\"{{data[0][widget.metrics[1].DataSource]}}\"></progress>                                                          \n                </div>\n                <div *ngIf=\"data\">{{percentageOfTotal()}}%</div>     \n                <br/><br/>\n                <div *ngIf=\"moreDetails && data && widget.metrics.length>2\">\n                    <div>{{widget.metrics[2].Name}}</div> \n                    <div>{{data[0][widget.metrics[2].DataSource]}}</div> \n                    <div class=\"col-sm-6\">\n                       <progress style=\"margin-left:-15px;\" *ngIf=\"data\" class=\"progress progress-xs progress-danger\" value=\"{{data[0][widget.metrics[2].DataSource]}}\" max=\"{{data[0][widget.metrics[1].DataSource]}}\"></progress>\n                    </div><br/>            \n                    <div *ngIf=\"moreDetails && data && widget.metrics.length>3\">\n                        <div>{{widget.metrics[3].Name}}</div> \n                        <div>{{data[0][widget.metrics[3].DataSource]}}</div> \n                        <div class=\"col-sm-6\">\n                            <progress style=\"margin-left:-15px;\" *ngIf=\"data\" class=\"progress progress-xs progress-danger\" value=\"{{data[0][widget.metrics[3].DataSource]}}\" max=\"{{data[0][widget.metrics[1].DataSource]}}\"></progress>\n                        </div><br/>\n                    </div>  \n                    <div *ngIf=\"moreDetails && data\" class=\"col-sm-9 \">\n                        <button (click)=\"onMoreDetails()\" type=\"button\" class=\"btn btn-secondary pull-right\">\n                            <span class=\"glyphicons glyphicons-chevron-up\"></span>                        \n                        </button><br/><br/><br/>\n                    </div>\n                </div> \n                    <dadparameters [element]=\"widget\" [editMode]=\"editMode\" [onRefresh]=\"refreshMode\" (parametersChanged)=\"changeData()\"></dadparameters>   \n                </div>\n\n                <div *ngIf=\"data && widget.type===1\" class=\"card-title m-l-5\">{{widget.name}}</div>\n                <div *ngIf=\"data && widget.type===1\" class=\"content card card-secondary\"> \n                    <div class=\"content card card-secondary\"><br/><br/>\n                        <dadchart [chart]=\"widget.chart\" [data]=\"data\"></dadchart>\n                    </div>\n                </div>  \n                <dadparameters *ngIf=\"data && widget.type===1\" [element]=\"widget\" [editMode]=\"editMode\" [onRefresh]=\"refreshMode\" (parametersChanged)=\"changeData()\"></dadparameters>\n            </div>  \n        </div>\n     </div>\n  </div>\n</div>\n  \n   \n  "
        })
    ], DadWidgetComponent);
    return DadWidgetComponent;
}());
exports.DadWidgetComponent = DadWidgetComponent;
