using Baltsped.Tools.Server.Database.Access;
using Baltsped.Tools.Server.Database.Security;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Baltsped.Tools.Server.Database.Extensions;

/// <summary>
/// Регистрирует доступ к SQL Server и Windows impersonation
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

        services.AddDbContextFactory<BaltspedToolsDbContext>((serviceProvider, options) =>
        {
            var databaseOptions = serviceProvider.GetRequiredService<IOptions<DatabaseOptions>>().Value;

            var connectionString = new SqlConnectionStringBuilder
            {
                DataSource = databaseOptions.Server,
                InitialCatalog = databaseOptions.DatabaseName,
                Encrypt = databaseOptions.Encrypt,
                TrustServerCertificate = databaseOptions.TrustServerCertificate,
                IntegratedSecurity = true,
                MultipleActiveResultSets = false,
                ConnectTimeout = 15,
                ApplicationName = "baltsped-tools"
            }.ConnectionString;

            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(3);
            });
        });

        services.AddScoped<IToolsDbExecutor, WindowsImpersonationToolsDbExecutor>();

        return services;
    }
}
