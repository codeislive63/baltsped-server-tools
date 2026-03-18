namespace Baltsped.Tools.Server.Features.DmReplace;

// Централизует логирование сервиса замены DM через LoggerMessage
internal static partial class DmReplaceLogMessages
{
    [LoggerMessage(
        EventId = 2001,
        Level = LogLevel.Information,
        Message = "Loaded {RowCount} rows for TE {TeCode}")]
    public static partial void SearchCompleted(
        ILogger logger,
        int rowCount,
        string teCode
    );

    [LoggerMessage(
        EventId = 2002,
        Level = LogLevel.Information,
        Message = "DM for item {ItemId} in TE {TeCode} is unchanged")]
    public static partial void UpdateSkippedBecauseUnchanged(
        ILogger logger,
        int itemId,
        string teCode
    );

    [LoggerMessage(
        EventId = 2003,
        Level = LogLevel.Information,
        Message = "Updated DM for item {ItemId} in TE {TeCode}")]
    public static partial void UpdateCompleted(
        ILogger logger,
        int itemId,
        string teCode
    );
}
