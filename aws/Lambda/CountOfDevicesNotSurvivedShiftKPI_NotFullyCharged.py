from datetime import datetime
import json, boto3

s3 = botoa3.resource('s3')
connFunc = boto3.client('lambda')

def lambda_handler(event, context):
    res = []
    result = []
    
    queryText = s3.Object('da-s3-bucket', 'queries/CountOfDevicesNotSurvivedShiftKPI_NotFullyCharged.sql')
    qry = queryText.get()['Body'].read()

    qry = qry.replace(chr(10), '').replace(chr(13), '\\n').replace(chr(9), '\\t')
    qry = qry.replace('$[shiftStartDateTime]', event['shiftStartDateTime'])
    qry = qry.replace('$[shiftDuration]', event['shiftDuration'])
    qry = qry.replace('$[minimumBatteryPercentageThreshold]', event['minimumBatteryPercentageThreshold'])
    qry = qry.replace('$[endDate]', event['endDate'])
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
        datetime.strptime(event['endDate'], '%Y-%m-%d')

        if (event['minimumBatteryPercentageThreshold'] == ''):
            raise ValueError('Error: Please specify minimumBatteryPercentageThreshold parameter')

        conn = connFunc.invoke(
        FunctionName = 'arn:aws:lambda:us-east-1:984500282156:function:executeQuery',
        Payload = param)

        res = json.loads(conn['Payload'].read())
    
        for r in res:
           result.append({'CountDevicesNotLastedShift': r[0], 'CountDevicesNotFullyCharged': r[1]})
  
#fake data:
#        result.append({'CountDevicesNotLastedShift': 100, 'CountDevicesNotFullyCharged': 50})
        return result
    except Exception as e:
        res.append({'Error': e.args})
        return (res)
