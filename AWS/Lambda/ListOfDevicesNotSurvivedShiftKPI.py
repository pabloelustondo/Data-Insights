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

        qry = """
        CREATE temporary TABLE tbl1
                (
                	devid VARCHAR(80) NOT NULL ENCODE lzo DISTKEY,
                	time_stamp timestamp,
                	occ INTEGER NOT NULL ENCODE delta,
                	intvalue int,
	                LastValue int
                )
            SORTKEY
                (
                	devid,
                	time_stamp
                );
        insert into tbl1 
        (
            with variables as (    
                SELECT
                '""" + shiftStartDateTime + """'::timestamp as shiftStartTime
                )
            select devid, time_stamp, 
case 
	when intvalue-lead(intvalue, 1) over (
				partition by devid 
					order by time_stamp)<0 then 1 -- device has begun charging
	else 0 -- device is discharging
end occ, intvalue
, last_value(intvalue) over (partition by DevId order by time_stamp rows between unbounded preceding and unbounded following) LastValue
from devstatint d, variables
where time_stamp
between shiftStartTime 
and dateadd(hour, """ + shiftDuration + """, shiftStartTime)
                and stattype=-1)
;

select a.DevId, LastValue as LastBatteryStatus, '[' + listagg(t.intvalue, ', ') within group (order by time_stamp) + ']' BatteryChargeHistory
from (
select devid
from tbl1
group by devid
having sum(occ)<>0
) a
inner join tbl1 t on t.DevId = a.DevId
group by a.DevId, LastValue
order by a.DevId """
        if (rowsSkip == "") | (rowsTake == ""): 
            qry = qry
        if (rowsTake == "0"):
            return;
        else:
            qry = qry + """ limit """ + rowsTake + """ offset """ + rowsSkip
            
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
