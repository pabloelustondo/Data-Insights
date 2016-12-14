CREATE PROCEDURE [MCDA].[DeviceSyncStatus_Get]
(
@Name  NVARCHAR(255)
)
AS
BEGIN
	SET NOCOUNT ON;
	SELECT  t.[Name], t.[Status], t.[LastSyncTime], t.[PreviousSyncTime], t.[ServerTime]
	FROM
		[MCDA].[DeviceSyncStatus] t 
		where t.[Name] = @Name
END