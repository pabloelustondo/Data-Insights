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
		s.shiftNumber,
		LEAD(d.intvalue,1) OVER (PARTITION BY d.devid, s.shiftNumber ORDER BY d.time_stamp) next_value,                               
        LEAD(d.intvalue,2) OVER (PARTITION BY d.devid, s.shiftNumber ORDER BY d.time_stamp) next2_value,                               
        LEAD(d.time_stamp,1) OVER (PARTITION BY d.devid, s.shiftNumber ORDER BY d.time_stamp) next_time,                               
        LEAD(d.time_stamp,2) OVER (PARTITION BY d.devid, s.shiftNumber ORDER BY d.time_stamp) next2_time,
        row_number() over (PARTITION BY d.devid, s.shiftNumber ORDER BY d.time_stamp) rownum			
	from devstatint d 
	     INNER JOIN shifts s  ON d.time_stamp between s.shiftStartDateTime and s.shiftEndDateTime
	where d.stattype=-1	     
)
, marked_data AS
(
SELECT
       devid
	 , time_stamp
	 , intvalue
	 , shiftNumber
	 , case 
    	 when intvalue-next_value<0 
           OR (intvalue < $[minimumBatteryPercentageThreshold]) 
		 then 1 -- device got charged or died
    	 else 0 -- device is discharging or on charger
		end bad_case	 	
	 , CASE 
	     WHEN rownum = 1 -- first row per device
		  and intvalue<100 -- contains non-fulled batery
		 THEN 1
		 ELSE 0
	   END AS initial_not_fully_charged	 
	 , CASE 
	     WHEN next_value < 100 
	      AND next2_value < 100
	      AND next2_value < next_value
	      AND intvalue=100
	      AND (intvalue - next_value)*60 / NULLIF(DATEDIFF(MINUTE,time_stamp,next_time),0) > 10
	      AND (next_value - next2_value)*60 / NULLIF(DATEDIFF(MINUTE,next_time, next2_time),0) < 10 
		 THEN 1
		 ELSE 0
	   END AS too_fast_first_slope	 
  FROM base_info 
)  
, agg_marked_data AS
(
SELECT 
       devid
	 , time_stamp
	 , intvalue
	 , shiftNumber
	 , bad_case
	 , initial_not_fully_charged
	 , too_fast_first_slope
	 , SUM(bad_case) OVER(PARTITION BY devid) AS total_bad_case
	 , SUM(initial_not_fully_charged) OVER(PARTITION BY devid) AS total_initial_not_fully_charged
	 , SUM(too_fast_first_slope) OVER(PARTITION BY devid) AS total_too_fast_first_slope
	 , row_number() over (partition by DevId order by time_stamp desc) rownum
	 , last_value(intvalue) over (partition by DevId order by time_stamp rows between unbounded preceding and unbounded following) LastValue
  FROM marked_data	   
)
SELECT 
      DevId, 
	  LastValue as LastBatteryStatus, '[' + listagg(intvalue, ', ') within group (order by time_stamp) + ']' BatteryChargeHistory
FROM agg_marked_data
where total_bad_case > 0 
and rownum<=10
and (total_initial_not_fully_charged >0 or total_too_fast_first_slope >0)
group by DevId, LastValue
order by DevId  limit $[rowsTake] offset $[rowsSkip]