var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    https           = require('https');
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
      helmet        = require('helmet'),
      fs            = require('fs'),
      config        = require('./config.json'),
      appconfig        = require('./appconfig.json'),
    bodyParser      = require('body-parser');

var app = express();

dotenv.load();

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
app.use(helmet());

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

app.use(require('./protected-routes'));
app.use(require('./user-routes'));
app.use(require('./mcserver-mock'));


app.use(function(req, res, next) {
  res.header('X-Content-Type-Option', 'nosniff');
  next();
});

if (config.useSSL){

  var httpsOptions = {
    key: fs.readFileSync(config['https-key-location'] ),
    cert: fs.readFileSync(config['https-cert-location'] )
  };

var httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(appconfig.port, appconfig.hostname, function (){
  console.log('Starting https server.. https://localhost:' + config.port + '/docs');
});

} else {

   http.createServer(app).listen(appconfig.port, function (err) {
   console.log("listening in " +appconfig.hostname  + ":" + appconfig.port);
   });

}
