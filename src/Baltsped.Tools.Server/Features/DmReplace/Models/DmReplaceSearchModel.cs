using System.ComponentModel.DataAnnotations;

namespace Baltsped.Tools.Server.Features.DmReplace.Models;

/// <summary>
/// Хранит введенный TE для поиска записей
/// </summary>
public class DmReplaceSearchModel
{
    [Required(ErrorMessage = "Введите TE")]
    [Display(Name = "TE")]
    [StringLength(64)]
    public string TeCode { get; set; } = string.Empty;
}
