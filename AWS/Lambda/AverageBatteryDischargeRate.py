from datetime import datetime
import json, boto3

s3 = boto3.resource('s3')
connFunc = boto3.client('lambda')

def lambda_handler(event, context):
    res = []
    result = []
    
    queryText = s3.Object('da-s3-bucket', 'queries/AverageBatteryDischargeRate.sql')
    qry = queryText.get()['Body'].read()
#    qry = "" #fake data. remove once you need a real data
    qry = qry.replace(chr(10), '').replace(chr(13), '\\n').replace(chr(9), '\\t')

    qry = qry.replace('$[shiftStartDateTime]', event['shiftStartDateTime'])
    qry = qry.replace('$[shiftDuration]', event['shiftDuration'])
    qry = qry.replace('$[endDate]', event['endDate'])

    param = b"""{
    "_dbname": "dataanalyticsdb",
    "_host": "dataanalytics.cxvwwvumct05.us-east-1.redshift.amazonaws.com",
    "_port": "5494",
    "_user": "dauser",
    "_query" : " """ + qry + """ "
    }"""

    try:
       datetime.strptime(event['shiftStartDateTime'], '%Y-%m-%dT%H:%M:%S')

       conn = connFunc.invoke(
       FunctionName = 'arn:aws:lambda:us-east-1:984500282156:function:executeQuery',
       Payload = param)

       res = json.loads(conn['Payload'].read())
    
       for r in res:
           result.append({'percentage': r[0], 'countOfDevices': r[1]})
  
#fake data:
#        result.append({'percentage': 5, 'countOfDevices': 187})
#        result.append({'percentage': 10, 'countOfDevices': 650})
#        result.append({'percentage': 15, 'countOfDevices': 172})
#        result.append({'percentage': 20, 'countOfDevices': 925})
#        result.append({'percentage': 25, 'countOfDevices': 10})
#        result.append({'percentage': 30, 'countOfDevices': 0})
#        result.append({'percentage': 35, 'countOfDevices': 0})
#        result.append({'percentage': 40, 'countOfDevices': 0})
#        result.append({'percentage': 45, 'countOfDevices': 172})
#        result.append({'percentage': 45, 'countOfDevices': 21})
#        result.append({'percentage': 50, 'countOfDevices': 107})
#        result.append({'percentage': 55, 'countOfDevices': 0})
#        result.append({'percentage': 60, 'countOfDevices': 85})
#        result.append({'percentage': 65, 'countOfDevices': 0})
#        result.append({'percentage': 70, 'countOfDevices': 21})
#        result.append({'percentage': 75, 'countOfDevices': 0})
#        result.append({'percentage': 80, 'countOfDevices': 2})
#        result.append({'percentage': 85, 'countOfDevices': 0})
#        result.append({'percentage': 90, 'countOfDevices': 0})
#        result.append({'percentage': 95, 'countOfDevices': 0})
#        result.append({'percentage': 100,'countOfDevices': 0})

       return result
    except Exception as e:
       res.append({'Error': e.args})
       return (res)
