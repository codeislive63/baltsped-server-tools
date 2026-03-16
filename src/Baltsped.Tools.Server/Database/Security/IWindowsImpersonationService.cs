namespace Baltsped.Tools.Server.Database.Security;

/// <summary>
/// Выполняет код под доменной учетной записью для доступа к SQL Server
/// </summary>
public interface IWindowsImpersonationService
{
    T Run<T>(Func<T> action);

    Task<T> RunAsync<T>(Func<Task<T>> action);

    Task RunAsync(Func<Task> action);
}
