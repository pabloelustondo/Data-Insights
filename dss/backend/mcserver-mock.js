var express = require('express'),
    _       = require('lodash'),
    config  = require('./config');
    appconfig  = require('./appconfig');
var querystring = require('querystring');

var app = module.exports = express.Router();

var TestTenant =
  {
    accountid: "test",
    mcurl: "http://localhost:3004",
    apikey:"112233445511223344",
    domainid: "test",
    username: "admin",
    tenantId: "test",
    companyname: "test",
    companyaddress: "companyAddress",
    companyphone: "111 111 1111"
  };



app.post('/api/token', function(req,res) {

  if (req.body.code) {
    return res.status(200).send({token: 'test1234567890test1234567890test'});
  }

  if (!req.body.username || !req.body.password) {
    return res.status(400).send("MC Mock: You must send the username and the password");
  }
  if (req.body.password!=="wrongpassword") {
    return res.status(200).send({token: 'test1234567890test1234567890test'});
  } else {
    return res.status(400).send("MC Mock: You password is wrongpassword");
  }
});

app.get('/oauth/authorize', function(req,res) {
  //      this.url = params['url'];
  //      this.code = params['code'];
  //
  var tenantid = req.params['state'];
  tenantid = 'test'; //why is not coming in params?

  res.status(200).send("<html>" +
    "<script>function submit(){ " +
    "var username = document.getElementById('username').value;" +
    "var url = 'http://localhost:3003/#/?code=' + username + '&state=test'; " +
    "alert(url);" +
    "window.location.href =  url;  } " +
    "</script> " +
    "This is a simulated IDP (Identity Provider) used for testing purposes. Properly configured tenants will be redirected to the proper IDP </br>" +
    "Username: <input id='username' type='text' name='username'/></br> " +
    "Password: <input id='password' type='text' name='password'/></br> " +
    "Login: <input type='button' name='login' onclick='submit();'/> " +
    "</html>");
});


//db mock (this can actually become a real DB wrapper...to tired now.. but i see thsi code useful for production
//getEnrollment

app.get('/getEnrollment', function(req,res) {
  //      this.url = params['url'];
  //      this.code = params['code'];
  //      this.domainid = params['state'];

  res.status(200).send(TestTenant);
});


///api/security/users/Administrator/groups

app.get('/getEnrollment', function(req,res) {
  //      this.url = params['url'];
  //      this.code = params['code'];
  //      this.domainid = params['state'];

  res.status(200).send(TestTenant);
});
