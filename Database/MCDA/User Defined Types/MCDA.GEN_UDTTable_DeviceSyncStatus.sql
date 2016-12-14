CREATE TYPE [MCDA].[UDTTable_DeviceSyncStatus] AS TABLE
(
	[Name] [nvarchar](255) NOT NULL,
	[Status] [int] NOT NULL,
	[LastSyncTime] [datetime] NULL,
	[PreviousSyncTime] [datetime] NULL
)