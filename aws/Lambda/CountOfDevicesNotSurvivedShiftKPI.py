from datetime import datetime
import json, boto3

s3 = boto3.resource('s3')
connFunc = boto3.client('lambda')

def lambda_handler(event, context):
    res = []
    result = []
    
    queryText = s3.Object('da-s3-bucket', 'queries/CountOfDevicesNotSurvivedShiftKPI.sql')
    qry = queryText.get()['Body'].read()
    
    qry = qry.replace('$[shiftStartDateTime]', event['shiftStartDateTime'])
    qry = qry.replace('$[shiftDuration]', event['shiftDuration'])
    qry = qry.replace('$[minimumBatteryPercentageThreshold]', event['minimumBatteryPercentageThreshold'])
    
    qry = qry.replace(chr(10), '').replace(chr(13), '\\n').replace(chr(9), '\\t')

    param = b"""{
    "_dbname": "dataanalyticsdb",
    "_host": "dataanalytics.cxvwwvumct05.us-east-1.redshift.amazonaws.com",
    "_port": "5494",
    "_user": "dauser",
    "_password": "Arrow$Wild*Fore$t4",
    "_query" : " """ + qry + """ "
    }"""

    try:
        datetime.strptime(event['shiftStartDateTime'], '%Y-%m-%dT%H:%M:%S')

        if (event['minimumBatteryPercentageThreshold'] == ''):
            raise ValueError('Error: Please specify minimumBatteryPercentageThreshold parameter')

        conn = connFunc.invoke(
        FunctionName = 'arn:aws:lambda:us-east-1:984500282156:function:executeQuery',
        Payload = param)
    
        res = json.loads(conn['Payload'].read())
    
        for r in res:
            result.append({'CountDevicesLastedShift': r[0], 'CountDevicesChargingEntireShift' : r[1], 'CountDevicesNotLastedShift': r[2], 'CountTotalActiveDevices': r[3]})
    
        return result
    except Exception as e:
        res.append({'Error': e.args})
        return (res)
