using Baltsped.Tools.Server.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Baltsped.Tools.Server.Database;

/// <summary>
/// Контекст БД для таблиц, с которыми работает сервер
/// </summary>
public class BaltspedToolsDbContext(DbContextOptions<BaltspedToolsDbContext> options) : DbContext(options)
{
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Batch> Batches => Set<Batch>();
    public DbSet<Container> Containers => Set<Container>();
    public DbSet<Target> Targets => Set<Target>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BaltspedToolsDbContext).Assembly);
    }
}
