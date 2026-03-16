using Baltsped.Tools.Server.Database.Access;
using Baltsped.Tools.Server.Database.Security;
using Microsoft.Extensions.Options;

namespace Baltsped.Tools.Server.Database.Extensions;

/// <summary>
/// Регистрирует настройки базы данных и сервис impersonation
/// </summary>
public static class DatabaseServiceCollectionExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<DatabaseOptions>()
                .Bind(configuration.GetSection(DatabaseOptions.SectionName))
                .ValidateOnStart();

        services.AddSingleton<IValidateOptions<DatabaseOptions>, DatabaseOptionsValidator>();
        services.AddSingleton<IWindowsImpersonationService, WindowsImpersonationService>();

        return services;
    }
}