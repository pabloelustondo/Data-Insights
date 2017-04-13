from __future__ import print_function
from pymongo import MongoClient
from bson.code import Code
from bson.json_util import dumps
from bson.json_util import loads

import boto3
import urllib
import logging
import json

#addition library
import requests

#new
logger = logging.getLogger()
#Trace log info, in production mode, switch to logging.ERROR 
logger.setLevel(logging.INFO)

s3 = boto3.resource('s3')

print('Loading function')

def lambda_handler(event, context):
    
    #Should be save SOTI DB config in file??
    _soticonfserver = '34.206.170.83:5494'
    _soticonfdatabase = 'configuration'
    _soticonfcollection = 'enrollments'
    
    _sotitenantid = event['tenantId']
    _sotiusername = 'sotiadmin'
    _sotipassword = 'eXtremely$tr0ngp@$$w0rd'
    
    logger.info('got event{}'.format(event))
   
    url = 'http://50.16.136.220:5495/tenant/configuration'
    #headers = {'Content-Type':'application/json', 'x-access-token':'A3J9SyhuZ9TTyNdzCq5LPmNlHb32KasnRothKwnGyCegLvp9bCEMkhYbl51xPzUFK1jHUYh9EeQzqSu0464ZFCpaZ6zmiyXo3p98EbHSzPuFX1zTmX5c26vfpnl1G5khykf8dnloubXcul3T93M4jjLj1UJgnU0OwmjEH5ZA7GmHC0kKmO8gK6KCi9eDDDW6OaTOkoOm'}
    #params = {'tenantId': 'test1'}
    myResponse = requests.get(url, params={'tenantId': _sotitenantid}, headers={'Content-Type':'application/json', 'x-access-token':'A3J9SyhuZ9TTyNdzCq5LPmNlHb32KasnRothKwnGyCegLvp9bCEMkhYbl51xPzUFK1jHUYh9EeQzqSu0464ZFCpaZ6zmiyXo3p98EbHSzPuFX1zTmX5c26vfpnl1G5khykf8dnloubXcul3T93M4jjLj1UJgnU0OwmjEH5ZA7GmHC0kKmO8gK6KCi9eDDDW6OaTOkoOm'})
    
    #print('step 1: ' + str(myResponse.ok))
    
    if(myResponse.ok):
        result = json.loads(myResponse.content)
        _connectionString = result['mongodbConnectionString']+':5494'
        _userName = result['mongodbUsername']
        _password = result['mongodbPassword']
        _dbName = result['DBName']
        #print('step 2.1: ' + _connectionString)
        #print('step 2.2: ' + _userName)
        #print('step 2.3: ' + _password)
        #print('step 2.4: ' + _dbName)
        
        _collection = 'DeviceCustomData'
        res = (AggregationQuery (_connectionString, _userName, _password, _dbName, _collection, event))
        return (res)
    else:
        logger.error('call SOTI Mongodb Error.')
        return
    #replaced by dynamic call to DDB
    #result = GetTenantInfo (_soticonfserver, _soticonfdatabase, _soticonfcollection, _sotitenantid, _sotiusername, _sotipassword)
    #_connectionString = result['mongodbConnectionString']+':5494'
    #_userName = result['mongodbUsername']
    #_password = result['mongodbPassword']
    #_dbName = result['DBName']
    #end
	
    #qry = qry.replace('$[vehicleId]', event['vehicleId'])
    #_collection = 'sessions'
    #res = MapReduceQuery (_connectionString, _userName, _password, _dbName, _collection)
	
def GetTenantInfo (_serverAddress, _dbname, _collection, _tenantid, _username, _password):
    conn = MongoClient('mongodb://' +  _username + ':' +  urllib.quote(_password) + '@' + _serverAddress)
    db = conn[_dbname]
    collection = db[_collection]
    result = collection.find_one({'tenantId': _tenantid}, {'_id': 0})
    return result

def AggregationQuery (_connectionString, _userName, _password, _dbName, _collection, event):
    conn = MongoClient('mongodb://' + _userName + ':' + urllib.quote(_password) + '@' +  _connectionString)
    db = conn[_dbName]
    pipeline = None
    
    if      bool(event['devId'].strip()) and \
            not bool(event['vehicleId'].strip()):
                
        if  bool(event['startTime'].strip()) and \
            bool(event['endTime'].strip()):
                pipeline = [
                { '$match': { '$and': [ { 'DevId': event['devId']}, { 'Name' :'VehicleID' } ] } },
                { '$lookup':{ 'from': 'VehicleInfo', 'localField': 'Value', 'foreignField': 'id', 'as': 'Vehicle'}},
                { '$match' : {'Vehicle.time_stamp' : { '$gte': event['startTime'], '$lt': event['endTime']} } } ,
                { '$sort' : { 'Vehicle.time_stamp' : 1 }},
                { '$project': {'_id': 0, 'Vehicle.id' : 1,'Vehicle.lon' : 1,'Vehicle.lat' : 1,'Vehicle.time_stamp' : 1}}]
        else:
                pipeline = [
                { '$match': { '$and': [ { 'DevId':event['devId'] }, { 'Name' :'VehicleID' } ] } },
                { '$lookup':{ 'from': 'VehicleInfo', 'localField': 'Value', 'foreignField': 'id', 'as': 'Vehicle'}},
                { '$project': {'_id': 0, 'Vehicle.id' : 1}}]
                
    elif    not bool(event['devId'].strip())  and \
            bool(event['vehicleId'].strip()):
                pipeline = [
                { '$match': { 'Name' :'VehicleID' } },
                { '$lookup':{ 'from': 'VehicleInfo', 'localField': 'Value', 'foreignField': 'id', 'as': 'Vehicle'}},
                { '$match': { 'Vehicle.id' : event['vehicleId']} },
                { '$project': {'_id': 0, 'DevId' : 1}}]
                
    elif    not bool(event['devId'].strip())  and \
            not bool(event['vehicleId'].strip()):
                pipeline = [
                { '$sort': { 'id': 1, 'time_stamp': 1 } },
                { '$group':{ '_id': '$id', 'latestDate': { '$last': '$time_stamp' }}}]
                _collection = 'VehicleInfo'
    else:
         logger.error('missing either devId or vehicleId as parameter')
    #print ('step 3.1: ' + _collection)
    #print ('step 3.2: ' + str(pipeline))
    result = db[_collection].aggregate(pipeline)
    return(loads(dumps(result)))

def MapReduceQuery (_connectionString, _userName, _password, _dbName, _collection):
    conn = MongoClient('mongodb://' + _userName + ':' + urllib.quote(_password) + '@' +  _connectionString)
    db = conn[_dbName]
    
    _mapFunction = Code(s3.Object('da-s3-bucket', 'MongoQueries/mapFunction.js').get()['Body'].read())
    _reduceFunction = Code(s3.Object('da-s3-bucket', 'MongoQueries/reduceFunction.js').get()['Body'].read())
    
    _finalizeFunction = Code(s3.Object('da-s3-bucket', 'MongoQueries/finalizeFunction.js').get()['Body'].read())
    
    #Alternative command option beside build in Python function
    #result = db.command({
    #    mapReduce: _collection,
    #    map: _mapFunction,
    #   reduce: _reduceFunction,
    #    finalize: _finalizeFunction,
    #    out: {inline : 1}
    #})
    
    #Alternative command option using build in Python function
    result = db[_collection].inline_map_reduce(_mapFunction, _reduceFunction)
    
    return(result)