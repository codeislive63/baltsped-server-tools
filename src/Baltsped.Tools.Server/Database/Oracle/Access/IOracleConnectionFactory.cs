using Oracle.ManagedDataAccess.Client;

namespace Baltsped.Tools.Server.Database.Oracle.Access;

/// <summary>
/// Создает открытые подключения к Oracle
/// </summary>
public interface IOracleConnectionFactory
{
    /// <summary>
    /// Создает и открывает подключение к Oracle
    /// </summary>
    Task<OracleConnection> CreateOpenConnectionAsync(CancellationToken cancellationToken);
}
