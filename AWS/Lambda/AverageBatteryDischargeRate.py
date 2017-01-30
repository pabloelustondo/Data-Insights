from datetime import datetime
import json, boto3

s3 = boto3.resource('s3')
connFunc = boto3.client('lambda')

def lambda_handler(event, context):
    res = []
    result = []
    
    queryText = s3.Object('da-s3-bucket', 'queries/AverageBatteryDischargeRate.sql')
    qry = queryText.get()['Body'].read()
    qry = qry.replace(chr(10), '').replace(chr(13), '\\n').replace(chr(9), ' ')
    qry = qry.replace('$[shiftStartDateTime]', event['shiftStartDateTime'])
    qry = qry.replace('$[shiftDuration]', event['shiftDuration'])
    qry = qry.replace('$[endDate]', event['endDate'])

    param = b"""{
 "_dbname": \"""" + event["DBName"] + """\",
 "_host": \"""" + event["RedShiftConnectionString"] + """\",
 "_user": \"""" + event["Username"] + """\",
 "_password" : \"""" + event["Password"] + """\",
 "_query" : \"""" + qry + """\"
}"""
    print (param)
    try:
       datetime.strptime(event['shiftStartDateTime'], '%Y-%m-%dT%H:%M:%S')

       conn = connFunc.invoke(
       FunctionName = 'arn:aws:lambda:us-east-1:984500282156:function:testExecuteQuery',
       Payload = param)

       res = json.loads(conn['Payload'].read())
       print (res)
       for r in res:
           result.append({'percentage': r[0], 'countOfDevices': r[1]})
  
       return result
    except Exception as e:
       res.append({'Error': e.args})
       return (res)
