BEGIN TRANSACTION;
BEGIN TRY
    CREATE TABLE [dbo].[Customer](
        [ID] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](50) NOT NULL,
        [Surname] [nvarchar](50) NOT NULL,
        [CreatedBy] [nvarchar](255) NOT NULL,
        [CreatedAt] [datetime] NOT NULL,
    CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED 
      ([ID] ASC)
    WITH 
      (
        PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, 
        ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON
      ) ON [PRIMARY]
    ) ON [PRIMARY]

    ALTER TABLE [dbo].[Customer] 
      ADD CONSTRAINT [DF_Customer_CreatedBy] DEFAULT (suser_sname()) FOR [CreatedBy]

    ALTER TABLE [dbo].[Customer] 
      ADD CONSTRAINT [DF_Customer_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]

    INSERT INTO [dbo].[Customer]
      (Name, Surname)
    VALUES
      ('Dave', 'Lister')
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
END CATCH;

IF @@TRANCOUNT > 0
    COMMIT TRANSACTION;