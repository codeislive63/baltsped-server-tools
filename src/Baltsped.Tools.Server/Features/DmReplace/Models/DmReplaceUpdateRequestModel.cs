using System.ComponentModel.DataAnnotations;

namespace Baltsped.Tools.Server.Features.DmReplace.Models;

/// <summary>
/// Хранит данные для обновления DM кода
/// </summary>
public sealed class DmReplaceUpdateRequestModel
{
    [Required(ErrorMessage = "Введите TE")]
    [StringLength(64)]
    public string TeCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Введите текущий DM")]
    [StringLength(256)]
    public string CurrentDm { get; set; } = string.Empty;

    [Required(ErrorMessage = "Введите новый DM")]
    [StringLength(256)]
    public string NewDm { get; set; } = string.Empty;
}
