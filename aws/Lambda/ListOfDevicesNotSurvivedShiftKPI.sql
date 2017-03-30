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
                '$[shiftStartDateTime]'::timestamp as shiftStartTime
                )
            select devid, time_stamp, 
case 
    when intvalue-lead(intvalue, 1) over (partition by devid order by time_stamp)<0 
            OR (intvalue < $[minimumBatteryPercentageThreshold]) then 1 -- device got charged
    else 0 -- device is discharging or on charger
end occ, intvalue
, last_value(intvalue) over (partition by DevId order by time_stamp rows between unbounded preceding and unbounded following) LastValue
from devstatint d, variables
where time_stamp
between shiftStartTime 
and dateadd(hour, $[shiftDuration], shiftStartTime)
                and stattype=-1)
;

select a.DevId, LastValue as LastBatteryStatus,
'[' + listagg(t.intvalue, ', ') within group (order by time_stamp) + ']' BatteryChargeHistory,
case 
	when d.typeid between 700 and 799 then 'iOS'
	when d.typeid between 800 and 899 or d.TypeId between 600 and 699 then 'Android'
	ELSE 'Windows'
end OS,
 d.Manufacturer , d.Model , 
 /* since current device data in Redshift does not have carrier info */
 /* there is a mock data. Need to be replaced with a real data once available */
case mod(cast(random()*100 as int), 3)
	when 0 then 'Rogers'
	when 1 then 'Bell'
	when 2 then 'Fido'
	else 'Unknown'
end Carrier
from (
select devid
from tbl1
group by devid
having sum(occ)<>0
) a
inner join tbl1 t on t.DevId = a.DevId
INNER JOIN devinfo d ON d.devid=a.devid
group by a.DevId, LastValue, TypeId, Manufacturer, Model
order by a.DevId limit $[rowsTake] offset $[rowsSkip]


