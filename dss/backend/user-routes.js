var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken');

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




var app = module.exports = express.Router();

// XXX: This should be a database of users :).
var users = [{
  id: 1,
  username: 'gonto',
  password: 'gonto'
}];

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60*5 });
}

app.post('/users', function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }
  if (_.find(users, {username: req.body.username})) {
   return res.status(400).send("A user with that username already exists");
  }

  var profile = _.pick(req.body, 'username', 'password', 'extra');
  profile.id = _.max(users, 'id').id + 1;

  users.push(profile);

  res.status(201).send({
    id_token: createToken(profile)
  });
});

app.post('/sessions/create', function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }
//////////////////////////////////////////////////

  var user = _.find(users, {username: req.body.username});
  if (!user) {
    return res.status(401).send("The username or password don't match");
  }

  if (!(user.password === req.body.password)) {
    return res.status(401).send("The username or password don't match");
  }


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

      user.mc_token= "MC Token:" + response.statusCode + " body " + body;
      res.status(200).send({
        id_token: createToken(user)
      });
      var resObj = JSON.parse(body);
      currentAuthorizationString = "Bearer " + resObj.access_token;
      localStorage.setItem('currentAuthorizationString', currentAuthorizationString)
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
