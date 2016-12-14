CREATE PROCEDURE [MCDA].[DeviceSyncStatus_Update]
(
	@Name  NVARCHAR(255),
	@Status	int,
	@LastSyncTime datetime = null,
	@PreviousSyncTime datetime = null
)
AS
BEGIN
		UPDATE [MCDA].[DeviceSyncStatus]
		SET [Status] = @Status,
			[LastSyncTime] = CASE WHEN @LastSyncTime IS NOT NULL THEN @LastSyncTime ELSE [LastSyncTime] END,
			[PreviousSyncTime] = CASE WHEN @PreviousSyncTime IS NOT NULL THEN @PreviousSyncTime ELSE [PreviousSyncTime] END
		WHERE [Name] = @Name

END;