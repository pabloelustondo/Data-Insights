var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    appconfig  = require('./appconfig'),
    jwt     = require('jsonwebtoken');

var  ErrorMsg = require('./error-messages');
var querystring = require('querystring');
var https = require('https');
var uuid = require('node-uuid');

var request = require('request');
var LocalStorage = require('node-localstorage').LocalStorage;
var NextBusHelper = require ('./DataSourceHelpers/NextBusHelper');
localStorage = new LocalStorage('./temp');

var app = module.exports = express.Router();

var SotiAdminAccount =
  {
    accountid: "test",
    mcurl: "http://localhost:3004",
    apikey:"112233445511223344",
    domainid: "test",
    username: "admin",
    tenantId: "test",
    companyname: "test",
    companyaddress: "companyAddress",
    companyphone: "4161111999"
  };

var MyMCAccount =
  {
    accountid: "pablo.elustonso@gmail.com",
    mcurl: "https://cad059.corp.soti.net/MobiControl",
    apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0",
    apikey2:"NmExMDY5ODhiODFjNDM0OTllYTA0ZTk2OTQzZTA1YzE6ZGFkc2VjcmV0",
    clientId2:"6a106988b81c43499ea04e96943e05c1",
    domainid: "pme",
    tenantid: "pme",
    username: "Administrator"
  };

var enrollments = [SotiAdminAccount, MyMCAccount];

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: config['agentPermTokenExpiryTime'] });
}

function readToken(token, callback) {  //Bearer
  try{
    jwt.verify(token, config.secret,callback);

  } catch(e){
    console.log(e);
  }
}

app.get('/api/enrollments', function(req, res){
  res.status(200).send(enrollments);


});

app.get('/enrollments2', function(req, res) {
  var d = new Date();
  res.status(200).send('Hi from the DSS Anonymous Route at + ' + d.toISOString());


});

app.post('/resetCredentials/:agentId', function (req, res) {

  var _header = req.body.headers;
  var _token = _header['x-access-token'];
  var agentId = req.params.agentId;
  var token = _token[0];
  try{
    jwt.verify(token, config.secret, function (err, success) {
      if (err) {
        return res.status(400).send (ErrorMsg.token_verification_failed);
      }
      if (success) {
        var newActivationKey = uuid.v4();
        request({
          rejectUnauthorized: false,
          url: appconfig.ddb_url + "/updateDataSourceCredentials",
          method: 'post', //Specify the method
          headers: { //We can define headers too
            'Content-Type': 'application/json'
          },
          json : {
            'agentId' : agentId,
            'activationKey': newActivationKey
          }
        }, function(error, response, body){
          if(error) {
            console.log(error);
            res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
          } else {
            console.log(response.statusCode, body);

            if (response.statusCode === 200){

              res.status(200).send({
                message: "Success fully reset"
              });

            } else if (response.statusCode === 404) {
              res.status(404).send(ErrorMsg.token_verification_failed);
            }
            else {
              res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
            }
          }
        });

      }
    });
  }
  catch (e) {
      console.log(e);
      return res.status(400).send (ErrorMsg.token_verification_failed);
    }
});


app.get('/getAgentToken', function(req, res) {
  var _header = req.headers;
  var token = _header['x-access-token'];

  if(!token){
    return res.status(400).send ( ErrorMsg.login_failed_authentication);
  }

  try{
    jwt.verify(token, config.secret, function (err, success) {
      if (err) {
        return res.status(400).send (ErrorMsg.token_verification_failed);
      }
      if (success) {
        var _tenantID = success.tenantId;
        var _agentID = success.agentId;
        var _activationKey = success.activationKey;

        request({
          rejectUnauthorized: false,
          url: appconfig.ddb_url + "/verifyDataSource",
          method: 'GET', //Specify the method
          headers: { //We can define headers too
            'Content-Type': 'application/json'
          },
          qs: {tenantId:_tenantID, agentId : _agentID, activationKeys: _activationKey }
        }, function(error, response, body){
          if(error) {
            console.log(error);
            res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
          } else {
            console.log(response.statusCode, body);

            if (response.statusCode === 200){

              var body = JSON.parse(response.body);
              if (body.activationKey === _activationKey) {
                var new_token = jwt.sign({
                  agentid: body.agentId,
                  tenantid: _tenantID
                }, config.expiringSecret, {expiresIn: config.tempTokenExpiryTime});
                console.log(new_token);
                res.status(200).send({
                  session_token: new_token
                });
              } else {
                res.status(404).send(ErrorMsg.token_activationKey_failed)
              }

            } else if (response.statusCode === 404) {
              res.status(404).send(ErrorMsg.token_verification_failed);
            }
            else {
              res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
            }
          }
        });

      }
    });

  }
  catch (e) {
    console.log(e);
    return res.status(400).send (ErrorMsg.token_verification_failed);
  }
});

