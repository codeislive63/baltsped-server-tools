namespace Baltsped.Tools.Server.Features.DmReplace.Models;

/// <summary>
/// Возвращает итог обновления DM кода
/// </summary>
public class DmReplaceUpdateResultModel
{
    public int UpdatedCount { get; set; }

    public IReadOnlyList<DmChangedItemModel> UpdatedItems { get; set; } = [];
}
