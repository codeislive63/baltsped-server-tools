namespace Baltsped.Tools.Server.Pages.Dm;

// Централизированное логирование страницы замены DM через LoggerMessage
internal static partial class ReplaceLogMessages
{
    [LoggerMessage(
        EventId = 1001,
        Level = LogLevel.Warning,
        Message = "DM search validation failed for TE {TeCode}. Errors: {Errors}")]
    public static partial void SearchValidationFailed(
        ILogger logger,
        string teCode,
        IReadOnlyCollection<string> errors
    );

    [LoggerMessage(
        EventId = 1002,
        Level = LogLevel.Information,
        Message = "DM search completed for TE {TeCode}. Rows found: {ResultCount}")]
    public static partial void SearchCompleted(
        ILogger logger,
        string teCode,
        int resultCount
    );

    [LoggerMessage(
        EventId = 1003,
        Level = LogLevel.Warning,
        Message = "DM search rejected for TE {TeCode}")]
    public static partial void SearchRejected(
        ILogger logger,
        Exception exception,
        string teCode
    );

    [LoggerMessage(
        EventId = 1004,
        Level = LogLevel.Warning,
        Message = "DM update validation failed for TE {TeCode}, ItemId {ItemId}. Errors: {Errors}")]
    public static partial void UpdateValidationFailed(
        ILogger logger,
        string teCode,
        int? itemId,
        IReadOnlyCollection<string> errors
    );

    [LoggerMessage(
        EventId = 1005,
        Level = LogLevel.Information,
        Message = "DM update completed for TE {TeCode}, ItemId {ItemId}. Updated rows: {UpdatedCount}")]
    public static partial void UpdateCompleted(
        ILogger logger,
        string teCode,
        int itemId,
        int updatedCount
    );

    [LoggerMessage(
        EventId = 1006,
        Level = LogLevel.Warning,
        Message = "DM update rejected for TE {TeCode}, ItemId {ItemId}")]
    public static partial void UpdateRejected(
        ILogger logger,
        Exception exception,
        string teCode,
        int itemId
    );
}
