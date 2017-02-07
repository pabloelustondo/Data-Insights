var express  = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb').MongoClient;
var ObjectID=require('mongodb').ObjectID;
var dbUrl ='mongodb://127.0.0.1:27017/';
var path = require('path');

function callDbAndRespond(req,res,query){
	var user = getUser(req);
	mongodb.connect(dbUrl + "udb_" + user,function(err,db){
		if (err) {
			res.send({data:null, status:err });
        }
		else query(req,res,db,function(err,doc){
			res.send({data:doc, status:err?err:'ok' });
			db.close();
		});
	});
}

function getDBInstance (req){
    var user = getUser(req);
    var x = mongodb.connect(dbUrl + "udb_" + user);

    return x;
}

function getUser(req){
	var username = 'test'; var password;
	var auth = req.headers['authorization'];
	if (auth){
		var tmp = auth.split(' ');
		var buf = new Buffer(tmp[1], 'base64');
		var plain_auth = buf.toString(); 
		var creds = plain_auth.split(':'); 
		username = creds[0];
		password = creds[1];
	};
	return username;
}

app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));

app.get('/test', function(req,res){
	res.sendfile('./public/testing/spec/SpecRunner.html');
});

app.get('/putSampleRecords', function(req,res){
    res.sendfile('./public/testing/spec/SpecRunner.html');
});

app.get('/', function(req,res){
	res.send("Jassplan TO-DO REST API Version 16");
});

app.get('/todo', function(req,res){
	callDbAndRespond(req,res, function(req,res,db, next){
		db.collection('todo').find({}).toArray(next);
	});
});


app.get('/todo/:id', function(req,res){
	callDbAndRespond(req,res, function(req,res,db, next){
		db.collection('todo').findOne({"_id":ObjectID(req.params.id)},next);
	});
});


app.get('/getDBAccess/:tenatID', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
    	console.log(req.params.tenatID);
    	db.collection('todo').findOne({
            "tenatID":req.params.tenatID
		}, next);
    });
});

app.post('/todo', function(req,res){
	callDbAndRespond(req,res, function(req,res,db, next){
		db.collection('todo').insert(req.body,next);
	});
});

app.put('/todo', function(req,res){
	callDbAndRespond(req,res, function(req,res,db, next){
		var _id = ObjectID(req.body._id);
		delete req.body._id;
		db.collection('todo').update({"_id":_id},req.body,next);
	});
});

app.post('/updateDataSourceCredentials', function (req, res ) {


    var _tenantId = req.body.tenatID;
    console.log("tenant id = " + _tenantId);

	callDbAndRespond(req, res, function(req,res,db, next) {

        var _tenantId = req.body.tenatID;
        db.collection('todo').update(
            {
                tenatID: req.body.tenatID
            },
            {
                $set: {
					accessUsername : req.body.accessUsername,
					accessPswd : req.body.accessPswd,
                    RedShiftConnectionString: req.body.RedShiftConnectionString,
                    DBName: req.body.DBName
                }
            },
            {
                upsert: false
            }, next);

    });

});

/*
 db.collection('todo').update(
 {
 tenatID: req.body.tenatID
 },
 {
 $set: {
 RedShiftConnectionString: req.body.RedShiftConnectionString,
 DBName: req.body.DBName
 }
 },
 {
 upsert: false
 },
 req.body.next
 );


 db.collection('todo').findAndModify({
 query: {
 tenatID: req.body.tenatID
 },
 sort: { tenatID : 1 },
 update: {
 $set: {
 RedShiftConnectionString: req.body.RedShiftConnectionString,
 DBName: req.body.DBName
 }
 },
 upsert: true
 },
 req.body,next
 );*/

app.delete('/todo', function(req,res){
	callDbAndRespond(req,res, function(req,res,db, next){
		db.collection('todo').drop(next);
	});
});


app.listen(8000);
