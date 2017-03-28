from datetime import datetime
import json, boto3

s3 = boto3.resource('s3')
connFunc = boto3.client('lambda')

def lambda_handler(event, context):
    res = []
    result = []
    
    queryText = s3.Object('da-s3-bucket', 'queries/HighAverageBatteryDischargeRate.sql')
    qry = queryText.get()['Body'].read()
#    qry = "" #fake data. remove once you need a real data
    qry = qry.replace(chr(10), '').replace(chr(13), '\\n').replace(chr(9), '\\t')

    qry = qry.replace('$[shiftStartDateTime]', event['shiftStartDateTime'])
    qry = qry.replace('$[shiftDuration]', event['shiftDuration'])
    qry = qry.replace('$[minimumThresholdDischargeRate]', event['minimumThresholdDischargeRate'])
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

        if (event['minimumThresholdDischargeRate'] == ''):
            raise ValueError('Error: Please specify minimumThresholdDischargeRate parameter')

        conn = connFunc.invoke(
        FunctionName = 'arn:aws:lambda:us-east-1:984500282156:function:executeQuery',
        Payload = param)

        res = json.loads(conn['Payload'].read())
    
        for r in res:
            result.append({'CountDevicesNotLastedShift': r[0], 'CountDevicesHighDischargeRate': r[1]})
  
#fake data:
#        result.append({'DeviceId': 'abcd', 'DeviceName': 'Samsung Note7', 'BatteryChargeLevel' : '[100,90,80,70,60,50,40,30,20,10,20,30,20]'})
#        result.append({'DeviceId': 'efg', 'DeviceName': 'Samsung Note5', 'BatteryChargeLevel' : '[70,60,80,70,60,70,80,50,20,30,20,30,20]'})        
        return result
    except Exception as e:
        res.append({'Error': e.args})
        return (res)
