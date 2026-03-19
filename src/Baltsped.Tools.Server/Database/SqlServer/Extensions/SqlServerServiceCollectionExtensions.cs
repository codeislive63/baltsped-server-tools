using Baltsped.Tools.Server.Database.Security;
using Baltsped.Tools.Server.Database.SqlServer.Access;
using Baltsped.Tools.Server.Database.SqlServer.Security;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Baltsped.Tools.Server.Database.SqlServer.Extensions;

/// <summary>
/// Регистрирует доступ к SQL Server и Windows impersonation
/// </summary>
public static class SqlServerServiceCollectionExtensions
{
    public static IServiceCollection AddSqlServerDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<SqlServerDatabaseOptions>()
                .Bind(configuration.GetSection(SqlServerDatabaseOptions.SectionName))
                .ValidateOnStart();

        services.AddSingleton<IValidateOptions<SqlServerDatabaseOptions>, SqlServerDatabaseOptionsValidator>();
        services.AddSingleton<IWindowsImpersonationService, WindowsImpersonationService>();

        services.AddDbContextFactory<BaltspedToolsSqlServerDbContext>((serviceProvider, options) =>
        {
            var databaseOptions = serviceProvider.GetRequiredService<IOptions<SqlServerDatabaseOptions>>().Value;

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
