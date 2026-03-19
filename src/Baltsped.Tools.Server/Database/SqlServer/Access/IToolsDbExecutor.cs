using Baltsped.Tools.Server.Database.SqlServer;

namespace Baltsped.Tools.Server.Database.SqlServer.Access;

/// <summary>
/// Выполняет операции с контекстом БД внутри impersonation scope
/// </summary>
public interface IToolsDbExecutor
{
    Task<T> ExecuteAsync<T>(
        Func<BaltspedToolsSqlServerDbContext, CancellationToken, 
        Task<T>> action,
        CancellationToken cancellationToken = default
    );

    Task ExecuteAsync(
        Func<BaltspedToolsSqlServerDbContext, CancellationToken,
        Task> action,
        CancellationToken cancellationToken = default
    );
}