app.get('/sourceCredentials/:agentId', function (req, res) {
  var _header = req.headers;
  var agentId = req.params.agentId;
  var token = _header['x-access-token'];


  try{
    jwt.verify(token, config.secret, function (err, success) {
      if (err) {
        return res.status(400).send (ErrorMsg.token_verification_failed);
      }
      if (success) {
        request({
          rejectUnauthorized: false,
          url: appconfig.ddb_url + "/dataSource/"+ agentId,
          method: 'GET', //Specify the method
          headers: { //We can define headers too
            'Content-Type': 'application/json'
          }
        }, function(error, response, body){
          if(error) {
            console.log(error);
            res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
          } else {
            console.log(response.statusCode, body);

            if (response.statusCode === 200){

              tokenpayload = {};

              var body = JSON.parse(response.body);

              tokenpayload.accountId =  success.accountid;
              tokenpayload.tenantId =  success.tenantId;
              tokenpayload.agentId = agentId;
              tokenpayload.activationKey =  body[0].activationKey;

              var _token = createToken(tokenpayload);

              res.status(200).send(_token);

            } else if (response.statusCode === 404) {
              res.status(404).send(ErrorMsg.token_verification_failed);
            }
            else {
              res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
            }
          }
        });

      }
    });

  }
  catch (e) {
    console.log(e);
    return res.status(400).send (ErrorMsg.token_verification_failed);
  }
});

function enrollDlmDataSource (dataSource, callback){

  var tempToken = jwt.sign({
    agentid: dataSource.agentId,
    tenantid:  dataSource.tenantId
  }, config.expiringSecret, {expiresIn: config.tempTokenExpiryTime});
  // map UI input to server input
  var data = {
    dataSourceId : dataSource.agentId,
    method : 'GET',
    url : dataSource.dataSourceData[1].inputValue,
    expiringToken : tempToken,
    name : dataSource.dataSourceData[0].inputValue,
    interval : dataSource.dataSourceData[2].inputValue,
    tenantId : dataSource.tenantId,
    status : 'active'
  };

  request({ rejectUnauthorized: false,
    url: config.dlmEndpointUrl + "/newUrlConfig",
    json : data,
    method: 'POST', //Specify the method
    headers: { //We can define headers too
    'Content-Type': 'application/json'
  }
}, function(error, response, body) {
      if (error) {
        console.log(error);
        callback({
          status: 400,
          message : ErrorMsg.dlm_generic_error
        });
       //  res.status(400).send(ErrorMsg.dlm_generic_error);
      } else {
        console.log(response.statusCode, body);
        if (response.statusCode === 200) {
          registerDataSourceHelper(dataSource, callback)
        } else {
          callback({
            status: 400,
            message : ErrorMsg.mcurl_enrollement_failed_authentication
          });
          // res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
        }
      }
    }
  );
}


function registerDataSourceHelper (dataSource, callback) {

  request({
    rejectUnauthorized: false,
    url: appconfig.ddb_url + "/insertNewDataSource",
    json : dataSource,
    method: 'POST', //Specify the method
    headers: { //We can define headers too
      'Content-Type': 'application/json'
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
      // res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
      var e = {
        status : 400,
        message : ErrorMsg.mcurl_enrollement_failed_url_not_reachable
      };
      callback(e, null);
    } else {
      console.log(response.statusCode, body);

      if (response.statusCode === 200){
        callback(null, {
          status: 200,
          message: 'added successfully'
        });

      } else {

        callback({
          status : 400,
          message : ErrorMsg.mcurl_enrollement_failed_authentication
        }, null);
      }
    }
  });

}
app.post('/registerDataSource', function (req, res) {

  // determine data source type

  var dataSourceType = req.body.dataSourceType;
  var dataSourceData = req.body.data;

  // map data Source properties to data

  if (!req.body.agentid) {
    return res.status(400).send( ErrorMsg.missing_apikey );
  }
  if (!req.body.tenantid) {
    return res.status(400).send( ErrorMsg.missing_domainid );
  }
  if (!req.body.dataSourceType) {
    return res.status(400).send( ErrorMsg.missing_dataSourceType );
  }


  var activationKey = uuid.v4();
  var dataSource = {
    tenantId: req.body.tenantid,
    agentId: uuid.v4(),
    dataSourceType : dataSourceType,
    dataSourceData : dataSourceData,
    mcurl: req.body.mcurl,
    activationKey: activationKey,
    status : 'active'
  };

  if (dataSourceType === 'NextBus'){
    enrollDlmDataSource(dataSource, function (err, result){
        if (err){
          res.status(err.status).send(err.message);
        }
        if (result) {
          res.status(result.status).send(result.message);
        }
      });
  }
  else {
    registerDataSourceHelper(dataSource, function (err, result){
      if (err){
        res.status(err.status).send(err.message);
      }
      if (result) {
        res.status(result.status).send(result.message);
      }
    });
  }

});

