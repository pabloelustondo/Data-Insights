from datetime import datetime
import json, boto3

s3 = boto3.resource('s3')
connFunc = boto3.client('lambda')

def lambda_handler(event, context):
    res = []
    result = []
    
    queryText = s3.Object('da-s3-bucket', 'queries/ListOfDevicesNotSurvivedShiftKPI.sql')
    qry = queryText.get()['Body'].read()
    
    if (event['rowsSkip']==""):
        rowsSkip = 0
    else:
        rowsSkip = event['rowsSkip']
        
    if (event['rowsTake']==''):
        rowsTake = 2000000000 # null means everything, there is no limitation
    elif (event['rowsTake'] == '0'):
        return
    else:
        rowsTake = event['rowsTake']

    qry = qry.replace('$[shiftStartDateTime]', event['shiftStartDateTime'])
    qry = qry.replace('$[shiftDuration]', event['shiftDuration'])
    qry = qry.replace('$[rowsSkip]', rowsSkip)
    qry = qry.replace('$[rowsTake]', rowsTake)
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
        if (event['minimumBatteryPercentageThreshold'] == ''):
            raise ValueError('Error: Please specify minimumBatteryPercentageThreshold parameter')
        conn = connFunc.invoke(
        FunctionName = 'arn:aws:lambda:us-east-1:984500282156:function:executeQuery',
        Payload = param)
    
        res = json.loads(conn['Payload'].read())
    
        for r in res:
            result.append({'DevId': str(r[0]), 'LastBatteryStatus' : str(r[1]), 'BatteryChargeHistory': str(r[2])})
    
        return result
    except Exception as e:
        res.append({'Error': e.args})
        return (res)
