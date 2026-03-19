using Baltsped.Tools.Server.Features.TeLookup.Models;
using Baltsped.Tools.Server.Features.TeLookup.Repository;
using System.ComponentModel.DataAnnotations;

namespace Baltsped.Tools.Server.Features.TeLookup.Service;

/// <summary>
/// Выполняет сценарий просмотра содержимого ТЕ
/// </summary>
public sealed class TeLookupService(ITeLookupRepository teLookupRepository) : ITeLookupService
{
    /// <summary>
    /// Возвращает строки для выбранного ТЕ
    /// </summary>
    public Task<IReadOnlyList<TeLookupRowModel>> SearchAsync(
        string teCode,
        CancellationToken cancellationToken)
    {
        var normalizedTeCode = NormalizeTeCode(teCode);

        return teLookupRepository.GetByTeCodeAsync(normalizedTeCode, cancellationToken);
    }

    // Нормализует ТЕ и не пропускает пустое значение
    private static string NormalizeTeCode(string teCode)
    {
        var normalizedTeCode = teCode.Trim();

        if (string.IsNullOrWhiteSpace(normalizedTeCode))
        {
            throw new ValidationException("Введите номер ТЕ");
        }

        return normalizedTeCode;
    }
}
