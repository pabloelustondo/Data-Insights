var express = require('express'),
    _       = require('lodash'),
    config  = require('./config');
    appconfig  = global.appconfig;
var querystring = require('querystring');

var app = module.exports = express.Router();

var username;

var TestTenant =
  {
    accountid: "test",
    mcurl: appconfig.dssback_url,
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
    username = req.body.code;
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

  var state = req.query['state'].replace("?","&");

  username = req.params['code'];  //this is a trick to be able to simulate mobicontrol... username

  res.status(200).send("<html>" +
    "<script>function submit(){ " +
    "var username = document.getElementById('username').value;" +
    "var url = '" +  appconfig.dss_url + "/#/?code=' + username + '&state=" + state + "';" +
 //   "alert(url);" +
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

// /oauth/userinfo
// var mbuser = JSON.parse(__body);
//if (mbuser.Name) {

app.get('/oauth/userinfo', function(req,res) {
  res.status(200).send({Name:username});
});
