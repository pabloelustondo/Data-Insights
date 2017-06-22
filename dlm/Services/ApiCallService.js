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

                    // console.log(body);
                    //

                    //NEED TO INPLEMENT:
                        // when body contains invalid data, for example, api typo
                        // how to fill up newBody
                    var newBody =  {
                        metadata : {
                            "dataSetId" : "nextBus"
                        },
                        data : body
                    };


                    /*
                   var newBody = {
                       metadata : {
                           "dataSetId" : "nextBus"
                       },
                       data :{
                           "vehicle":
                           [{"id":"8179","lon":"-79.361969","routeTag":"502","predictable":"true","dirTag":"502_0_502Bus","heading":"73","lat":"43.656185","secsSinceReport":"7"},
                               {"id":"7913","lon":"-79.570969","routeTag":"49","predictable":"true","dirTag":"49_0_49","heading":"69","lat":"43.633518","secsSinceReport":"15"}],
                           "lastTime":
                               {"time":"1498054374266"},"copyright":"All data copyright Toronto Transit Commission 2017.",
                           "Error":
                               {"content":"last time \"t\" parameter must be specified in query string","shouldRetry":"false"}
                       }
                   }*/


                        if (dataSource) {
                        // received the data source so let's create a request
                        var idaRequest = {
                            expiringToken: dataSource.expiringToken,
                            body: newBody
                        };
                        // make the request
                        IdaCallService.makeIdaCall(idaRequest, next);
                    }
                }
                );
            }
        });
    },

    log: function(req, next) {
      console.log(JSON.stringify(req));
      next();
    }

};


module.exports = ApiCallService;