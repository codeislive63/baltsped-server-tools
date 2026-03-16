using Microsoft.Extensions.Options;

namespace Baltsped.Tools.Server.Database.Access;

// Проверяет, что настройки базы и impersonation заполнены до старта приложения
public sealed class DatabaseOptionsValidator : IValidateOptions<DatabaseOptions>
{
    public ValidateOptionsResult Validate(string? name, DatabaseOptions options)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(options.Server))
        {
            errors.Add("Database:Server must be configured");
        }

        if (string.IsNullOrWhiteSpace(options.DatabaseName))
        {
            errors.Add("Database:DatabaseName must be configured");
        }

        if (string.IsNullOrWhiteSpace(options.WindowsImpersonation.Domain))
        {
            errors.Add("Database:WindowsImpersonation:Domain must be configured");
        }

        if (string.IsNullOrWhiteSpace(options.WindowsImpersonation.User))
        {
            errors.Add("Database:WindowsImpersonation:User must be configured");
        }

        if (string.IsNullOrWhiteSpace(options.WindowsImpersonation.Password))
        {
            errors.Add("Database:WindowsImpersonation:Password must be configured");
        }

        return errors.Count > 0
            ? ValidateOptionsResult.Fail(errors)
            : ValidateOptionsResult.Success;
    }
}
