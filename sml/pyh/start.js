//start.js
var spawn = require('child_process').spawn,
    arg1 = "arg1",
    arg2 = "arg2",
    arg3 = "arg3",
    py    = spawn('python', ['compute_input.py', arg1, arg2, arg3] ),
    data = [1,2,3,4,5,6,7,8,9],
    dataString = '';

py.stdout.on('data', function(data){
    dataString += data.toString();
});
py.stdout.on('end', function(){
    console.log('Sum of numbers=',dataString);
});
py.stdin.write(JSON.stringify(data));
py.stdin.end();