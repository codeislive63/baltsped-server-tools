namespace Baltsped.Tools.Server.Features.Catalog.Models;

/// <summary>
/// Описывает карточку инструмента на главной странице
/// </summary>
public sealed class CatalogToolModel
{
    /// <summary>
    /// Отображаемое название инструмента
    /// </summary>
    public required string Title { get; init; }

    /// <summary>
    /// Краткое описание инструмента
    /// </summary>
    public string Description { get; init; } = string.Empty;

    /// <summary>
    /// Маршрут для перехода к инструменту
    /// </summary>
    public string Route { get; init; } = string.Empty;

    /// <summary>
    /// Признак доступности инструмента
    /// </summary>
    public bool IsAvailable { get; init; }
}
