/**
 * Created by vdave on 3/15/2017.
 */
var express = require('express'),
  _       = require('lodash'),
  config  = require('../config'),
  jwt     = require('jsonwebtoken');

var  ErrorMsg = require('../error-messages');
var querystring = require('querystring');
var https = require('https');
var uuid = require('node-uuid');

var request = require('request');

NextBusHelper = {
  deleteDataSource: function (req, callback) {
    if (req.body.dataSourceType !== 'NextBus'){
      callback (new Error('NextBus Data Source type must be provided only'), null);
    } else {
      request ({
          rejectUnauthorized: false,
          url: config.dlmEndpointUrl + "/deleteDataSource",
          method: 'post', //Specify the method
          headers: { //We can define headers too
            'Content-Type': 'application/json'
          },
          qs: {
            agentId : req.body.agentid
          }
        }, function(error, response, body) {
          if (error) {
            console.log(error);
            res.status(400).send('Error in deleteing data source with database server error');
            callback (new Error('Error reaching DLM service while deleting schedule for data Source', null));
          } else {
            console.log(response.statusCode, body);

            if (response.statusCode === 200) {

              var body = JSON.parse(response.body);
              //res.status(200).send(body);
              callback (null, body);

            } else {
              callback (new Error('Error deleting schedule for data Source', null));
            }
          }
        }
      )
    }

  }
};

module.exports = NextBusHelper ;
