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

            console.log( 'returned data = ' + JSON.stringify(doc));
            if (doc !== null) {
                res.status(200).send(doc);
            }
            else {
                res.status(404).send();
            }
            db.close();
        });
    });
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


app.get('/getDBAccess/:tenantID', function(req,res){

    var _tenantId = req.params.tenantID;
    callDbAndRespond(req,res, function(req,res,db, next){
        console.log(req.params.tenantID);
        db.collection('enrollments').findOne({
            "tenantId":req.params.tenantID
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

app.post('/insertNewDataSource', function (req, res ) {


    callDbAndRespond(req, res, function (req,res, db, next ){
        db.collection('dataSources').insertOne(req.body, next);
    });
});

app.get('/dataSources', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('dataSources').find({}).toArray(next);
    });
});




app.post('/newEnrollment', function (req, res ) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('enrollments').insertOne(req.body, next);
    });
});

app.delete('/allEnrollments', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('enrollments').drop(next);
    });
});

app.get('/enrollments', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('enrollments').find({}).toArray(next);
    });
});

// get all data sources attached to id
app.get('/dataSources/:tenantId', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('dataSources').find({"tenantId":req.params.tenantId}).toArray(next);
    });
}) ;

// get one specific data source
app.get('/dataSource/:agentId', function (req, res) {
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('dataSources').find(
            {
                "agentId":req.params.agentId
            },
            {
                "activationKey": 1
            }
        ).toArray(next);
    });
});

app.get('/verifyDataSource', function (req, res) {

    console.log ('reached verify data source');
    console.log (req.query.tenantId);
    var _tenantId = req.query.tenantId;
    var _agentId = req.query.agentId;
    var _activationKey = req.query.activationKey;

    callDbAndRespond(req,res, function(req,res,db, next){
        console.log(req.params.tenatID);
        db.collection('dataSources').findOne({
            "agentId": _agentId
        }, next);
    });

});

app.post('/updateDataSourceCredentials', function (req, res ) {

    var _agentId = req.body.agentId;
    var _accessKey = req.body.activationKey;

    console.log("agent id = " +_agentId);

    callDbAndRespond(req, res, function(req,res,db, next) {

        db.collection('dataSources').update(
            {
                agentId : _agentId
            },
            {
                $set: {
                    activationKey : _accessKey

                }
            },
            {
                upsert: false
            }, next);

    });
});

app.post('/updateDataSourceAws', function (req, res) {
    var _tenantId = req.body.tenantID;
    console.log("tenant id = " + _tenantId);

    callDbAndRespond(req, res, function(req,res,db, next) {

        var _tenantId = req.body.tenantID;
        db.collection('enrollments').update(
            {
                tenantId: _tenantId
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


app.delete('/todo', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('todo').drop(next);
    });
});


app.delete('/dataSources', function(req,res){
    callDbAndRespond(req,res, function(req,res,db, next){
        db.collection('dataSources').drop(next);
    });
});

app.listen(8000);
