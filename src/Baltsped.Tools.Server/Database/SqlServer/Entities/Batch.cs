namespace Baltsped.Tools.Server.Database.SqlServer.Entities;

/// <summary>
/// Партия, к которой относятся записи Article
/// </summary>
public class Batch
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Article> Articles { get; } = [];
}
