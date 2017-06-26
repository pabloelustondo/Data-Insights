/**
 * Created by dister on 6/1/2017.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SmlTenantMetadata = (function () {
    function SmlTenantMetadata() {
    }
    return SmlTenantMetadata;
}());
exports.SmlTenantMetadata = SmlTenantMetadata;
var SmlElement = (function () {
    function SmlElement() {
    }
    return SmlElement;
}());
exports.SmlElement = SmlElement;
var SmlDataSource = (function (_super) {
    __extends(SmlDataSource, _super);
    function SmlDataSource() {
        _super.apply(this, arguments);
    }
    return SmlDataSource;
}(SmlElement));
exports.SmlDataSource = SmlDataSource;
var SmlUsers = (function (_super) {
    __extends(SmlUsers, _super);
    function SmlUsers() {
        _super.apply(this, arguments);
    }
    return SmlUsers;
}(SmlElement));
exports.SmlUsers = SmlUsers;
var SmlIdpInformation = (function (_super) {
    __extends(SmlIdpInformation, _super);
    function SmlIdpInformation() {
        _super.apply(this, arguments);
    }
    return SmlIdpInformation;
}(SmlElement));
exports.SmlIdpInformation = SmlIdpInformation;
var SmlFeature = (function () {
    function SmlFeature() {
    }
    return SmlFeature;
}());
exports.SmlFeature = SmlFeature;
var SmlParameter = (function () {
    function SmlParameter() {
    }
    return SmlParameter;
}());
exports.SmlParameter = SmlParameter;
var SmlDataSetMerge = (function () {
    function SmlDataSetMerge() {
    }
    return SmlDataSetMerge;
}());
exports.SmlDataSetMerge = SmlDataSetMerge;
var SmlDataSet = (function (_super) {
    __extends(SmlDataSet, _super);
    function SmlDataSet() {
        _super.apply(this, arguments);
    }
    return SmlDataSet;
}(SmlElement));
exports.SmlDataSet = SmlDataSet;
