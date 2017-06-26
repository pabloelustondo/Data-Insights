'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);


let historicalData = [];  //to store what is being generated...
//we are playing around here with the idea of buses and locations.. but just to ilustrate

let timeWindow = 50;
let timeLoopRun = true;
let timeLoopCounter = 0;
let timeLoop = setInterval(function(){
    // do your thing
    let h = timeLoopCounter % timeWindow;
    let lat = 43.6543;
    let long = 79.3860;
    let t = Date.now();
    let d = [{busid:1, lat:h, lon:h}];  //two buses moving in two lines
    let message = "message";

    let data = [{time:t, data:d}];
    historicalData.unshift(data);
    while (historicalData.length > timeWindow){ historicalData.pop(); }

    io.emit('message', {type:'new-message', text: message, data: [data] });


    timeLoopCounter++;
    if(!timeLoopRun) {   //this way we can stop the counter
        clearInterval(timeLoop);
    }
}, 200);

io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('history',{type:'history', text: "history", data: historicalData })

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('add-message', (message) => {

      let h = timeLoopCounter % timeWindow;
    let t = Date.now();
    let d = [{busid:1, lat:h, lon:h}];  //two buses moving in two lines

    io.emit('message', {type:'new-message', text: message, data: [{t:t,d:d}] });
  });
});

http.listen(5000, () => {
  console.log('started on port 5000');
});
