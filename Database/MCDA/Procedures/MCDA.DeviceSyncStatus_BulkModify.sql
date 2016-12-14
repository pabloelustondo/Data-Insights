CREATE PROCEDURE [MCDA].[DeviceSyncStatus_BulkModify]
(
	@Records [MCDA].[UDTTable_DeviceSyncStatus] READONLY
)
AS
BEGIN
	MERGE [MCDA].[DeviceSyncStatus] AS [target]
	USING @Records AS [source]
	ON
		[target].[Name] = [source].[Name]
	WHEN MATCHED THEN UPDATE SET
		[target].[Status] = [source].[Status], 
		[target].[LastSyncTime] = [source].[LastSyncTime],
		[target].[PreviousSyncTime] = [source].[PreviousSyncTime]
	WHEN NOT MATCHED
		THEN INSERT ([Name], [Status], [LastSyncTime], [PreviousSyncTime]) 
		VALUES ([source].[Name], [source].[Status], [source].[LastSyncTime], [source].[PreviousSyncTime]);
END
