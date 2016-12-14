CREATE PROCEDURE [MCDA].[DeviceSyncStatus_Insert]
(
	@Name  NVARCHAR(255),
	@Status	int,
	@LastSyncTime datetime,
	@PreviousSyncTime datetime = null
)
AS
BEGIN
	SET NOCOUNT ON;
	IF NOT EXISTS(SELECT * FROM [MCDA].[DeviceSyncStatus] WHERE Name = @Name)
	Begin
		INSERT INTO  [MCDA].[DeviceSyncStatus] (
			[Name],
			[Status], 
			[LastSyncTime],
			[PreviousSyncTime]
		)
		VALUES ( 
			@Name,
			@Status, 
			@LastSyncTime,
			@PreviousSyncTime
		)
	End
END;