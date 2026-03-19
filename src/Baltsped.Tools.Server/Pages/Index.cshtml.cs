using Baltsped.Tools.Server.Features.Catalog.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Baltsped.Tools.Server.Pages;

/// <summary>
/// Отображает каталог доступных складских инструментов
/// </summary>
public sealed class IndexModel : PageModel
{
    /// <summary>
    /// Список инструментов для главной страницы
    /// </summary>
    public IReadOnlyList<CatalogToolModel> Tools { get; } =
    [
        new CatalogToolModel
        {
            Title = "Печать листов вброса",
            Description = "Подготовка и печать рабочих листов",
            Route = "/documents/stuffing-sheet",
            IsAvailable = false
        },
        new CatalogToolModel
        {
            Title = "Проверка содержимого ТЕ",
            Description = "Проверка состава транспортной единицы",
            Route = "/te/check",
            IsAvailable = false
        },
        new CatalogToolModel
        {
            Title = "Просмотр содержимого ТЕ",
            Description = "Просмотр содержимого по номеру ТЕ",
            Route = "/te/lookup",
            IsAvailable = false
        },
        new CatalogToolModel
        {
            Title = "Создание заказа ДМ",
            Description = "Формирование заказа для DM-операций",
            Route = "/dm/order",
            IsAvailable = false
        },
        new CatalogToolModel
        {
            Title = "DM-коды",
            Description = "Замена DM-кодов и связанные операции",
            Route = "/dm/replace",
            IsAvailable = true
        },
        new CatalogToolModel
        {
            Title = "Составление ЗНТ",
            Description = "Формирование ЗНТ по данным системы",
            Route = "/box-master",
            IsAvailable = false
        }
    ];

    /// <summary>
    /// Обрабатывает открытие главной страницы
    /// </summary>
    public void OnGet()
    {
    }
}
