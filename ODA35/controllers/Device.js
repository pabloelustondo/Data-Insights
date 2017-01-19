'use strict';

var url = require('url');


var Device = require('./DeviceService');


module.exports.didNotSurviveShiftList = function didNotSurviveShiftList (req, res, next) {
  Device.didNotSurviveShiftList(req.swagger.params, res, next);
};

module.exports.didNotSurviveShiftSummary = function didNotSurviveShiftSummary (req, res, next) {
  Device.didNotSurviveShiftSummary(req.swagger.params, res, next);
};

module.exports.getDeviceById = function getDeviceById (req, res, next) {
  Device.getDeviceById(req.swagger.params, res, next);
};
