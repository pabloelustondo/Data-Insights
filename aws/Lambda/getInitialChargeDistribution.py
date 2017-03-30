from __future__ import print_function

import json
import psycopg2

print('Loading function')


def lambda_handler(event, context):
    res = []
    try:
        dateFrom = event['params']['querystring']['dateFrom']
        dateTo = event['params']['querystring']['dateTo']
    except Exception as e:
        dateFrom = ''
        dateTo = ''
    qry = """ select *, numberofdevices*1.00/sum(numberofdevices) over () as Percentage from  
        (SELECT Rng,
       COUNT(*) AS NumberOfDevices
FROM (SELECT next_value,
             CASE
                WHEN next_value BETWEEN 0 AND 10 and firstslope > 20 and secondslope between 0 and 20 THEN '0-10'               
                WHEN next_value BETWEEN 11 AND 20 and firstslope > 20 and secondslope between 0 and 20 THEN '11-20'               
                WHEN next_value BETWEEN 21 AND 30 and firstslope > 20 and secondslope between 0 and 20 THEN '21-30'               
                WHEN next_value BETWEEN 31 AND 40 and firstslope > 20 and secondslope between 0 and 20 THEN '31-40'               
                WHEN next_value BETWEEN 41 AND 50 and firstslope > 20 and secondslope between 0 and 20 THEN '41-50'               
                WHEN next_value BETWEEN 51 AND 60 and firstslope > 20 and secondslope between 0 and 20 THEN '51-60'               
                WHEN next_value BETWEEN 61 AND 70 and firstslope > 20 and secondslope between 0 and 20 THEN '61-70'               
                WHEN next_value BETWEEN 71 AND 80 and firstslope > 20 and secondslope between 0 and 20 THEN '71-80'               
                WHEN next_value BETWEEN 81 AND 90 and firstslope > 20 and secondslope between 0 and 20 THEN '81-90'               
                else '91-100'             
             END AS Rng
      FROM  (SELECT next_value, 
                    (cur_value - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0) as FirstSlope, 
                    (next_value - next2_value)*60 / NULLIF(DATEDIFF(MINUTE,next_time,next2_time),0) as SecondSlope
                  FROM (SELECT 
                               intvalue AS cur_value,
                               LEAD(intvalue,1) OVER (PARTITION BY devid ORDER BY time_stamp) next_value,
                               LEAD(intvalue,2) OVER (PARTITION BY devid ORDER BY time_stamp) next2_value,
                               time_stamp,
                               LEAD(time_stamp,1) OVER (PARTITION BY devid ORDER BY time_stamp) next_time,
                               LEAD(time_stamp,2) OVER (PARTITION BY devid ORDER BY time_stamp) next2_time
                        FROM devstatint D"""
    if (dateFrom != '') & (dateTo != ''):
        qry = qry + " where time_stamp between '" + dateFrom + "' and dateadd(s, -1, dateadd(d, 1, '" + dateTo + "'))"
    qry = qry + """ ) a
                  WHERE next_value < 100
                  AND   cur_value = 100
                  AND   next2_value < 100) t
           ) r
GROUP BY Rng) a order by Rng
;"""
    con=psycopg2.connect(dbname= 'dataanalyticsdb', host='dataanalytics.cxvwwvumct05.us-east-1.redshift.amazonaws.com', port= '5494', user= 'dauser', password= 'Arrow$Wild*Fore$t4')
    cur = con.cursor()
    cur.execute(qry)
    data = cur.fetchall()
    for row in data:
        res.append({'Rng': row[0], 'NumberOfDevices': str(row[1]), 'Percentage': str(row[2])})
    cur.close()
    con.close()
    return (res)
