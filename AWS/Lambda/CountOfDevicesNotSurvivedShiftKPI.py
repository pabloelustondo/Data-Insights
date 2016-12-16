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

        datetime.datetime.strptime(shiftStartDateTime, '%Y-%m-%dT%H:%M:%S')

        qry = """ 
        CREATE temporary TABLE tbl1
                (
                	devid VARCHAR(80) NOT NULL ENCODE lzo DISTKEY,
                	time_stamp timestamp,
                	flag INTEGER NOT NULL ENCODE delta,
                	intvalue int
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
            select 
                devid, 
                time_stamp, 
                case 
	                when intvalue-lead(intvalue, 1) over (partition by devid order by time_stamp)<0 
	                    then 1 -- device has begun charging
	                    else 0 -- device is discharging
                end flag, 
                intvalue
            from devstatint d, variables
            where 
                time_stamp between shiftStartTime and dateadd(hour, """ + shiftDuration + """, shiftStartTime)
                and stattype=-1
        );

select cnt, total from (
    select flagGroup, cnt, sum(cnt) over () as Total
    from (
        select flagGroup, count(*) cnt
        from (
            select devid, 
            case 
            	when sum(flag)=0 and avg(intvalue)<>100 then 0 --
            	when sum(flag)=0 and avg(intvalue)=100 then -1 --device is on external power all shift long
            else 1 
            end flagGroup
            from tbl1
            group by devid
        ) t2
        group by flagGroup
    ) t3
) t4 
where flagGroup=1
;
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
