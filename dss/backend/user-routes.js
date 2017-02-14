var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken');

var  ErrorMsg = require('./error-messages');
var querystring = require('querystring');
var https = require('https');

var request = require('request');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./temp');

var app = module.exports = express.Router();

// XXX: This should be a database of enrollments :).
// XXX: This should be a database of enrollments :).
var SotiAdminAccount =
  {
    accountid: "soti",
    mcurl: "http://localhost:3004",
    apikey:"112233445511223344",
    domainid: "soti",
    username: "Administrator"
  };

var enrollments = [SotiAdminAccount];

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 600 * 5 });
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

app.post('/registerDataSource', function (req, res) {

  if (!req.body.mcurl) {
    return res.status(400).send( ErrorMsg.missing_mcurl );
  }
  if (!req.body.agentid) {
    return res.status(400).send( ErrorMsg.missing_apikey );
  }
  if (!req.body.tenantid) {
    return res.status(400).send( ErrorMsg.missing_domainid );
  }


  var enrollment = _.pick(req.body, 'accountid','mcurl', 'apikey', 'domainid', 'username');
  enrollment.tenantid = req.body.domainid; //for now
  enrollment.status = "new";

  var activationKey = 'hello';
  var dataSource = {
    tenantId: req.body.tenantid,
    agentId: req.body.agentid,
    mcurl: req.body.mcurl,
    activationKey: activationKey
  };

  request({
    rejectUnauthorized: false,
    url: config.ddbEndpointUrl + "/insertNewDataSource",
    json : {
      'agentId' :dataSource.agentId,
      'tenantId' : dataSource.tenantId,
      'mcUrl' : dataSource.mcurl,
      'activationKey': dataSource.activationKey
    },
    method: 'POST', //Specify the method
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


        res.status(200).send({
          message: 'added'
        });
      } else {
        res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
      }
    }
  });

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
           rejectUnauthorized: false,
           url: config.ddbEndpointUrl + "/verifyDataSource",
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
                   agentid: '213',
                   tenantid: _tenantID
                 }, config.expiringSecret, {expiresInMinutes: config.tempTokenExpiryTime});
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

  if (_.find(enrollments, {mcurl: req.body.domainid})) {
   return res.status(400).send( ErrorMsg.mcurl_already_enrolled );
  }

  var enrollment = _.pick(req.body, 'accountid','mcurl', 'apikey', 'domainid', 'username');
  enrollment.tenantid = req.body.domainid; //for now
  enrollment.status = "new";

  request({
    rejectUnauthorized: false,
    url: enrollment.mcurl  + "/api/token",
    method: 'POST', //Specify the method
    headers: { //We can define headers too
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': "Basic " + enrollment.apikey
    },
    body: "grant_type=password&username=" + req.body.username  + "&password=" + req.body.password
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
    } else {
      console.log(response.statusCode, body);

      if (response.statusCode === 200){

        request({
          rejectUnauthorized: false,
          url: config.ddbEndpointUrl + "/newEnrollment",
          json : {
            'accountId' : enrollment.accountid,
            'tenantId' : enrollment.tenantid,
            'domainId' : enrollment.domainid
          },
          method: 'POST', //Specify the method
          headers: { //We can define headers too
            'Content-Type': 'application/json'
          }

        }, function(error, response, body) {
          if (error) {
            console.log(error);
            res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
          } else {
            console.log('inserted : ' + JSON.stringify(enrollment));
          }
        });

        enrollments.push(enrollment);
        var resObj = JSON.parse(body);
        enrollment.mc_token= resObj.access_token;
        tokenpayload = {};
        tokenpayload.username =  enrollment.username;
        tokenpayload.accountid =  enrollment.accountid;
        tokenpayload.domainid =  enrollment.domainid;
        tokenpayload.tenantid =  enrollment.tenantid;

        var token = createToken(tokenpayload);

        sendEmail2(tokenpayload,token);

        res.status(200).send({
          id_token: token
        });
      } else {
        res.status(400).send(ErrorMsg.mcurl_enrollement_failed_authentication);
      }
    }
  });

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

  var rawToken = req.get('authorization').substr(7);
  var jwt = readToken(rawToken, function(err,decoded){
    myenrollments = _.filter(enrollments, function(e){return e.accountid === decoded.accountid;} );
    res.status(200).send(myenrollments);
  });

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

app.post('/sessions/create', function(req, res) {
//////// Parameters Checking /////////
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

  var enrollment =_.find(enrollments, {domainid: req.body.domainid});

  if (!enrollment) {
    return res.status(400).send( ErrorMsg.not_found_domainid );
  }

    user = {
      username: req.body.username,
      password: req.body.password
    }

  //var basicAuthorizationString = "Basic " + enrollment.apikey;

  request({
    rejectUnauthorized: false, //need to improve this ..related with ssl certificate
    url:   enrollment.mcurl + "/api/token",
    method: 'POST', //Specify the method
    headers: { //We can define headers too
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': "Basic " + enrollment.apikey,
    },
    body: "grant_type=password&username="+ user.username +"&password="+user.password,
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(400).send(ErrorMsg.login_failed_authentication);
    } else {
      console.log(response.statusCode, body);
      if (response.statusCode === 200){

        var resObj = JSON.parse(body);
        enrollment.mc_token= resObj.access_token;
        tokenpayload = {};
        tokenpayload.username =  enrollment.username;
        tokenpayload.accountid =  enrollment.accountid;
        tokenpayload.domainid =  enrollment.domainid;
        tokenpayload.tenantid =  enrollment.tenantid;

        res.status(200).send({
          id_token: createToken(tokenpayload)
        });
      } else {
        res.status(400).send(ErrorMsg.login_failed_authentication);
      }
    }
  });

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
