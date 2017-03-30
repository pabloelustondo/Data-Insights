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
                '$[shiftStartDateTime]'::timestamp as shiftStartTime
                )
            select 
                devid, 
                time_stamp, 
				case 
	                when (intvalue-lead(intvalue, 1) over (partition by devid order by time_stamp)<0 ) 
					or (intvalue <= $[minimumBatteryPercentageThreshold])
						then 1 -- device got charged or crossed a threshold
	                    else 0 -- device is discharging or still on charger
                end flag,  
                intvalue
            from devstatint d, variables
            where 
                time_stamp between shiftStartTime and dateadd(hour, $[shiftDuration], shiftStartTime)
                and stattype=-1
        );

select 
	sum(CountDevicesLastedShift) as CountDevicesLastedShift,
	sum(CountDevicesChargingEntireShift) as CountDevicesChargingEntireShift,
	sum(CountDevicesNotLastedShift) as CountDevicesNotLastedShift,
	sum(cnt) as CountTotalActiveDevices 
from (
	select 
		case when flaggroup=0 then cnt else 0 end as CountDevicesLastedShift,
		case when flaggroup=-1 then cnt else 0 end as CountDevicesChargingEntireShift,
		case when flaggroup=1 then cnt else 0 end as CountDevicesNotLastedShift,
		cnt as cnt from (
	        select flagGroup, count(*) cnt
	        from (
	            select devid, 
	            case 
	            	when sum(flag)=0 and avg(intvalue)<>100 then 0 -- device is good
	            	when sum(flag)=0 and avg(intvalue)=100 then -1 -- device is on external power all shift long
	            else 1 
	            end flagGroup
	            from tbl1
	            group by devid
	        ) t2
	        group by flagGroup
	) t3
) t4
;