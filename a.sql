USE [IncidentManagementDB]
GO

/****** Object:  Table [dbo].[ms_users]    Script Date: 21/05/2025 09.34.18 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ms_users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](100) NULL,
	[username] [varchar](255) NULL,
	[password] [varchar](255) NULL,
	[divisi] [varchar](100) NULL,
	[departemen] [varchar](100) NULL,
	[email] [varchar](100) NULL,
	[role] [int] NULL,
	[created_at] [date] NULL,
	[updated_at] [date] NULL,
 CONSTRAINT [PK_ms_users] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [IX_ms_users_name] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [IX_ms_users_username] UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


USE [IncidentManagementDB]
GO

/****** Object:  Table [dbo].[trx_LogHistory]    Script Date: 21/05/2025 09.35.19 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[trx_LogHistory](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UnitSerialNumber] [varchar](50) NULL,
	[SalesDocument] [bigint] NULL,
	[DocumentNumber] [varchar](50) NULL,
	[POID] [int] NULL,
	[PROID] [int] NULL,
	[Description] [varchar](255) NULL,
	[IncidentType] [varchar](100) NULL,
	[PICBA] [int] NULL,
	[BAEmailDate] [date] NULL,
	[BAEmailStatus] [varchar](100) NULL,
	[PICUser] [int] NULL,
	[UserEmailDate] [date] NULL,
	[UserEmailStatus] [varchar](100) NULL,
	[OpenDate] [date] NULL,
	[CloseDate] [date] NULL,
	[FeedbackBA] [varchar](255) NULL,
	[FeedbackBADate] [date] NULL,
	[FeedbackUser] [varchar](255) NULL,
	[FeedbackUserDate] [date] NULL,
	[FlagStatus] [int] NULL,
	[Status] [varchar](100) NULL,
 CONSTRAINT [PK__ms_LogHi__3214EC27EF177441] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[trx_LogHistory]  WITH CHECK ADD  CONSTRAINT [FK_trx_LogHistory_ms_users] FOREIGN KEY([PICBA])
REFERENCES [dbo].[ms_users] ([id])
GO

ALTER TABLE [dbo].[trx_LogHistory] CHECK CONSTRAINT [FK_trx_LogHistory_ms_users]
GO

ALTER TABLE [dbo].[trx_LogHistory]  WITH CHECK ADD  CONSTRAINT [FK_trx_LogHistory_ms_users1] FOREIGN KEY([PICUser])
REFERENCES [dbo].[ms_users] ([id])
GO

ALTER TABLE [dbo].[trx_LogHistory] CHECK CONSTRAINT [FK_trx_LogHistory_ms_users1]
GO



USE [IncidentManagementDB]
GO

/****** Object:  Table [dbo].[trx_PICA]    Script Date: 21/05/2025 09.35.38 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[trx_PICA](
	[PICAID] [int] IDENTITY(1,1) NOT NULL,
	[IncidentID] [int] NULL,
	[created_at] [date] NULL,
	[created_by] [int] NULL,
	[update_at] [date] NULL,
	[update_by] [int] NULL,
 CONSTRAINT [PK__trx_PICA__3214EC277441A7ED] PRIMARY KEY CLUSTERED 
(
	[PICAID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[trx_PICA]  WITH CHECK ADD  CONSTRAINT [FK_trx_PICA_trx_LogHistory] FOREIGN KEY([IncidentID])
REFERENCES [dbo].[trx_LogHistory] ([ID])
GO

ALTER TABLE [dbo].[trx_PICA] CHECK CONSTRAINT [FK_trx_PICA_trx_LogHistory]
GO




USE [IncidentManagementDB]
GO

/****** Object:  Table [dbo].[trx_DetailPICA]    Script Date: 21/05/2025 09.35.49 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[trx_DetailPICA](
	[DetailPICAID] [int] NOT NULL,
	[PICAID] [int] NULL,
	[Problem] [varchar](255) NULL,
	[RootCaused] [varchar](255) NULL,
	[CorrectiveAction] [varchar](255) NULL,
	[PreventiveAction] [varchar](255) NULL,
	[Status] [varchar](15) NULL,
 CONSTRAINT [PK_trx_DetailPICA] PRIMARY KEY CLUSTERED 
(
	[DetailPICAID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[trx_DetailPICA]  WITH CHECK ADD  CONSTRAINT [FK_trx_DetailPICA_trx_PICA] FOREIGN KEY([PICAID])
REFERENCES [dbo].[trx_PICA] ([PICAID])
GO

ALTER TABLE [dbo].[trx_DetailPICA] CHECK CONSTRAINT [FK_trx_DetailPICA_trx_PICA]
GO

