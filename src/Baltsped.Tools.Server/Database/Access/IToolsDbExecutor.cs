namespace Baltsped.Tools.Server.Database.Access;

/// <summary>
/// Выполняет операции с контекстом БД внутри impersonation scope
/// </summary>
public interface IToolsDbExecutor
{
    Task<T> ExecuteAsync<T>(
        Func<BaltspedToolsDbContext, CancellationToken, 
        Task<T>> action,
        CancellationToken cancellationToken = default
    );

    Task ExecuteAsync(
        Func<BaltspedToolsDbContext, CancellationToken,
        Task> action,
        CancellationToken cancellationToken = default
    );
}
