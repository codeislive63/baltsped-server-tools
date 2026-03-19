using Oracle.ManagedDataAccess.Client;

namespace Baltsped.Tools.Server.Database.Oracle.Access;

/// <summary>
/// Создает подключения к Oracle по строке подключения из конфигурации
/// </summary>
/// <remarks>
/// Создает фабрику подключений к Oracle
/// </remarks>
public sealed class OracleConnectionFactory(IConfiguration configuration) : IOracleConnectionFactory
{
    private const string OracleConnectionStringName = "Oracle";

    private readonly string _connectionString = configuration.GetConnectionString(OracleConnectionStringName)
            ?? throw new InvalidOperationException(
                $"Строка подключения '{OracleConnectionStringName}' не настроена"
    );

    /// <summary>
    /// Создает и открывает подключение к Oracle
    /// </summary>
    public async Task<OracleConnection> CreateOpenConnectionAsync(CancellationToken cancellationToken)
    {
        var connection = new OracleConnection(_connectionString);

        await connection.OpenAsync(cancellationToken);

        return connection;
    }
}
