namespace Baltsped.Tools.Server.Features.DmReplace.Models;

/// <summary>
/// Представляет строку в таблице результатов замены DM
/// </summary>
public class DmReplaceRowModel
{
    public int ItemId { get; set; }

    public string Barcode { get; set; } = string.Empty;

    public string TeCode { get; set; } = string.Empty;

    public string BatchName { get; set; } = string.Empty;

    public string TargetCode { get; set; } = string.Empty;
}
