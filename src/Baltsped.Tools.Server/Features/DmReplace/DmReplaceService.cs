using System.ComponentModel.DataAnnotations;
using Baltsped.Tools.Server.Database.SqlServer.Access;
using Baltsped.Tools.Server.Database.SqlServer.Entities;
using Baltsped.Tools.Server.Features.DmReplace.Models;
using Microsoft.EntityFrameworkCore;

namespace Baltsped.Tools.Server.Features.DmReplace;

/// <summary>
/// Ищет записи для TE и выполняет замену DM кода
/// </summary>
public sealed class DmReplaceService(
    IToolsDbExecutor toolsDbExecutor,
    ILogger<DmReplaceService> logger) : IDmReplaceService
{
    /// <summary>
    /// Возвращает строки для выбранного TE
    /// </summary>
    public async Task<IReadOnlyList<DmReplaceRowModel>> SearchAsync(
        string teCode,
        CancellationToken cancellationToken)
    {
        var normalizedTeCode = NormalizeTeCode(teCode);

        var rows = await toolsDbExecutor.ExecuteAsync(
            async (dbContext, ct) =>
                await dbContext.Articles
                    .AsNoTracking()
                    .Where(article => article.Container != null && article.Container.Code == normalizedTeCode)
                    .OrderBy(article => article.Barcode)
                    .ThenBy(article => article.ItemId)
                    .Select(article => new DmReplaceRowModel
                    {
                        ItemId = article.ItemId,
                        Barcode = article.Barcode,
                        TeCode = article.Container!.Code,
                        BatchName = article.Batch != null ? article.Batch.Name : string.Empty,
                        TargetCode = article.Target != null ? article.Target.Code : string.Empty
                    })
                    .ToListAsync(ct),
            cancellationToken);

        DmReplaceLogMessages.SearchCompleted(logger, rows.Count, normalizedTeCode);

        return rows;
    }

    /// <summary>
    /// Обновляет DM код для одной строки
    /// </summary>
    public Task<DmReplaceUpdateResultModel> UpdateAsync(
    string teCode,
    int itemId,
    string? currentDm,
    string newDm,
    CancellationToken cancellationToken)
    {
        if (itemId <= 0)
        {
            throw new ValidationException("Некорректный ItemId");
        }

        var normalizedTeCode = NormalizeTeCode(teCode);
        var normalizedCurrentDm = string.IsNullOrWhiteSpace(currentDm)
            ? null
            : NormalizeDm(currentDm);
        var normalizedDm = NormalizeDm(newDm);

        return toolsDbExecutor.ExecuteAsync(async (dbContext, ct) =>
        {
            var article = await dbContext.Articles
                .AsNoTracking()
                .Where(x => x.ItemId == itemId
                    && x.Container != null
                    && x.Container.Code == normalizedTeCode)
                .Select(x => new
                {
                    x.ItemId,
                    x.Barcode
                })
                .SingleOrDefaultAsync(ct) ?? throw new ValidationException("Запись для обновления не найдена");

            if (!string.IsNullOrWhiteSpace(normalizedCurrentDm)
                && !string.Equals(article.Barcode, normalizedCurrentDm, StringComparison.Ordinal))
            {
                throw new ValidationException("Текущий DM не совпадает с записью в БД");
            }

            if (string.Equals(article.Barcode, normalizedDm, StringComparison.Ordinal))
            {
                DmReplaceLogMessages.UpdateSkippedBecauseUnchanged(logger, itemId, normalizedTeCode);

                return new DmReplaceUpdateResultModel();
            }

            var possibleDmDuplicates = await dbContext.Articles
                .AsNoTracking()
                .Where(x => x.ItemId != itemId && x.Barcode == normalizedDm)
                .Select(x => x.Barcode)
                .ToListAsync(ct);

            var dmAlreadyExists = possibleDmDuplicates.Any(existingDm =>
                string.Equals(existingDm, normalizedDm, StringComparison.Ordinal));

            if (dmAlreadyExists)
            {
                throw new ValidationException("Этот DM уже привязан к другой записи");
            }

            var previousDm = article.Barcode;

            var entity = new Article
            {
                ItemId = article.ItemId,
                Barcode = normalizedDm
            };

            dbContext.Attach(entity);
            dbContext.Entry(entity).Property(x => x.Barcode).IsModified = true;

            try
            {
                await dbContext.SaveChangesAsync(ct);
            }
            catch (DbUpdateException)
            {
                throw new ValidationException("Этот DM уже привязан к другой записи");
            }

            DmReplaceLogMessages.UpdateCompleted(logger, itemId, normalizedTeCode);

            return new DmReplaceUpdateResultModel
            {
                UpdatedCount = 1,
                UpdatedItems =
                [
                    new DmChangedItemModel
                {
                    ItemId = itemId,
                    PreviousDm = previousDm,
                    NewDm = normalizedDm
                }
                ]
            };
        }, cancellationToken);
    }

    // Нормализует TE и не пропускает пустое значение
    private static string NormalizeTeCode(string teCode)
    {
        var normalizedTeCode = teCode.Trim();

        if (string.IsNullOrWhiteSpace(normalizedTeCode))
        {
            throw new ValidationException("Введите TE");
        }

        return normalizedTeCode;
    }

    // Нормализует новый DM и не пропускает пустое значение
    private static string NormalizeDm(string dmCode)
    {
        var normalizedDm = new string(
            dmCode
                .Trim()
                .Where(ch => !char.IsWhiteSpace(ch))
                .Select(MapCyrillicToLatin)
                .ToArray());

        if (string.IsNullOrWhiteSpace(normalizedDm))
        {
            throw new ValidationException("Введите новый DM");
        }

        return normalizedDm;
    }

    private static char MapCyrillicToLatin(char value) => value switch
    {
        'А' => 'A',
        'В' => 'B',
        'Е' => 'E',
        'К' => 'K',
        'М' => 'M',
        'Н' => 'H',
        'О' => 'O',
        'Р' => 'P',
        'С' => 'C',
        'Т' => 'T',
        'У' => 'Y',
        'Х' => 'X',
        'а' => 'a',
        'в' => 'b',
        'е' => 'e',
        'к' => 'k',
        'м' => 'm',
        'н' => 'h',
        'о' => 'o',
        'р' => 'p',
        'с' => 'c',
        'т' => 't',
        'у' => 'y',
        'х' => 'x',
        _ => value
    };
}
