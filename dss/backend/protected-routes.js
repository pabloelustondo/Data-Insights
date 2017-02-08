var express = require('express'),
  jwt     = require('express-jwt'),
  config  = require('./config');

var querystring = require('querystring');
var https = require('https');

var request = require('request');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./temp');

var host = 'https://cad059.corp.soti.net/MobiControl';
var dbapihost = "http://localhost:8000"
var username = 'Administrator';
var password = '1';
var basicAuthorizationString = "Basic NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0";
var apiKey = '*****';
var sessionId = null;
var deckId = '68DC5A20-EE4F-11E2-A00C-0858C0D5C2ED';
var currentAuthorizationString =  localStorage.getItem('currentAuthorizationString');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secret
});

app.use('/api/protected', jwtCheck);

app.get('/api/protected/random-quote', function(req, res) {
  var myanswer = "pablo says that :" + quoter.getRandomOne();
  res.status(200).send(myanswer);
});

app.get('/api/protected/token', function(req, res) {

  request({
    "rejectUnauthorized": false,
    url: host + "/api/token",
    method: 'POST', //Specify the method
    headers: { //We can define headers too
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': basicAuthorizationString
    },
    body: "grant_type=password&username=Administrator&password=1"
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(200).send("hi from modulus error:" + error);
    } else {

      console.log(response.statusCode, body);
      res.status(200).send("hi from modulus success code:" + response.statusCode + " body " + body);
      var resObj = JSON.parse(body);
      currentAuthorizationString = "Bearer " + resObj.access_token;
      localStorage.setItem('currentAuthorizationString', currentAuthorizationString)
    }
  });

});

app.get('/api/protected/devicegroups', function(req, res) {
  currentAuthorizationString =  localStorage.getItem('currentAuthorizationString');

  request({
    "rejectUnauthorized": false,
    url: host + "/api/devicegroups",
    method: 'GET', //Specify the method
    headers: { //We can define headers too
      'Authorization': currentAuthorizationString
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(200).send("hi from modulus error:" + error);
    } else {
      console.log(response.statusCode, body);
      res.status(200).send(body);
    }
  });

});

app.get('/api/protected/devices', function(req, res) {
  currentAuthorizationString =  localStorage.getItem('currentAuthorizationString');

  request({
    "rejectUnauthorized": false,
    url: host + "/api/devices",
    method: 'GET', //Specify the method
    headers: { //We can define headers too
      'Authorization': currentAuthorizationString
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(200).send("hi from modulus error:" + error);
    } else {
      console.log(response.statusCode, body);
      res.status(200).send(body);
    }
  });

});

app.post('/api/protected/devices/action', function(req, res) {
  currentAuthorizationString =  localStorage.getItem('currentAuthorizationString');
  request({
    "rejectUnauthorized": false,
    url: host + "/api/devices/" + req.body.DeviceId +"/actions",
    method: 'POST', //Specify the method
    headers: { //We can define headers too
      'Authorization': currentAuthorizationString,
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(req.body.action)
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(200).send("hi from modulus error:" + error);
    } else {
      console.log(response.statusCode, body);
      res.status(200).send({});
    }
  });

});

app.get('/api/protected/getconfig', function(req, res) {
  request({
    "rejectUnauthorized": false,
    url: dbapihost + "/todo",
    method: 'GET', //Specify the method
    headers: { //We can define headers too
      'Content-Type': 'application/json'
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(200).send("hi from modulus error:" + error);
    } else {
      console.log(response.statusCode, body);
      res.status(200).send(body);
    }
  });

});

app.post('/api/protected/postconfig', function(req, res) {
  request({
    "rejectUnauthorized": false,
    url: dbapihost + "/todo",
    method: 'POST', //Specify the method
    headers: { //We can define headers too
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(req.body),
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(200).send("hi from modulus error:" + error);
    } else {
      console.log(response.statusCode, body);
      res.status(200).send(body);
    }
  });
});

app.put('/api/protected/putconfig', function(req, res) {
  request({
    "rejectUnauthorized": false,
    url: dbapihost + "/todo",
    method: 'PUT', //Specify the method
    headers: { //We can define headers too
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(req.body)
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(200).send("hi from modulus error:" + error);
    } else {
      console.log(response.statusCode, body);
      res.status(200).send(body);
    }
  });
});




function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else if (method == 'GETTOKEN') {
    data = "grant_type=password&username=Administrator&password=7";
    dataString = data;
    method = "POST";
    // endpoint += '?' + querystring.stringify(data);

    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': dataString.length,
      'Authorization': basicAuthorizationString
    };

  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}
