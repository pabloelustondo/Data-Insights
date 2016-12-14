CREATE PROCEDURE [MCDA].[DeviceSyncStatus_Delete]
(
@Name  NVARCHAR(255)
)
AS
BEGIN
	SET NOCOUNT ON;
	DELETE FROM [MCDA].[DeviceSyncStatus]
	WHERE
		[Name] = @Name
END
