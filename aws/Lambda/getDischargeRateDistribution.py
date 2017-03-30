from __future__ import print_function

import json
import psycopg2
import datetime

print('Loading function')


def lambda_handler(event, context):
    res = []
    try:
        dateFrom = event['dateFrom']
        dateTo = event['dateTo']

        datetime.datetime.strptime(dateFrom, '%Y-%m-%d')
        datetime.datetime.strptime(dateTo, '%Y-%m-%d')

        qry = """ select DischargeRate, count(*) as NumberOfDevices from (
select devid, avg((cur_value-next_value)*60/nullif(datediff(minute, time_stamp, next_time), 0)) as DischargeRate from (
SELECT * FROM 
(
SELECT                      
    DevId,
    intvalue AS cur_value,                               
    LEAD(intvalue,1) OVER (PARTITION BY devid ORDER BY time_stamp) next_value,                               
    LEAD(intvalue,2) OVER (PARTITION BY devid ORDER BY time_stamp) next2_value,                               
    time_stamp,                               
    LEAD(time_stamp,1) OVER (PARTITION BY devid ORDER BY time_stamp) next_time,                               
    LEAD(time_stamp,2) OVER (PARTITION BY devid ORDER BY time_stamp) next2_time                        
    FROM devstatint D where time_stamp between '""" + dateFrom + """' and dateadd(s, -1, dateadd(d, 1, '""" + dateTo + """')))t
    WHERE 
    next_value < 100 and next2_value < 100
    and not ((cur_value - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0) > 20 and 
        (next_value - next2_value)*60 / NULLIF(DATEDIFF(MINUTE,next_time,next2_time),0) < 20)
) t group by devid
) t group by DischargeRate
order by DischargeRate""";
        con=psycopg2.connect(dbname= 'dataanalyticsdb', host='dataanalytics.cxvwwvumct05.us-east-1.redshift.amazonaws.com', port= '5494', user= 'dauser', password= 'Arrow$Wild*Fore$t4')
        cur = con.cursor()
        cur.execute(qry)
        data = cur.fetchall()
        for row in data:
            res.append({'DischargeRate': row[0], 'NumberOfDevices': str(row[1])})
        cur.close()
        con.close()
    except Exception as e:
        res.append({'Error': e.args})
    return (res)
