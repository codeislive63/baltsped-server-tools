using System.ComponentModel.DataAnnotations;
using Baltsped.Tools.Server.Features.TeLookup.Models;
using Baltsped.Tools.Server.Features.TeLookup.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Baltsped.Tools.Server.Pages.Te;

/// <summary>
/// Отображает страницу просмотра содержимого ТЕ
/// </summary>
public sealed class LookupModel(
    ITeLookupService teLookupService,
    ILogger<LookupModel> logger) : PageModel
{
    /// <summary>
    /// Номер ТЕ для поиска
    /// </summary>
    [BindProperty(SupportsGet = true)]
    public string? TeCode { get; set; } = string.Empty;

    /// <summary>
    /// Найденные строки
    /// </summary>
    public IReadOnlyList<TeLookupRowModel> Rows { get; private set; } = [];

    /// <summary>
    /// Признак того, что поиск был выполнен
    /// </summary>
    public bool SearchPerformed { get; private set; }

    /// <summary>
    /// Обрабатывает открытие страницы и поиск по номеру ТЕ
    /// </summary>
    public async Task OnGetAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(TeCode))
        {
            return;
        }

        SearchPerformed = true;

        try
        {
            Rows = await teLookupService.SearchAsync(TeCode, cancellationToken);
        }
        catch (ValidationException exception)
        {
            ModelState.AddModelError(string.Empty, exception.Message);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Не удалось загрузить содержимое ТЕ {TeCode}", TeCode);
            ModelState.AddModelError(string.Empty, "Не удалось загрузить данные по ТЕ");
        }
    }
}
