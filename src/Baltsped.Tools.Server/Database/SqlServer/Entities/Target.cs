namespace Baltsped.Tools.Server.Database.SqlServer.Entities;

/// <summary>
/// Целевое направление сортировки для записи Article
/// </summary>
public class Target
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;

    public ICollection<Article> Articles { get; } = [];
}
