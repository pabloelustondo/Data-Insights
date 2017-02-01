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
var enrollments = [];

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60*5 });
}

app.get('/api/enrollments', function(req, res){
  res.status(200).send(enrollments);
});

app.get('/enrollments2', function(req, res) {
  var d = new Date();
  res.status(200).send('Hi from the DSS Anonymous Route at + ' + d.toISOString());
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

  if (_.find(enrollments, {mcurl: req.body.mcurl})) {
   return res.status(400).send( ErrorMsg.mcurl_already_enrolled );
  }

  var enrollment = _.pick(req.body, 'accountid','mcurl', 'apikey', 'domainid', 'username');
  enrollment.tenantid = req.body.domainid; //for now

  request({
    rejectUnauthorized: false,
    url: enrollment.mcurl  + "/api/token",
    method: 'POST', //Specify the method
    headers: { //We can define headers too
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': "Basic " + enrollment.apikey,
    },
    body: "grant_type=password&username=" + req.body.username  + "&password=" + req.body.password
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(400).send(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
    } else {
      console.log(response.statusCode, body);

      if (response.statusCode === 200){

        enrollments.push(enrollment);
        var resObj = JSON.parse(body);
        enrollment.mc_token= resObj.access_token;

        res.status(200).send({
          id_token: createToken(enrollment)
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
  enrollments = [];
  res.status(200).send({});
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

        enrollments.push(enrollment);
        var resObj = JSON.parse(body);
        enrollment.mc_token= resObj.access_token;

        res.status(200).send({
          id_token: createToken(enrollment)
        });
      } else {
        res.status(400).send(ErrorMsg.login_failed_authentication);
      }
    }
  });



//////////////////////////////////////////////////
  /*
  var user = _.find(users, {username: req.body.username});
  if (!user) {
    return res.status(401).send("The username or password don't match");
  }

  if (!(user.password === req.body.password)) {
    return res.status(401).send("The username or password don't match");
  }

  res.status(201).send({
    id_token: createToken(user)
  });
  */
});
