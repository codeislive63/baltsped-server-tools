using System.ComponentModel.DataAnnotations;
using Baltsped.Tools.Server.Features.TeLookup.Models;
using Baltsped.Tools.Server.Features.TeLookup.Service;
using Microsoft.AspNetCore.Mvc;

namespace Baltsped.Tools.Server.Controllers;

/// <summary>
/// Возвращает данные для просмотра содержимого ТЕ
/// </summary>
[ApiController]
[Route("api/te/lookup")]
public sealed class TeLookupController(
    ITeLookupService teLookupService,
    ILogger<TeLookupController> logger) : ControllerBase
{
    /// <summary>
    /// Выполняет поиск строк по номеру ТЕ
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TeLookupRowModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IReadOnlyList<TeLookupRowModel>>> GetAsync(
        [FromQuery] string teCode,
        CancellationToken cancellationToken)
    {
        try
        {
            var rows = await teLookupService.SearchAsync(teCode, cancellationToken);
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
        catch (Exception exception)
        {
            logger.LogError(exception, "Не удалось загрузить содержимое ТЕ {TeCode}", teCode);

            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Ошибка сервера",
                Detail = "Не удалось загрузить данные по ТЕ",
                Status = StatusCodes.Status500InternalServerError
            });
        }
    }
}