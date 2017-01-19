            with variables as (    
                SELECT
                '$[shiftStartDateTime]'::timestamp as shiftStartTime
                )
select devid into #t from (
			select 
				devid, 
				time_stamp, 
				case 
    				when intvalue-lead(intvalue, 1) over (partition by devid order by time_stamp)<0 
            			OR (intvalue < $[minimumBatteryPercentageThreshold]) 
					then 1 -- device got charged
    				else 0 -- device is discharging or on charger
				end occ, 
				intvalue
			from devstatint d, variables
			where time_stamp between shiftStartTime and dateadd(hour, $[shiftDuration], shiftStartTime)
                and stattype=-1)
group by devid
having sum(occ)<>0;

SELECT 
(select count(*) from #t) as CountDevicesNotLastedShift, 
count(*) as count_Device_Not_Fully_Charged
FROM 
(
	with variables as (    
		                SELECT
		                '$[shiftStartDateTime]'::timestamp as shiftStartTime
		                )
	SELECT                      
        d.DevId,
        intvalue AS cur_value,                               
		LEAD(intvalue,1) OVER (PARTITION BY d.devid ORDER BY time_stamp) next_value,                               
        LEAD(intvalue,2) OVER (PARTITION BY d.devid ORDER BY time_stamp) next2_value,                               
        time_stamp,                               
        LEAD(time_stamp,1) OVER (PARTITION BY d.devid ORDER BY time_stamp) next_time,                               
        LEAD(time_stamp,2) OVER (PARTITION BY d.devid ORDER BY time_stamp) next2_time,
        row_number() over (PARTITION BY d.devid ORDER BY time_stamp) rownum							
        FROM devstatint d, variables, #t t
	where t.DevId = d.DevId
		 and  time_stamp between shiftStartTime and dateadd(hour, $[shiftDuration], shiftStartTime)
		 and StatType = -1
	)t
WHERE 
(
		next_value < 100 
	and next2_value < 100
	and next2_value < next_value
	and cur_value=100
	and (cur_value - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0) > 10
	and (next_value - next2_value)*60 / NULLIF(DATEDIFF(MINUTE,next_time, next2_time),0) < 10	
)
or 
(rownum=1 and cur_value<100)
;
