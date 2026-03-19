namespace Baltsped.Tools.Server.Database.SqlServer.Entities;

/// <summary>
/// Сущность TE-контейнера, в котором находятся записи Article
/// </summary>
public class Container
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTime? TimeLastUpdate { get; set; }

    public ICollection<Article> Articles { get; } = [];
}
