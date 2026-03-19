using Baltsped.Tools.Server.Features.TeLookup.Models;

namespace Baltsped.Tools.Server.Features.TeLookup.Repository;

/// <summary>
/// Читает данные для просмотра содержимого ТЕ из Oracle
/// </summary>
public interface ITeLookupRepository
{
    /// <summary>
    /// Возвращает строки для выбранного ТЕ
    /// </summary>
    Task<IReadOnlyList<TeLookupRowModel>> GetByTeCodeAsync(
        string teCode,
        CancellationToken cancellationToken
    );
}
