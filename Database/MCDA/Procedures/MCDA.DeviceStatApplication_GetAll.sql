CREATE PROCEDURE [MCDA].[DeviceStatApplication_GetAll]
(	
	@BatchSize int = 0
)
AS
BEGIN
	SET NOCOUNT ON;
	Declare @status int = -1;
	Declare @lastTime datetime;
	Declare @PreviousTime datetime;

	Declare @lastTimeTmp datetime;
	Declare @tablename nvarchar(256);

	select @tablename = 'DeviceStatApplication'

	IF (@BatchSize = 0 )
		SET @BatchSize = 400;

	IF EXISTS(SELECT 1 from [MCDA].[DeviceSyncStatus] where Name = @tablename)
	BEGIN
		
		Select	@status=[Status], 
				@lastTime=LastSyncTime, 
				@PreviousTime=PreviousSyncTime 
				from [MCDA].[DeviceSyncStatus] where Name = @tablename

		If (@status = 1)		--Improgress
			return;
		ELSE IF (@status = 0)	--Success
			BEGIN
				Select @lastTimeTmp = max(a.ts) 
				from (
					select top (@BatchSize) Endtime as ts from [$(MobiControlDB)].dbo.DeviceStatApplication WITH (NOLOCK) 
					where Endtime > @lastTime
					order by Endtime asc
					 ) a

				IF( @lastTimeTmp IS NOT NULL)
				BEGIN 
					EXEC [MCDA].[DeviceSyncStatus_Update] @Name=@tablename, @Status=0, @LastSyncTime=@lastTimeTmp, @PreviousSyncTime=@lastTime
				END

				SELECT A.DevId, A.AppId, A.StartTime, A.EndTime, DATEADD(HOUR, DATEDIFF(HOUR, 0, StartTime), 0) AS StartTimeRounded, DATEADD(HOUR, DATEDIFF(HOUR, 0, EndTime), 0) AS EndTimeRounded
					FROM [$(MobiControlDB)].dbo.DeviceStatApplication AS A WITH (NOLOCK) 
					INNER JOIN [$(MobiControlDB)].dbo.devInfo as D WITH (NOLOCK) ON A.DevId = D.DevId
					WHERE Endtime > @lastTime and Endtime <= @lastTimeTmp
			END
		ELSE					--failed
			BEGIN
				IF( @PreviousTime IS NOT NULL)
				BEGIN
					EXEC [MCDA].[DeviceSyncStatus_Update] @Name=@tablename, @Status=1

					SELECT A.DevId, A.AppId, A.StartTime, A.EndTime, DATEADD(HOUR, DATEDIFF(HOUR, 0, StartTime), 0) AS StartTimeRounded, DATEADD(HOUR, DATEDIFF(HOUR, 0, EndTime), 0) AS EndTimeRounded
					FROM [$(MobiControlDB)].dbo.DeviceStatApplication AS A WITH (NOLOCK) 
					INNER JOIN [$(MobiControlDB)].dbo.devInfo as D WITH (NOLOCK) ON A.DevId = D.DevId
					WHERE Endtime > @PreviousTime and Endtime <= @lastTime
				END
				ELSE
				BEGIN
					EXEC [MCDA].[DeviceSyncStatus_Update] @Name=@tablename, @Status=1

					SELECT A.DevId, A.AppId, A.StartTime, A.EndTime, DATEADD(HOUR, DATEDIFF(HOUR, 0, StartTime), 0) AS StartTimeRounded, DATEADD(HOUR, DATEDIFF(HOUR, 0, EndTime), 0) AS EndTimeRounded
					FROM [$(MobiControlDB)].dbo.DeviceStatApplication AS A WITH (NOLOCK) 
					INNER JOIN [$(MobiControlDB)].dbo.devInfo as D WITH (NOLOCK) ON A.DevId = D.DevId
					WHERE A.Endtime <= @lastTime
				END
				
			END
	END
	ELSE 
	BEGIN
		Select @lastTime = max(a.ts) from (
			select top (@BatchSize) Endtime as ts from [$(MobiControlDB)].dbo.DeviceStatApplication WITH (NOLOCK) order by Endtime asc
			) a

		IF (@lastTime IS NOT NULL AND NOT EXISTS(SELECT 1 from [MCDA].[DeviceSyncStatus] where Name = @tablename))
		BEGIN
			EXEC [MCDA].[DeviceSyncStatus_Insert] @Name = @tablename, @status = 1, @LastSyncTime = @lastTime

			SELECT A.DevId, A.AppId, A.StartTime, A.EndTime, DATEADD(HOUR, DATEDIFF(HOUR, 0, StartTime), 0) AS StartTimeRounded, DATEADD(HOUR, DATEDIFF(HOUR, 0, EndTime), 0) AS EndTimeRounded
					FROM [$(MobiControlDB)].dbo.DeviceStatApplication AS A WITH (NOLOCK) 
					INNER JOIN [$(MobiControlDB)].dbo.devInfo as D WITH (NOLOCK) ON A.DevId = D.DevId
				WHERE A.Endtime <= @lastTime
		END
	END
END