CREATE TABLE [MCDA].[DeviceSyncStatus]
(
	[Name] [nvarchar](255) NOT NULL,
	[Status] [int] NOT NULL,
	[LastSyncTime] [datetime] NULL,
	[PreviousSyncTime] [datetime] NULL,
    [ServerTime] DATETIME NOT NULL,
	CONSTRAINT [PK_BI_DeviceSyncStatus] PRIMARY KEY CLUSTERED ([Name] ASC)
)
GO

ALTER TABLE [MCDA].[DeviceSyncStatus] ADD CONSTRAINT DF_MCDA_DeviceSyncStatus DEFAULT GETUTCDATE() FOR [ServerTime]
GO


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Table Name',
    @level0type = N'SCHEMA',
    @level0name = N'MCDA',
    @level1type = N'TABLE',
    @level1name = N'DeviceSyncStatus',
    @level2type = N'COLUMN',
    @level2name = N'Name'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Current Status -1 failed 0 success 1 inprogress',
    @level0type = N'SCHEMA',
    @level0name = N'MCDA',
    @level1type = N'TABLE',
    @level1name = N'DeviceSyncStatus',
    @level2type = N'COLUMN',
    @level2name = N'Status'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Last Sync Time',
    @level0type = N'SCHEMA',
    @level0name = N'MCDA',
    @level1type = N'TABLE',
    @level1name = N'DeviceSyncStatus',
    @level2type = N'COLUMN',
    @level2name = N'LastSyncTime'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Previous Sync Time',
    @level0type = N'SCHEMA',
    @level0name = N'MCDA',
    @level1type = N'TABLE',
    @level1name = N'DeviceSyncStatus',
    @level2type = N'COLUMN',
    @level2name = N'PreviousSyncTime'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Server Time in UTC',
    @level0type = N'SCHEMA',
    @level0name = N'MCDA',
    @level1type = N'TABLE',
    @level1name = N'DeviceSyncStatus',
    @level2type = N'COLUMN',
    @level2name = N'ServerTime'