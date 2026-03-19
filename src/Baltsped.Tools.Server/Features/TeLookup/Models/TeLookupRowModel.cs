namespace Baltsped.Tools.Server.Features.TeLookup.Models;

/// <summary>
/// Строка результата для просмотра содержимого ТЕ
/// </summary>
public sealed class TeLookupRowModel
{
    /// <summary>
    /// Код ТЕ
    /// </summary>
    public string TeCode { get; init; } = string.Empty;

    /// <summary>
    /// Артикул
    /// </summary>
    public string ArticleCode { get; init; } = string.Empty;

    /// <summary>
    /// Наименование артикула
    /// </summary>
    public string ArticleName { get; init; } = string.Empty;

    /// <summary>
    /// Штрихкод
    /// </summary>
    public string Barcode { get; init; } = string.Empty;

    /// <summary>
    /// Код партии
    /// </summary>
    public string BatchCode { get; init; } = string.Empty;
}
