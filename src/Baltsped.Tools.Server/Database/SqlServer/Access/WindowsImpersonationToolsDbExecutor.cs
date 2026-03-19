using Baltsped.Tools.Server.Database.SqlServer;
using Baltsped.Tools.Server.Database.SqlServer.Security;
using Microsoft.EntityFrameworkCore;

namespace Baltsped.Tools.Server.Database.SqlServer.Access;

/// <summary>
/// Создает контекст и выполняет запрос целиком внутри Windows impersonation
/// </summary>
public sealed class WindowsImpersonationToolsDbExecutor(
    IDbContextFactory<BaltspedToolsSqlServerDbContext> dbContextFactory,
    IWindowsImpersonationService windowsImpersonationService)
    : IToolsDbExecutor
{
    public Task<T> ExecuteAsync<T>(
        Func<BaltspedToolsSqlServerDbContext, CancellationToken,
        Task<T>> action,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        return windowsImpersonationService.RunAsync(async () =>
        {
            await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
            await dbContext.Database.OpenConnectionAsync(cancellationToken);

            return await action(dbContext, cancellationToken);
        });
    }

    public Task ExecuteAsync(
        Func<BaltspedToolsSqlServerDbContext, CancellationToken,
        Task> action,
        CancellationToken cancellationToken = default)
    {
        return ExecuteAsync(async (dbContext, ct) =>
        {
            await action(dbContext, ct);
            return true;
        }, cancellationToken);
    }
}
