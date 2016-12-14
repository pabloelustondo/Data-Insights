CREATE PROCEDURE [MCDA].[DeviceSyncStatus_GetAll]
AS
BEGIN
	SET NOCOUNT ON;
	SELECT  t.[Name], t.[Status], t.[LastSyncTime], t.[PreviousSyncTime], t.[ServerTime]
	FROM
		[MCDA].[DeviceSyncStatus] t
END