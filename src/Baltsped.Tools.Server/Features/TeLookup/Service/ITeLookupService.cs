using Baltsped.Tools.Server.Features.TeLookup.Models;

namespace Baltsped.Tools.Server.Features.TeLookup.Service;

/// <summary>
/// Выполняет сценарий просмотра содержимого ТЕ
/// </summary>
public interface ITeLookupService
{
    /// <summary>
    /// Возвращает строки для выбранного ТЕ
    /// </summary>
    Task<IReadOnlyList<TeLookupRowModel>> SearchAsync(
        string teCode,
        CancellationToken cancellationToken
    );
}
