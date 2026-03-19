using Baltsped.Tools.Server.Database.Oracle.Access;
using Baltsped.Tools.Server.Features.TeLookup.Models;
using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace Baltsped.Tools.Server.Features.TeLookup.Repository;

/// <summary>
/// Читает содержимое ТЕ из Oracle
/// </summary>
public sealed class TeLookupRepository(IOracleConnectionFactory oracleConnectionFactory) : ITeLookupRepository
{
    /// <summary>
    /// Возвращает строки для выбранного ТЕ
    /// </summary>
    public async Task<IReadOnlyList<TeLookupRowModel>> GetByTeCodeAsync(
        string teCode,
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT
                D.TE_CODE,
                A.ARTNR,
                A.ARTBEZ,
                D.BARCODES,
                D.BACH_CODE
            FROM SRT_TEMP_DATA D
            JOIN ART_T@WMS A
                ON TRIM(A.ARTNR) = SUBSTR(D.CODE, 1, 16)
            WHERE TRIM(D.TE_CODE) = :teCode
            ORDER BY D.BARCODES, A.ARTNR
            """;

        var rows = new List<TeLookupRowModel>();

        using var connection = await oracleConnectionFactory.CreateOpenConnectionAsync(cancellationToken);
        using var command = connection.CreateCommand();

        command.BindByName = true;
        command.CommandText = sql;
        command.Parameters.Add("teCode", OracleDbType.Varchar2, teCode, ParameterDirection.Input);

        using var reader = await command.ExecuteReaderAsync(cancellationToken);

        while (await reader.ReadAsync(cancellationToken))
        {
            rows.Add(new TeLookupRowModel
            {
                TeCode = ReadString(reader, "TE_CODE"),
                ArticleCode = ReadString(reader, "ARTNR"),
                ArticleName = ReadString(reader, "ARTBEZ"),
                Barcode = ReadString(reader, "BARCODES"),
                BatchCode = ReadString(reader, "BACH_CODE")
            });
        }

        return rows;
    }

    // Читает строку из Oracle и возвращает пустую строку вместо null
    private static string ReadString(OracleDataReader reader, string columnName)
    {
        var ordinal = reader.GetOrdinal(columnName);

        return reader.IsDBNull(ordinal)
            ? string.Empty
            : reader.GetString(ordinal).Trim();
    }
}
