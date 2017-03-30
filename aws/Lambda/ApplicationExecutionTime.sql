WITH 
calculatedRange AS (
	SELECT AppId, DevId
	, 
		CASE 
			WHEN c.Date<dsa.starttime THEN dsa.StartTime
			ELSE c.Date
		END AS brange
	,	CASE 
			WHEN c.Date<dsa.EndtimeRounded THEN DATEADD(hour, 1, c.Date )
			ELSE dsa.Endtime
		END AS erange
		FROM DeviceStatApplication dsa
		INNER JOIN calendar c ON c.Date between StartTimeRounded AND EndTimeRounded
		WHERE c.Date BETWEEN '$[DateFrom]' AND dateadd(second, -1, '$[DateTo]')
)
SELECT AppId, count(distinct DevId), SUM(DATEDIFF (SECOND, brange, erange))/60 AS RunMinutes
FROM calculatedRange
GROUP BY AppId
having sum(DATEDIFF (SECOND, brange, erange))/60>0;