app.get('/getDataSources', function(req, res) {
   var _header = req.headers;
   var token = _header['x-access-token'];

   if(!token){
     return res.status(400).send ( ErrorMsg.login_failed_authentication);
   }

   try{
     jwt.verify(token, config.secret, function (err, success) {
       if (err) {
         return res.status(400).send (ErrorMsg.token_verification_failed);
       }
       if (success) {
         var _tenantID = success.tenantId;

         request({
           rejectUnauthorized: false,
           rejectUnauthorized: false,
           url: appconfig.ddb_url + "/dataSources/"+ success.tenantId,
           method: 'GET', //Specify the method
           headers: { //We can define headers too
             'Content-Type': 'application/json'
           },
           qs: {tenantId:_tenantID}
         }, function(error, response, body){
           if(error) {
             console.log(error);
             res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
           } else {
             console.log(response.statusCode, body);

             if (response.statusCode === 200){

               var body = JSON.parse(response.body);
               res.status(200).send(body);

             } else if (response.statusCode === 404) {
               res.status(404).send(ErrorMsg.token_verification_failed);
             }
             else {
               res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
             }
           }
         });

       }
     });

   }
   catch (e) {
     console.log(e);
     return res.status(400).send (ErrorMsg.token_verification_failed);
   }
});

app.post('/enrollments', function(req, res) {
//////// Parameters Checking /////////
  //////// Parameters Checking /////////
  if (!req.body.accountid) {
    return res.status(400).send( ErrorMsg.missing_accountid );
  }
  if (!req.body.mcurl) {
    return res.status(400).send( ErrorMsg.missing_mcurl );
  }
  if (!req.body.apikey) {
    return res.status(400).send( ErrorMsg.missing_apikey );
  }
  if (!req.body.domainid) {
    return res.status(400).send( ErrorMsg.missing_domainid );
  }
  if (!req.body.username) {
    return res.status(400).send( ErrorMsg.missing_username );
  }
  if (!req.body.password) {
    return res.status(400).send( ErrorMsg.missing_password );
  }
//////////////////////////////////////////////////

  var _tenantID = req.body.domainid;

  try {
    request({
      rejectUnauthorized: false,
      url: appconfig.ddb_url + "/getEnrollment",
      method: 'GET', //Specify the method
      headers: { //We can define headers too
        'Content-Type': 'application/json'
      },
      qs: {tenantId: _tenantID}
    }, function (error, response, body) {
      if (error) {
        console.log(error);
        res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
      } else {
        if (response.statusMessage === 'Not Found') {


          request({
            rejectUnauthorized: false,
            url: req.body.mcurl + "/api/token",
            method: 'POST', //Specify the method
            headers: { //We can define headers too
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': "Basic " + req.body.clientsecret
            },
            body: "grant_type=password&username=" + req.body.username + "&password=" + req.body.password
          }, function (error, response, body) {
            if (error) {
              console.log(error);
              res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
            } else {
              console.log(response.statusCode, body);

              if (response.statusCode === 200) {

                request({
                  rejectUnauthorized: false,
                  url: appconfig.ddb_url + "/newEnrollment",
                  json: {
                    'accountId': req.body.accountid,
                    'mcurl': req.body.mcurl,
                    'tenantId': req.body.domainid,
                    'domainId': req.body.domainid,
                    'Status': 'new',
                    "clientid": req.body.apikey,
                    "clientsecret": req.body.clientsecret,
                    "companyName": req.body.companyName,
                    "companyAddress": req.body.companyAddress,
                    "companyPhone": req.body.companyPhone
                  },
                  method: 'POST', //Specify the method
                  headers: { //We can define headers too
                    'Content-Type': 'application/json'
                  }

                }, function (error, response, body) {
                  if (error) {
                    console.log(error);
                    res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
                  } else {

                    tokenpayload = {};
                    tokenpayload.username = req.body.username;
                    tokenpayload.accountid = req.body.accountid;
                    tokenpayload.domainid = req.body.username;
                    tokenpayload.tenantId = req.body.domainid;
                    tokenpayload.companyname = req.body.companyName;
                    tokenpayload.companyaddress = req.body.companyAddress;
                    tokenpayload.companyphone = req.body.companyPhone;

                    var token = createToken(tokenpayload);

                    sendEmail2(tokenpayload, token);

                    res.status(200).send({
                      id_token: token
                    });
                  }
                });


              } else {
                res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
              }
            }
          });
        } else {
          res.status(500).send('Tenant Already Registered. Provide a new Unique name');
        }
      }
    });
  } catch (e)  {
    res.status(500).send({});
  }

});

