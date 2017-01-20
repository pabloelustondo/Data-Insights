from datetime import datetime
import json, boto3

s3 = boto3.resource('s3')
connFunc = boto3.client('lambda')

def lambda_handler(event, context):
    res = []
    result = []
    
    if (event['rowsSkip']==""):
        rowsSkip = 0
    else:
        rowsSkip = event['rowsSkip']
        
    if (event['rowsTake']==''):
        rowsTake = 2000000000 # null means everything, there is no limitation
    else:
        rowsTake = event['rowsTake']
    
    queryText = s3.Object('da-s3-bucket', 'queries/ListOfDevicesNotSurvivedShiftKPI_NotFullyCharged.sql')
    qry = queryText.get()['Body'].read()
#    qry = "" #fake data. remove once you need a real data
    qry = qry.replace(chr(10), '').replace(chr(13), '\\n').replace(chr(9), '\\t')

    qry = qry.replace('$[shiftStartDateTime]', event['shiftStartDateTime'])
    qry = qry.replace('$[shiftDuration]', event['shiftDuration'])
    qry = qry.replace('$[minimumBatteryPercentageThreshold]', event['minimumBatteryPercentageThreshold'])
    qry = qry.replace('$[endDate]', event['endDate'])
    qry = qry.replace('$[rowsSkip]', rowsSkip)
    qry = qry.replace('$[rowsTake]', rowsTake)    
    
#    return qry
    param = b"""{
    "_dbname": "dataanalyticsdb",
    "_host": "dataanalytics.cxvwwvumct05.us-east-1.redshift.amazonaws.com",
    "_port": "5494",
    "_user": "dauser",
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
           result.append({'DeviceId': r[0], 'LastBatteryValue': r[1], 'BatteryChargeLevel': r[2]})
  
#fake data:
#        result.append({'DeviceId': 'abcd', 'DeviceName': 'Samsung Note7', 'BatteryChargeLevel' : '[100,90,80,70,60,50,40,30,20,10,20,30,20]'})
#        result.append({'DeviceId': 'efg', 'DeviceName': 'Samsung Note5', 'BatteryChargeLevel' : '[70,60,80,70,60,70,80,50,20,30,20,30,20]'})        
        return result
    except Exception as e:
        res.append({'Error': e.args})
        return (res)
