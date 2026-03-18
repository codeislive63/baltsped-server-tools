using System.ComponentModel.DataAnnotations;
using Baltsped.Tools.Server.Features.DmReplace;
using Baltsped.Tools.Server.Features.DmReplace.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Baltsped.Tools.Server.Pages.Dm;

/// <summary>
/// Обрабатывает страницу замены DM кодов
/// </summary>
public class ReplaceModel(IDmReplaceService dmReplaceService, ILogger<ReplaceModel> logger) : PageModel
{
    [BindProperty]
    public DmReplaceSearchModel Search { get; set; } = new();

    public IReadOnlyList<DmReplaceRowModel> Results { get; private set; } = [];

    public DmReplaceUpdateResultModel? UpdateSummary { get; private set; }

    public IReadOnlyCollection<string> Errors { get; private set; } = [];

    public bool HasResults => Results.Count > 0;

    /// <summary>
    /// Инициализирует страницу замены DM кодов
    /// </summary>
    public void OnGet()
    {
    }

    /// <summary>
    /// Выполняет поиск записей по TE
    /// </summary>
    public async Task<IActionResult> OnPostSearchAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var errors = Validate(Search);
        if (errors.Count > 0)
        {
            Errors = errors;
            ReplaceLogMessages.SearchValidationFailed(logger, Search.TeCode, errors);
            return Page();
        }

        try
        {
            await LoadResultsAsync(Search.TeCode, cancellationToken);

            if (Results.Count == 0)
            {
                Errors = ["По заданному TE записи не найдены"];
            }

            ReplaceLogMessages.SearchCompleted(logger, Search.TeCode, Results.Count);
            return Page();
        }
        catch (ValidationException ex)
        {
            Errors = [ex.Message];
            ReplaceLogMessages.SearchRejected(logger, ex, Search.TeCode);
            return Page();
        }
    }

    /// <summary>
    /// Обновляет DM код для выбранной строки
    /// </summary>
    public async Task<IActionResult> OnPostUpdateRowAsync(
        [FromForm] string teCode,
        [FromForm] int itemId,
        [FromForm] string newDm,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        Search = new DmReplaceSearchModel
        {
            TeCode = teCode
        };

        var errors = Validate(Search);

        if (itemId <= 0)
        {
            errors.Add("Некорректный ItemId для обновления");
        }

        if (errors.Count > 0)
        {
            return await ReturnWithErrorsAsync(
                errors,
                teCode,
                loadResults: true,
                cancellationToken: cancellationToken,
                itemId: itemId);
        }

        try
        {
            UpdateSummary = await dmReplaceService.UpdateAsync(teCode, itemId, newDm, cancellationToken);
            await LoadResultsAsync(teCode, cancellationToken);

            ReplaceLogMessages.UpdateCompleted(
                logger,
                teCode,
                itemId,
                UpdateSummary.UpdatedCount);

            return Page();
        }
        catch (ValidationException ex)
        {
            Errors = [ex.Message];
            await LoadResultsAsync(teCode, cancellationToken);

            ReplaceLogMessages.UpdateRejected(logger, ex, teCode, itemId);
            return Page();
        }
    }

    // Загружает результаты поиска для выбранного TE
    private async Task LoadResultsAsync(string teCode, CancellationToken cancellationToken)
    {
        Results = await dmReplaceService.SearchAsync(teCode, cancellationToken);
    }

    // Возвращает страницу с ошибками и при необходимости повторно загружает результаты
    private async Task<IActionResult> ReturnWithErrorsAsync(
        IReadOnlyCollection<string> errors,
        string teCode,
        bool loadResults,
        CancellationToken cancellationToken,
        int? itemId = null)
    {
        Errors = errors;

        if (loadResults)
        {
            await LoadResultsAsync(teCode, cancellationToken);
        }

        ReplaceLogMessages.UpdateValidationFailed(logger, teCode, itemId, errors);
        return Page();
    }

    // Проверяет модель через data annotations и собирает текст ошибок
    private static List<string> Validate(object model)
    {
        var context = new ValidationContext(model);
        var validationResults = new List<ValidationResult>();

        Validator.TryValidateObject(model, context, validationResults, validateAllProperties: true);

        return
        [
            .. validationResults
                .Where(x => !string.IsNullOrWhiteSpace(x.ErrorMessage))
                .Select(x => x.ErrorMessage!)
                .Distinct()
        ];
    }
}