app.post('/delete_test_domains', function(req, res) {
   _.remove(enrollments, function(enrollment){ return (enrollment.domainid === "utest");} );
  res.status(200).send({});
});

app.get('/delete_all', function(req, res) {   //for now for testing...
  enrollments = [SotiAdminAccount];
  res.status(200).send({});
});

app.get('/delete_all_mine', function(req, res) {   //for now for testing...

  var rawToken = req.get('authorization').substr(7);
  var jwt = readToken( rawToken, function(err,decoded){
    enrollments = _.filter(enrollments, function(e){return e.accountid !== decoded.accountid;} );
    res.status(200).send({});
  });
});

app.get('/api/myenrollments', function(req, res){

  var _header = req.headers;
  var token = _header['x-access-token'];

  if(!token){
    return res.status(400).send ( ErrorMsg.login_failed_authentication);
  }

  try{
    jwt.verify(token, config.secret, function (err, success) {
      if (err) {
        return res.status(400).send (ErrorMsg.token_verification_failed);
      }
      if (success) {
        var _tenantID = success.tenantId;

        request({
          rejectUnauthorized: false,
          url: appconfig.ddb_url + "/getEnrollment",
          method: 'GET', //Specify the method
          headers: { //We can define headers too
            'Content-Type': 'application/json'
          },
          qs: {tenantId : _tenantID}
        }, function(error, response, body){
          if(error) {
            console.log(error);
            res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
          } else {
            console.log(response.statusCode, body);

            if (response.statusCode === 200){

              var body = JSON.parse(response.body);

              var responseBody = {
                status : body.Status,
                tenantid : body.tenantId,
                mcurl : body.mcurl,
                domainid : body.accountId,
                username : body.accountId
              };
                res.status(200).send(responseBody);

            } else if (response.statusCode === 404) {
              res.status(404).send(ErrorMsg.token_verification_failed);
            }
            else {
              res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
            }
          }
        });

      }
    });

  }
  catch (e) {
    console.log(e);
    return res.status(400).send (ErrorMsg.token_verification_failed);
  }



});

app.get('/confirm', function(req, res){
  try{
    var token = req.query.token;
  readToken(token, function(err,decoded){
    if (err)  res.sendfile('./public/failure.html');
    var e = [];
    e = _.findIndex(enrollments, function(e){return e.domainid === decoded.domainid;} );
    if (e > 0) {  //if not found findIndex returns -1
      enrollments[e].status = "confirmed";
      return res.sendfile('./public/thanks.html');
    } else {
      res.sendfile('./public/doesnotexist.html');
    }
  });
  }catch(e){
    res.sendfile('./public/failure.html');
  }
});

