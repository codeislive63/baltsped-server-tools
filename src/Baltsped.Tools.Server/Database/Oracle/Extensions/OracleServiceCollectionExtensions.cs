using Baltsped.Tools.Server.Database.Oracle.Access;

namespace Baltsped.Tools.Server.Database.Oracle.Extensions;

/// <summary>
/// Регистрирует инфраструктуру доступа к Oracle
/// </summary>
public static class OracleServiceCollectionExtensions
{
    /// <summary>
    /// Добавляет сервисы доступа к Oracle
    /// </summary>
    public static IServiceCollection AddOracleDatabase(this IServiceCollection services)
    {
        services.AddSingleton<IOracleConnectionFactory, OracleConnectionFactory>();

        return services;
    }
}
