from __future__ import print_function

import json
import psycopg2
import datetime

print('Loading function')


def lambda_handler(event, context):
    res = []
    try:
        shiftStartTime = event['shiftStartTime']
        shiftDuration = event['shiftDuration']

        datetime.datetime.strptime(shiftStartTime, '%Y-%m-%dT%H:%M:%S')
#        datetime.datetime.strptime(dateTo, '%Y-%m-%d')

        qry = """ 
with variables as (    
	SELECT
	'""" + shiftStartTime + """'::timestamp as shiftStartTime
	)
select cnt, total from (
	select occ, cnt, sum(cnt) over () as Total
	from (
		select occ, count(*) cnt 
		from (
			select devid, 
			case 
				when sum(occ)=0 and avg(intvalue)<>100 then 0 
				when sum(occ)=0 and avg(intvalue)=100 then -1
			else 1 
			end occ
			from (
				select devid, intvalue, 
				case 
					when intvalue-lead(intvalue, 1) over (partition by devid order by time_stamp)<0 
						then 1 
					else 0 
				end occ
				from devstatint d, variables
				where time_stamp
				between shiftStartTime and dateadd(hour, """ + shiftDuration + """, shiftStartTime)
				and stattype=-1
			) t1
			group by devid
		) t2
		group by occ
	) t3
) t4 where occ=1
        """;
        con=psycopg2.connect(dbname= 'dataanalyticsdb', host='dataanalytics.cxvwwvumct05.us-east-1.redshift.amazonaws.com', port= '5494', user= 'dauser', password= 'Arrow$Wild*Fore$t4')
        cur = con.cursor()
        cur.execute(qry)
        data = cur.fetchall()
        for row in data:
            res.append({'TotalActiveDevices': str(row[1]), 'CountDevicesNotLastedShift': str(row[0])})
        cur.close()
        con.close()
    except Exception as e:
        res.append({'Error': e.args})
    return (res)
