using System.ComponentModel.DataAnnotations;
using Baltsped.Tools.Server.Features.DmReplace;
using Baltsped.Tools.Server.Features.DmReplace.Models;
using Microsoft.AspNetCore.Mvc;

namespace Baltsped.Tools.Server.Controllers;

/// <summary>
/// Возвращает данные и выполняет замену DM кодов
/// </summary>
[ApiController]
[Route("api/dm/replace")]
public sealed class DmReplaceController(
    IDmReplaceService dmReplaceService,
    ILogger<DmReplaceController> logger) : ControllerBase
{
    /// <summary>
    /// Выполняет поиск записей по номеру ТЕ
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<DmReplaceRowModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyList<DmReplaceRowModel>>> SearchAsync(
        [FromQuery] string teCode,
        CancellationToken cancellationToken)
    {
        try
        {
            var rows = await dmReplaceService.SearchAsync(teCode, cancellationToken);
            return Ok(rows);
        }
        catch (ValidationException exception)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Ошибка валидации",
                Detail = exception.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
    }

    /// <summary>
    /// Обновляет DM код для выбранной строки
    /// </summary>
    [HttpPost("{itemId:int}")]
    [ProducesResponseType(typeof(DmReplaceUpdateResultModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<DmReplaceUpdateResultModel>> UpdateAsync(
        int itemId,
        [FromBody] DmReplaceUpdateRequestModel request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await dmReplaceService.UpdateAsync(
                request.TeCode,
                itemId,
                request.CurrentDm,
                request.NewDm,
                cancellationToken);

            return Ok(result);
        }
        catch (ValidationException exception)
        {
            logger.LogWarning(exception, "Не удалось обновить DM код для ItemId {ItemId}", itemId);

            return BadRequest(new ProblemDetails
            {
                Title = "Ошибка валидации",
                Detail = exception.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
    }
}
