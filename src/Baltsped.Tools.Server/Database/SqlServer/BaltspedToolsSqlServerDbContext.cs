using Baltsped.Tools.Server.Database.SqlServer.Entities;
using Microsoft.EntityFrameworkCore;

namespace Baltsped.Tools.Server.Database.SqlServer;

/// <summary>
/// Контекст БД для таблиц, с которыми работает сервер
/// </summary>
public class BaltspedToolsSqlServerDbContext(DbContextOptions<BaltspedToolsSqlServerDbContext> options) : DbContext(options)
{
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Batch> Batches => Set<Batch>();
    public DbSet<Container> Containers => Set<Container>();
    public DbSet<Target> Targets => Set<Target>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BaltspedToolsSqlServerDbContext).Assembly);
    }
}
