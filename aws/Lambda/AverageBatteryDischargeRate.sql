WITH 
	dates as (
	select 
		'$[shiftStartDateTime]'::timestamp as shiftStartDateTime,
		$[shiftDuration] as shiftDuration,
		'$[endDate]'::timestamp as endDate
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
 	 , avg((intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0)) as DischargeRate
	 , case 
	 	when avg((intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0))  > 100 then 100
		when avg((intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0)) % 5 = 0  then avg((intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0))
		else (avg((intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0))/5+1)*5
	   end
		as GroupedDischargeRate
  FROM base_info 
  where	next_value<intvalue
  group by devid
)  

, discharge_distribution AS
(
    SELECT 
	  count(DevId) as cnt
	, GroupedDischargeRate
    FROM marked_data
    group by GroupedDischargeRate
)
select sn.KeyVal as Percentage, isnull(dd.cnt, 0) as countOfDevices
from smallnumbers sn
left join discharge_distribution dd
	on dd.GroupedDischargeRate = sn.KeyVal
where keyval <=100 and keyval%5=0
order by Percentage


