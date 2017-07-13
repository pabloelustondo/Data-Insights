"use strict";
var rp = require('request-promise');
var _ = require('lodash');
/**
 * Created by pabloelustondo on 2017-06-21.
 */
var SMLI = (function () {
    function SMLI(dataSetProviderlurl) {
        this.dataSetProviderlurl = dataSetProviderlurl;
    }
    SMLI.prototype.calculateDataSet = function (datasetq) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var indatasetq = datasetq.from[0]; //for now..
            _this.inheritParameters(indatasetq.parameters, datasetq.parameters);
            _this.getDataSet(indatasetq).then(function (d) {
                var indataset = d;
                if (datasetq.transformations) {
                    _this.transformDataSet(datasetq, indataset).then(function (data) {
                        resolve(data);
                    }, function (error) {
                        reject(error);
                    });
                }
                else {
                    resolve(indataset);
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    SMLI.prototype.getDataSet = function (dataset) {
        var url = this.dataSetProviderlurl;
        return new Promise(function (resolve, reject) {
            var options = {
                uri: url,
                method: 'POST',
                body: { id: "devstats1" },
                json: true
            };
            rp(options).then(function (result) {
                resolve(result);
            }, function (error) {
                console.log("rp got error" + error);
                reject(error);
            });
        });
    };
    SMLI.prototype.transformDataSet = function (datasetq, indataset) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!datasetq.transformations)
                resolve(indataset);
            var trans = datasetq.transformations[0]; //for now...will take care of rest in a bit
            if (trans.type === "ProcessDataSet") {
                _this.processData(trans, datasetq, indataset).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                });
            }
            else {
                resolve(indataset);
            }
        });
    };
    SMLI.prototype.processData = function (process, datasetq, indataset) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pyTransformation(process.script, datasetq, indataset).then(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    SMLI.prototype.addRowFeature = function (def, feature, data) {
        return new Promise(function (resolve, reject) {
            var ss = feature.script;
            //here we add values from parameters
            def.parameters.forEach(function (param) {
                var value = param.value;
                var regExp = new RegExp(param.name);
                if (typeof value == "number") {
                    ss = ss.replace(regExp, value.toString());
                }
                if (typeof value == "string") {
                    ss = ss.replace(regExp, "\'" + value + "\'");
                }
            });
            //at this points ss still have variables reffering to the row but all parameters are fixed
            data.forEach(function (d) {
                var ss4r; //this expression will be specific for this row
                //here we add values from the record itself
                Object.keys(d).forEach(function (key) {
                    var value = d[key];
                    var regExp = new RegExp(key);
                    if (typeof value == "number") {
                        ss4r = ss.replace(regExp, value.toString());
                    }
                    if (typeof value == "string") {
                        ss4r = ss.replace(regExp, "\'" + value + "\'");
                    }
                });
                var featureValue = eval(ss4r); //we need to secure this..obviously..
                d[feature.name] = featureValue;
                d[feature.name + "_Expression"] = ss4r;
            });
        });
    };
    SMLI.prototype.pyTransformation = function (code, datasetq, indataset) {
        return new Promise(function (resolve, reject) {
            var spawn = require('child_process').spawn;
            //trying to add arguments using a prefix
            /*
    
             start = '2016-08-22'
             end = '2016-08-23'
             */
            var ps = datasetq.parameters;
            var pyparameters = "";
            ps.forEach(function (p) {
                if (p.type == "number") {
                    pyparameters += "    " + p.name + " = " + p.value + "\n";
                }
                if (p.type == "string") {
                    pyparameters += "    " + p.name + " = '" + p.value + "'\n";
                }
            });
            //  let pyparameters = "    " + ps[1].name + " = "+ ps[1].value +"\n    "+ ps[2].name +" = '"+ ps[2].value +"'\n    end = '2016-08-23'\n    shift = 0";
            var arg1 = "def f(data):\n" + pyparameters + code;
            console.log('CODE:' + arg1);
            var shift = 0;
            var threshold = 10;
            var start = '2016-08-22';
            var end = '2016-08-23';
            var json = JSON.stringify({ name: 'pablo', age: 52 });
            var params = ['compute_input.py', arg1, shift, threshold, start, end];
            //     params.push(end);
            var py = spawn('python', params);
            var data = indataset;
            var dataout = '';
            var dataout2;
            py.stdout.on('data', function (data) {
                dataout += data.toString();
            });
            py.stdout.on('end', function () {
                //console.log('INSIDE PROMISE NODE Got End: ' + dataout);
                try {
                    dataout2 = JSON.parse(dataout);
                    resolve(dataout2);
                }
                catch (e) {
                    reject("cannot parse result   " + e);
                }
            });
            py.stdin.write(JSON.stringify(data));
            py.stdin.end();
        });
    };
    SMLI.prototype.inheritParameters = function (specificParameters, generalParameters) {
        generalParameters.forEach(function (gparam) {
            if (!_.find(specificParameters, function (sparam) { sparam.name == gparam.name; })) {
                if (!specificParameters)
                    specificParameters = [];
                specificParameters.push(gparam);
            }
        });
        return specificParameters;
    };
    return SMLI;
}());
exports.SMLI = SMLI;
