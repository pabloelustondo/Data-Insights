/**
 * Created by vdave on 3/7/2017.
 */
var IdaCallService = require ('./IdaCallService');
var ManageApiConfigurations = require ('./ManageApiConfigurations');

var request = require('request');
var config = require('./../appconfig.json');


ApiCallService = {
    send: function(req,  next){
        request({
            json: true,
            url : req.attrs.data.url,
            method : req.attrs.data.method
        }, function (error, response, body) {
            if (error) {
                next(new Error('error with api response', error));
            }
            if (body) {
                // Get DataSource's token required for IDA and make the call
                ManageApiConfigurations.getToken( req.attrs.data.dataSourceId, function (err, dataSource) {

                    if (err) {
                        // data Source not found or some other erro
                        return new Error('data source not found');
                    }

                    //validate body
                    //and reformat into newBody
                    var newBody;
                    try{
                        var parseBody = JSON.parse(JSON.stringify(body));

                        if(parseBody && typeof parseBody === "object"){
                            newBody =  {
                                metadata : {
                                    "dataSetId" : dataSource.dataSetId
                                },
                                data : parseBody
                            };
                        }
                    }catch (e){
                        console.log("invalid data format");
                    }


                    if (dataSource) {
                        // received the data source so let's create a request
                        var idaRequest = {
                            expiringToken: dataSource.expiringToken,
                            body: newBody
                        };
                        // make the request
                        IdaCallService.makeIdaCall(idaRequest, next);
                    }
                });
            }
        });
    },

    log: function(req, next) {
      console.log(JSON.stringify(req));
      next();
    }

};

module.exports = ApiCallService;