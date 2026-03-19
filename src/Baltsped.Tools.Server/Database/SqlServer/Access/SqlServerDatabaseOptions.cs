using System.ComponentModel.DataAnnotations;

namespace Baltsped.Tools.Server.Database.SqlServer.Access;

/// <summary>
/// Настройки подключения к SQL Server через Windows impersonation
/// </summary>
public sealed class SqlServerDatabaseOptions
{
    public const string SectionName = "Database";

    [Required]
    public string Server { get; init; } = string.Empty;

    [Required]
    public string DatabaseName { get; init; } = string.Empty;

    public bool Encrypt { get; init; }

    public bool TrustServerCertificate { get; init; } = true;

    public WindowsImpersonationOptions WindowsImpersonation { get; init; } = new();
}

/// <summary>
/// Учетные данные доменной записи, под которой выполняются запросы к БД
/// </summary>
public sealed class WindowsImpersonationOptions
{
    [Required]
    public string Domain { get; init; } = string.Empty;

    [Required]
    public string User { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}
