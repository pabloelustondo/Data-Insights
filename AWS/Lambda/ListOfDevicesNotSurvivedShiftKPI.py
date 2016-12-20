from __future__ import print_function

import json
import psycopg2
import datetime

print('Loading function')


def lambda_handler(event, context):
    res = []
    try:
        shiftStartDateTime = event['shiftStartDateTime']
        shiftDuration = event['shiftDuration']
        rowsSkip = event['rowsSkip']
        rowsTake = event['rowsTake']

        datetime.datetime.strptime(shiftStartDateTime, '%Y-%m-%dT%H:%M:%S')
#        datetime.datetime.strptime(dateTo, '%Y-%m-%d')

        qry = """ select 'qweasdzxc' as DevId, 20 as LastBatteryStatus, '[10, 20, 30, 40, 50, 60, 50, 40, 30, 20]' as BatteryChargeHistory """;
        con=psycopg2.connect(dbname= 'dataanalyticsdb', host='dataanalytics.cxvwwvumct05.us-east-1.redshift.amazonaws.com', port= '5494', user= 'dauser', password= 'Arrow$Wild*Fore$t4')
        cur = con.cursor()
        cur.execute(qry)
        data = cur.fetchall()
        for row in data:
            res.append({'DevId': str(row[0]), 'LastBatteryStatus': str(row[1]), 'BatteryChargeHistory': str(row[2])})
        cur.close()
        con.close()
    except Exception as e:
        res.append({'Error': e.args})
    return (res)
