var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser');

var app = express();

dotenv.load();

// Parsers
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/public', express.static(__dirname + '/public'));
app.get('/test', function(req,res){
  res.sendfile('./public/testing/spec/SpecRunner.html');
});
app.get('/', function(req,res){
  res.sendfile('./public/testing/spec/SpecRunner.html');
});


app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(express.logger('dev'));
  app.use(errorhandler())
}

app.use(require('./anonymous-routes'));
app.use(require('./protected-routes'));
app.use(require('./user-routes'));
app.use(require('./mcserver-mock'));

var port = 3004;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});

