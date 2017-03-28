from datetime import datetime
import json, boto3

s3 = boto3.resource('s3')
connFunc = boto3.client('lambda')

def lambda_handler(event, context):
    res = []
    result = []

    queryText = s3.Object('da-s3-bucket', 'queries/ApplicationExecutionTime.sql')
    qry = queryText.get()['Body'].read()
    qry = qry.replace(chr(10), '').replace(chr(13), '\\n').replace(chr(9), ' ')
    qry = qry.replace('$[DateFrom]', event['DateFrom'])
    qry = qry.replace('$[DateTo]', event['DateTo'])

    param = b"""{
 "_dbname": \"""" + event["headers"]["DBName"] + """\",
 "_host": \"""" + event["headers"]["RedShiftConnectionString"] + """\",
 "_user": \"""" + event["headers"]["Username"] + """\",
 "_password" : \"""" + event["headers"]["Password"] + """\",
 "_query" : \"""" + qry + """\"
}"""
    try:
       datetime.strptime(event['DateFrom'], '%Y-%m-%dT%H:%M:%S')
       datetime.strptime(event['DateTo'], '%Y-%m-%dT%H:%M:%S')

       conn = connFunc.invoke(
       FunctionName = 'arn:aws:lambda:us-east-1:984500282156:function:testExecuteQuery',
       Payload = param)

       res = json.loads(conn['Payload'].read())
       print (res)
       for r in res:
           result.append({'AppId': r[0], 'NumberOfDevices' : r[1], 'ExecutionTimeMinutes': r[2]})
  
       return result
    except Exception as e:
       res.append({'Error': e.args})
       return (res)
