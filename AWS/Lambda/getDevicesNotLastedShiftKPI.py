from __future__ import print_function

import json
import psycopg2
import datetime

print('Loading function')


def lambda_handler(event, context):
    res = []
    try:
#        dateFrom = event['dateFrom']
#        dateTo = event['dateTo']

#        datetime.datetime.strptime(dateFrom, '%Y-%m-%d')
#        datetime.datetime.strptime(dateTo, '%Y-%m-%d')

        qry = """ select 100 as totalactivedevices, 25 as countdevicesnotlastedshift """;
        con=psycopg2.connect(dbname= 'dataanalyticsdb', host='dataanalytics.cxvwwvumct05.us-east-1.redshift.amazonaws.com', port= '5494', user= 'dauser', password= 'Arrow$Wild*Fore$t4')
        cur = con.cursor()
        cur.execute(qry)
        data = cur.fetchall()
        for row in data:
            res.append({'TotalActiveDevices': row[0], 'CountDevicesNotLastedShift': str(row[1])})
        cur.close()
        con.close()
    except Exception as e:
        res.append({'Error': e.args})
    return (res)
