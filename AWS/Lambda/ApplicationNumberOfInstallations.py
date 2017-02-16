from datetime import datetime
import json, boto3

s3 = boto3.resource('s3')
connFunc = boto3.client('lambda')

def lambda_handler(event, context):
    res = []
    result = []

    queryText = s3.Object('da-s3-bucket', 'queries/ApplicationNumberOfInstallations.sql')
    qry = queryText.get()['Body'].read()
    qry = qry.replace(chr(10), '').replace(chr(13), '\\n').replace(chr(9), ' ')

    param = b"""{
 "_dbname": \"""" + event["headers"]["DBName"] + """\",
 "_host": \"""" + event["headers"]["RedShiftConnectionString"] + """\",
 "_user": \"""" + event["headers"]["Username"] + """\",
 "_password" : \"""" + event["headers"]["Password"] + """\",
 "_query" : \"""" + qry + """\"
}"""
    try:
       conn = connFunc.invoke(
       FunctionName = 'arn:aws:lambda:us-east-1:984500282156:function:testExecuteQuery',
       Payload = param)

       res = json.loads(conn['Payload'].read())
       print (res)
       for r in res:
           result.append({'AppId': r[0], 'NumberOfInstallations' : r[1]})
  
       return result
    except Exception as e:
       res.append({'Error': e.args})
       return (res)
