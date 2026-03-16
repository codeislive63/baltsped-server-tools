namespace Baltsped.Tools.Server.Database.Entities;

/// <summary>
/// Запись изделия в сортировочной базе с привязкой к TE, партии и целевому направлению
/// </summary>
public class Article
{
    public int ItemId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public int BatchId { get; set; }
    public int ContainerId { get; set; }
    public int TargetId { get; set; }
    public DateTime? TimeInducted { get; set; }
    public DateTime? TimeSorted { get; set; }

    public Batch? Batch { get; set; }
    public Container? Container { get; set; }
    public Target? Target { get; set; }
}
