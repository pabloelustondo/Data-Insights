'use strict';

exports.didNotSurviveShiftList = function(args, res, next) {
  /**
   * parameters expected in the args:
  * shiftDuration (Float)
  * shiftStartDateTime (Float)
  * minimumBatteryPercentageThreshold (Float)
  * rowsTake (Float)
  * rowsSkip (Float)
  **/
    var examples = {};
  examples['application/json'] = [ {
  "LastBatteryStatus" : "aeiou",
  "DeviceId" : "aeiou",
  "BatteryChargeLevel" : [ "" ]
} ];
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.didNotSurviveShiftSummary = function(args, res, next) {
  /**
   * parameters expected in the args:
  * shiftDuration (Float)
  * shiftStartDateTime (Float)
  * minimumBatteryPercentageThreshold (Float)
  **/
    var examples = {};
  examples['application/json'] = {
  "CountDevicesLastedShift" : 123456789,
  "CountTotalActiveDevices" : 123456789,
  "CountDevicesNotLastedShift" : 123456789,
  "CountDevicesChargingEntireShift" : 123456789
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.getDeviceById = function(args, res, next) {
  /**
   * parameters expected in the args:
  * deviceId (Long)
  **/
    var examples = {};
  examples['application/json'] = {
  "LastBatteryStatus" : "aeiou",
  "DeviceId" : "aeiou",
  "BatteryChargeLevel" : [ "" ]
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

