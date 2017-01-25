var express = require('express'),
    quoter  = require('./quoter');

var app = module.exports = express.Router();

app.get('/api/random-quote', function(req, res) {
  var d = new Date();
  res.status(200).send('Hi from the DSS Anonymous Route at + ' + d.toISOString());
});
