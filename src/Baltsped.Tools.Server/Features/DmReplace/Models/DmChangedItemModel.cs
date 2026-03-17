namespace Baltsped.Tools.Server.Features.DmReplace.Models;

/// <summary>
/// Хранит старое и новое значение DM для измененной строки
/// </summary>
public class DmChangedItemModel
{
    public int ItemId { get; set; }

    public string PreviousDm { get; set; } = string.Empty;

    public string NewDm { get; set; } = string.Empty;
}
