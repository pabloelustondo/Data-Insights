'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);


let historicalData = [];  //to store what is being generated...
//we are playing around here with the idea of buses and locations.. but just to ilustrate



io.on('connection', (socket) => {
  console.log('user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('add-message', (message) => {

    let h = historicalData.length;
    let t = Date.now();
    let d = [{busid:1, lat:h, lon:h} , {busid:2, lat:h, lon:2*h}];  //two buses moving in two lines

    io.emit('message', {type:'new-message', text: message, data: [{t:t,d:d}] });
  });
});

http.listen(5000, () => {
  console.log('started on port 5000');
});
