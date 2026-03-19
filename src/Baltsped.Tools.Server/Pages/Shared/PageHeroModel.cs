namespace Baltsped.Tools.Server.Pages.Shared;

/// <summary>
/// Модель hero-блока для страниц инструментов
/// </summary>
public sealed class PageHeroModel
{
    /// <summary>
    /// Заголовок страницы
    /// </summary>
    public string Title { get; init; } = string.Empty;

    /// <summary>
    /// Описание страницы
    /// </summary>
    public string Description { get; init; } = string.Empty;

    /// <summary>
    /// Текст кнопки возврата
    /// </summary>
    public string BackText { get; init; } = "Назад в каталог";

    /// <summary>
    /// Адрес для кнопки возврата
    /// </summary>
    public string BackPage { get; init; } = "/Index";
}