app.post('/deleteDataSource', function (req, res) {

  var token = req.headers['x-access-token'];

  if(!token){
    return res.status(400).send ( ErrorMsg.login_failed_authentication);
  }
  else {
    try{
      jwt.verify(token, config.secret, function (err, success) {
        if (err) {
          return res.status(400).send (ErrorMsg.token_verification_failed);
        }
        if (success) {

          if (req.body.dataSourceType === 'NextBus') {
            NextBusHelper.deleteDataSource(req, function (err, result){
              if (err){
                res.status(500).send('Invalid request, could not delete');
              }
              else {
                var requestData = {
                  queryParams :  {
                    tenantId: _tenantID,
                    agentId: req.body.agentid
                  },
                  method : 'Delete',
                  url : appconfig.ddb_url + '/deleteDataSource',
                  headers : { //We can define headers too
                    'Content-Type': 'application/json'
                  }
                };

                httpRequest(req, requestData, function (error, response) {
                    if (error) {
                      res.status(error.status).send('Error deleting from DSS source');
                    }
                    if (response) {
                      res.status(response.status).send(response.body);
                    }
                } )
              }
            });
          } else {

            var _tenantID = success.tenantId;

            request({
              rejectUnauthorized: false,
              url: appconfig.ddb_url + '/deleteDataSource',
              method: 'Delete', //Specify the method
              headers: { //We can define headers too
                'Content-Type': 'application/json'
              },
              qs: {
                tenantId: _tenantID,
                agentId: req.body.agentid
              }
            }, function (error, response, body) {
              if (error) {
                console.log(error);
                res.status(400).send('Error in deleteing data source with database server error');
              } else {
                console.log(response.statusCode, body);

                if (response.statusCode === 200) {

                  var body = JSON.parse(response.body);
                  res.status(200).send(body);

                } else if (response.statusCode === 404) {
                  res.status(404).send('Error with query and data soruce');
                }
                else {
                  res.status(400).send('Error with token');
                }
              }
            });
          }

        }
      });

    }
    catch (e) {
      console.log(e);
      return res.status(400).send (ErrorMsg.token_verification_failed);
    }
  }
});

function httpRequest(req, data, callback) {
  request({
    rejectUnauthorized: false,
    url: data.url,
    method: data.method, //Specify the method
    headers: data.headers,
    qs: data.queryParams
  }, function(error, response, body) {
    if (error) {
      console.log(error);
      callback({
        status: 400
      }, null);
      //res.status(400).send('Error in deleteing data source with database server error');
    } else {
      console.log(response.statusCode, body);

      if (response.statusCode === 200) {

        var body = JSON.parse(response.body);
        callback(null, {
          status: response.statusCode,
          body: body
        });
        // res.status(200).send(body);

      }
    }
  });
}

