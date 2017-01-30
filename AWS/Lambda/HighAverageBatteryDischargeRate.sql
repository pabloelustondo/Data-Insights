WITH 
	dates as (
	select 
		'2016-08-22T10:00:00'::timestamp as shiftStartDateTime,
		12 as shiftDuration,
		'2016-08-25'::timestamp as endDate,
		10 as minimumThresholdDischargeRate
		)
, shifts as (
	select 
		dateadd(d, KeyVal-1, shiftStartDateTime) shiftStartDateTime, dateadd(h, shiftDuration, dateadd(d, KeyVal-1, shiftStartDateTime)) shiftEndDateTime, KeyVal as shiftNumber
	from dates
	cross join SmallNumbers sm
	where sm.KeyVal <= datediff(d, shiftStartDateTime, endDate)
	)
,base_info AS
(
	select 
		d.devid, 
		d.time_stamp, 				
		d.intvalue,
		LEAD(d.intvalue,1) OVER (PARTITION BY d.devid, s.shiftNumber ORDER BY d.time_stamp) next_value,                               
        LEAD(d.time_stamp,1) OVER (PARTITION BY d.devid, s.shiftNumber ORDER BY d.time_stamp) next_time                               
	from devstatint d 
	     INNER JOIN shifts s  ON d.time_stamp between s.shiftStartDateTime and s.shiftEndDateTime
	where d.stattype=-1	
)
, marked_data AS
(
  SELECT
       devid
     , intvalue
	 , time_stamp
	 , next_value
	 , next_time
	 , case 
	 	when avg((intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0)) over (partition by DevId) > 100 then 100
		when avg((intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0)) over (partition by DevId) % 5 = 0  then avg((intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0)) over (partition by DevId)
		else (avg((intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0)) over (partition by DevId)/5+1)*5
	   end
		as GroupedDischargeRate
	 , last_value(next_value) over (partition by DevId order by time_stamp rows between unbounded preceding and unbounded following) LastValue
  FROM base_info 
  where 
	next_value<intvalue
)  

select 
	DevId,
	GroupedDischargeRate,
	LastValue as LastBatteryStatus, '[' + listagg(intvalue, ', ') within group (order by time_stamp) + ', ' + LastValue + ']' BatteryChargeHistory
from marked_data
where groupedDischargeRate > 20
group by DevId, LastValue, GroupedDischargeRate

