var express = require('express'),
    _       = require('lodash'),
    config  = require('./config');
    appconfig  = require('./appconfig');
var querystring = require('querystring');

var app = module.exports = express.Router();

app.post('/api/token', function(req,res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("MC Mock: You must send the username and the password");
  }
  if (req.body.password!=="wrongpassword") {
    res.status(200).send({token: 'test1234567890test1234567890test'});
  } else {
    return res.status(400).send("MC Mock: You password is wrongpassword");
  }
});

app.get('/oauth/authorize', function(req,res) {
  //      this.url = params['url'];
  //      this.code = params['code'];
  //      this.domainid = params['state'];

  res.status(200).send("<html><script>window.location.href = 'http://localhost:3003/#/?code=code&state=test'</script></html>");
});