app.get('/urlbydomainid', function(req, res) {
//////// Parameters Checking /////////
  if (!req.query.domainid) {
    return res.status(400).send( ErrorMsg.missing_domainid );
  }

   var testEnrollment =_.find(enrollments, {domainid: req.query.domainid});
   if (testEnrollment) {
   res.status(200).send({
     url: enrollment.mcurl
   });
   }

  request({
    rejectUnauthorized: false,
    rejectUnauthorized: false,
    url: appconfig.ddb_url + "/getTenantUrl",
    method: 'GET', //Specify the method
    headers: { //We can define headers too
      'Content-Type': 'application/json'
    },
    qs: {tenantId: req.query.domainid }
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(400).send(ErrorMsg.db_connection_not_establish);
    } else {
      console.log(response.statusCode, body);

      if (response.statusCode === 200){


        var body = JSON.parse(response.body);

          res.status(200).send({
            url: body.mcurl,
            clientId: body.clientid
          });

      } else if (response.statusCode === 404) {
        res.status(404).send(ErrorMsg.tenantid_not_registered);
      }
      else {
        res.status(400).send(ErrorMsg.tenantid_not_registered);
      }
    }
  });


});
/////*******************************************
app.post('/sessions/create', function(req, res) {
//////// Parameters Checking /////////
  if (!req.body.domainid) {
    return res.status(400).send( ErrorMsg.missing_domainid );
  }
  if (!req.body.code && !req.body.username) {
    return res.status(400).send( ErrorMsg.missing_username );
  }
  if (!req.body.code && !req.body.password) {
    return res.status(400).send( ErrorMsg.missing_password );
  }
//////////////////////////////////////////////////


  if (req.body.code){
    var _reqBody = req.body.domainid;
    var fullState = _reqBody.split('?');
    var _tenantID = fullState[0];

    try {



      request({
        rejectUnauthorized: false,
        url: appconfig.ddb_url + "/getEnrollment",
        method: 'GET', //Specify the method
        headers: { //We can define headers too
          'Content-Type': 'application/json'
        },
        qs: {tenantId: _tenantID}
      }, function (error, response, body) {
        if (error) {
          console.log(error);
          res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
        } else {
          console.log(response.statusCode, body);

          if (response.statusCode === 200) {


            try {

              grant_type = "grant_type=authorization_code&code=" + req.body.code;
              var jsonBody = JSON.parse(response.body);
              request({
                rejectUnauthorized: false, //need to improve this ..related with ssl certificate
                url:   jsonBody.mcurl + "/api/token",
                method: 'POST', //Specify the method
                headers: { //We can define headers too
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': "Basic " + jsonBody.clientsecret
                },
                body: grant_type
              }, function(error, response, _body){
                if(error) {
                  console.log(error);
                  res.status(400).send(ErrorMsg.login_failed_authentication);
                } else {
                  console.log(response.statusCode, body);
                  if (response.statusCode === 200){

                    _body = JSON.parse(_body);

                    request({
                      "rejectUnauthorized": false,
                      url: jsonBody.mcurl + '/api/security/users/Administrator/groups',
                      method: 'GET', //Specify the method
                      headers: { //We can define headers too
                        'Authorization': 'bearer ' + _body.access_token
                      }
                    }, function(error, response, __body){
                      if(error) {
                        console.log(error);
                        res.status(200).send("hi from modulus error:" + error);
                      } else {
                        console.log(response.statusCode, body);
                        var mbuser = JSON.parse(__body);
                        if (mbuser[0].Name === 'MobiControl Administrators') {

                          tokenpayload = {};
                          tokenpayload.username = body.tenantId;
                          tokenpayload.accountid = body.accountId;
                          tokenpayload.domainid = body.domainId;
                          tokenpayload.tenantId = body.tenantId;
                          tokenpayload.companyname = body.companyName;
                          tokenpayload.companyaddress = body.companyAddress;
                          tokenpayload.companyphone = body.companyPhone;


                          res.status(200).send({
                            id_token: createToken(tokenpayload)
                          });
                        }
                      }
                    });


                  } else {
                    res.status(400).send(ErrorMsg.login_failed_authentication);
                  }
                }
              });

              var body = JSON.parse(response.body);

            } catch (e){
              console.log(e);
              return res.status(400).send (ErrorMsg.token_verification_failed);
            }



          } else if (response.statusCode === 404) {
            res.status(404).send(ErrorMsg.token_verification_failed);
          }
          else {
            res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
          }
        }
      });
    }
    catch (e) {
      console.log(e);
      return res.status(400).send (ErrorMsg.token_verification_failed);
    }



  }
  else {

    var enrollment = _.find(enrollments, {domainid: req.body.domainid});

    if (enrollment) { //for predefined .. test accounts during the admin flow
      var tokenpayload = {};
      tokenpayload.username = req.body.username;
      tokenpayload.accountid = enrollment.accountid;
      tokenpayload.domainid = enrollment.domainid;
      tokenpayload.tenantId = enrollment.tenantId;
      tokenpayload.companyname = enrollment.companyname;
      tokenpayload.companyaddress = enrollment.companyaddress;
      tokenpayload.companyphone = enrollment.companyphone;

      res.status(200).send({
        id_token: createToken(tokenpayload)
      });
    }
    res.status(400).send(ErrorMsg.session_missing_callback_token);

  }

});

var nodemailer = require('nodemailer');

var sendmail = require('sendmail')();

function sendEmail(enrollment)
{
  sendmail({
    from: 'no-reply@yourdomain.com',
    to: 'pablo.elustondo@gmail.com',
    subject: 'test sendmail',
    html: 'Mail of test sendmail ',
  }, function (err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
  });
};

function sendEmail2(enrollment,token) {

  var transporter = nodemailer.createTransport({
    service: 'Yahoo',
    auth: {
      user: 'dad666@yahoo.com',
      pass: 'aaa111bbb'
    }
  });
  var text = 'Hello from DSS to:' + enrollment.username;

  var mailOptions = {
    from: 'dad666@yahoo.com', // sender address
    to: enrollment.accountid, // list of receivers
    cc: 'pablo.elustondo@rogers.com',
    subject: 'SOTI DAD - MobiControl Enrollment', // Subject line
    html: '<b>Hi, it seems that '+ enrollment.username + ' have used this account to register domain ' + enrollment.domainid +' to SOTI Data Analytics Services, if this is corrrect, please confirm you enrollment by clicking this \<a href=\"http://localhost:3004/confirm?token=' + token +'\">link</a></b>.'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log("sendMail error: " + error);
    }else{
      console.log('Message sent: ' + info.response);
    };
  });
  transporter.close();
}
