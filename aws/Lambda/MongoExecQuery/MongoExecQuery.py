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
    _soticonfserver = 'ddbdlm.das.soti.net:5494'
	
    _sotitenantid = event['tenantId']

    logger.info('got event{}'.format(event))
   
    #ddb EC2 instance
    url = 'http://ddbdlm.das.soti.net:5495/tenant/configuration'
    
    myResponse = requests.get(url, params={'tenantId': _sotitenantid}, headers={'Content-Type':'application/json', 'x-access-token':'A3J9SyhuZ9TTyNdzCq5LPmNlHb32KasnRothKwnGyCegLvp9bCEMkhYbl51xPzUFK1jHUYh9EeQzqSu0464ZFCpaZ6zmiyXo3p98EbHSzPuFX1zTmX5c26vfpnl1G5khykf8dnloubXcul3T93M4jjLj1UJgnU0OwmjEH5ZA7GmHC0kKmO8gK6KCi9eDDDW6OaTOkoOm'})
    
    if(myResponse.ok):
        result = json.loads(myResponse.content)
        _connectionString = result['mongodbConnectionString']+':5494'
        _userName = result['mongodbUsername']
        _password = result['mongodbPassword']
        _dbName = result['DBName']
        
        _collection = 'DeviceCustomData'
        res = (AggregationQuery (_connectionString, _userName, _password, _dbName, _collection, event))
        return (res)
    else:
        logger.error('call SOTI Mongodb Error.')
        return
    
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
                { '$project': {'_id': 0, 'Vehicle._id': 0}}]
        else:
                pipeline = [
                { '$match': { '$and': [ { 'DevId':event['devId'] }, { 'Name' :'VehicleID' } ]}},
                { '$lookup':{ 'from': 'VehicleInfo', 'localField': 'Value', 'foreignField': 'id', 'as': 'Vehicle'}},
                { '$project': {'_id': 0, 'Vehicle._id': 0}}]
    elif    not bool(event['devId'].strip())  and \
            bool(event['vehicleId'].strip()):
                pipeline = [
                { '$match': { 'Name' :'VehicleID' } },
                { '$lookup':{ 'from': 'VehicleInfo', 'localField': 'Value', 'foreignField': 'id', 'as': 'Vehicle'}},
                { '$match': { 'Vehicle.id' : event['vehicleId']}},
                { '$project': {'_id': 0, 'Vehicle': 0}}]
    elif    not bool(event['devId'].strip())  and \
            not bool(event['vehicleId'].strip()):
                pipeline = [
                { '$sort': { 'id': 1, 'time_stamp': 1 } },
                { '$group':{ '_id': '$id', 'latestDate': { '$last': '$time_stamp' }}},
                { '$lookup':{ 'from': 'VehicleInfo', 'localField': '_id', 'foreignField': 'id', 'as': 'Vehicle'}},
                { '$project': {'_id': 0, 'latestDate': 0, 'Vehicle._id': 0}}]
                _collection = 'VehicleInfo'
    else:
         logger.error('missing either devId or vehicleId as parameter')
    result = db[_collection].aggregate(pipeline)
    return(loads(dumps(result)))
